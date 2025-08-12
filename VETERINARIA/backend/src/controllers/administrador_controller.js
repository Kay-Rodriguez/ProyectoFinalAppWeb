import Administrador from "../models/Administrador.js"
import {sendMailToRegister, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose" 
/*
const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Todos los campos son obligatorios."})
    const verificarEmailBDD = await Administrador.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    
    const nuevoAdministrador = new Administrador(req.body)
    nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(password)
    const token = nuevoAdministrador.crearToken()
    nuevoAdministrador.token = token 
    await sendMailToRegister(email,token)
    await nuevoAdministrador.save()

    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}*/
const registro = async (req, res) => {
    try {
        const { nombre, apellido, direccion, celular, email, password } = req.body;
        
        console.log("REQ BODY:", req.body); // DEBUG

        if ([nombre, apellido, email, password].includes("")) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios." });
        }

        const verificarEmailBDD = await Administrador.findOne({ email });
        if (verificarEmailBDD) {
            return res.status(400).json({ msg: "El email ya está registrado" });
        }

        const nuevoAdministrador = new Administrador({
            nombre,
            apellido,
            direccion,
            celular,
            email,
            password: await Administrador.prototype.encrypPassword(password),
            token: Math.random().toString(36).slice(2)
        });

        await sendMailToRegister(email, nuevoAdministrador.token); // Si quieres desactivar temporalmente, comenta esta línea
        await nuevoAdministrador.save();

        return res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });

    } catch (error) {
        console.log("ERROR REGISTRO:", error);
        return res.status(500).json({ msg: "Error al registrar usuario", error: error.message });
    }
}

const confirmarMail = async (req,res)=>{
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const administradorBDD = await Administrador.findOne({token:req.params.token})
    if(!administradorBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    administradorBDD.token = null
    administradorBDD.confirmEmail=true
    await administradorBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

//Etapa 1
const recuperarPassword = async(req, res) => {
    //Primera validacion: Obtener el email 
    const {email} = req.body
    //2: Verificar que el correo electronico no este en blanco
    if (Object.values(req.body).includes("")) return res.status(404).json({msg: "Todos los campos deben ser llenados obligatoriamente."})

    //Verificar que exista el correo electronico en la base de datos
    const administradorBDD = await Administrador.findOne({email})

    if (!administradorBDD) return res.status(404).json({msg: "Lo sentimos, el usuario no existe"})
    //3
    const token = administradorBDD.crearToken()
    administradorBDD.token = token

    //Enviar email
    await sendMailToRecoveryPassword(email,token)
    await administradorBDD.save()
    //4
    res.status(200).json({msg: "Revisa tu correo electrónico para restablecer tu contraseña."})
}

//Etapa 2
const comprobarTokenPassword = async (req, res) => {
    //1
    const {token} = req.params
    //2
    const administradorBDD = await Administrador. findOne({token})
    if (administradorBDD.token !== token) return res.status (404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    //3
    await administradorBDD.save()
    //4
    
    res.status(200).json({msg:"Token confirmado ya puedes crear tu password"})
}

//Etapa 3
const crearNuevoPassword = async (req, res) => {
    //1
    const {password,confirmpassword} = req.body
    //2
    if (Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos debes llenar todos los campos"})
    
    if (password!== confirmpassword) return res.status(404).json({msg: "Lo sentimos, los passwords no coinciden"})
    
    const administradorBDD = await Administrador.findOne({token:req.params.token})
    console.log(administradorBDD);

    if (administradorBDD.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos no se puede validar su cuenta"})

    //3
    administradorBDD.token = null
    administradorBDD.password = await administradorBDD.encrypPassword(password)
    await administradorBDD.save()
    //4
    res.status(200).json({msg:"Ya puede iniciar sesion con su nueva contraseña."})
}
// AGREGAR AL DOCUMENTO 
const login = async (req, res) => {
    //1
    const {email, password} = req.body
    //2
    if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Todos los campos son obligatorios."})
    
    const administradorBDD = await Administrador.findOne({email}).select("-status -__v -token -createdAt -updateAt")   //Quitar de la base de datos los siguientes campos
    
    //Verificar que el usuario ha creado la cuenta.
    if (administradorBDD?.confirmEmail === false) return res.status(401).json({msg: "Su usuario debe estar registrado antes de iniciar sesión."})
    //Verificar que el email del usuario exista en la base de datos.
    if(!administradorBDD) return res.status(404).json({msg: "Lo sentimos, el usuario no existe."})
    
    const verificarPassword = await administradorBDD.matchPassword(password)

    if (!verificarPassword) return res.status(401).json({msg: "Lo sentimos, la contraseña es incorrecta."})
    //3
    const{nombre, apellido, direccion, telefono, _id, rol} = administradorBDD

    const tokenJWT = crearTokenJWT(administradorBDD._id,administradorBDD.rol)

    //4: Enviar los siguientes campos al frontend
    res.status(200).json({
        token:tokenJWT,
        rol,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
    })
}

const perfil = (req,res) =>{
    const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.administradorBDD
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    const {nombre,apellido,direccion,celular,email} = req.body
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"});
    const administradorBDD = await Administrador.findById(id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`})
    if (administradorBDD.email != email)
    {
        const administradorBDDMail = await Administrador.findOne({email})
        if (administradorBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el email existe ya se encuentra registrado`})  
        }
    }
        administradorBDD.nombre = nombre ?? administradorBDD.nombre
        administradorBDD.apellido = apellido ??administradorBDDD.apellido
        administradorBDD.direccion = direccion ?? administradorBDDrioBDD.direccion
        administradorBDD.celular = celular ?? administradorBDD.celular
        administradorBDD.email = email ?? administradorBDD.email
        await administradorBDD.save()
        console.log(administradorBDD)
        res.status(200).json(administradorBDD)
}

const actualizarPassword = async (req,res)=>{
    const administradorBDD = await Administrador.findById(req.administradorBDD._id)
    if(!administradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el adminstrador ${id}`})
    const verificarPassword = await administradorBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    administradorBDD.password = await administradorBDD.encrypPassword(req.body.passwordnuevo)
    await administradorBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login,
    perfil, 
    actualizarPerfil,
    actualizarPassword
}
