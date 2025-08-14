import AgenteSAC from "../models/AgenteSAC.js"
import Afiliado from "../models/Afiliado.js" 
import { sendMailToOwner } from "../config/nodemailer.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"
import mongoose from "mongoose"
import { crearTokenJWT } from "../middlewares/JWT.js"

/*const registrarAgenteSAC  = async(req,res)=>{

    //-----------------------1
    const {emailPropietario} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    //-----------------------2
    const verificarEmailBDD = await AgenteSAC.findOne({emailPropietario})
    
    console.log(verificarEmailBDD);
    
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    //-----------------------3
    const password = Math.random().toString(36).toUpperCase().slice(2, 5)

    const nuevoAgenteSAC = new AgenteSAC({
        ...req.body,
        passwordPropietario: await AgenteSAC.prototype.encrypPassword("VIDA"+password),
        administrador: req.administradorBDD?._id
    })
    
    if(req.files?.imagen){
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:'agenteSACs'})
        nuevoAgenteSAC.avatarContrato = secure_url
        nuevoAgenteSAC.avatarContratoID = public_id
        await fs.unlink(req.files.imagen.tempFilePath)
    }

    if (req.body?.avatarContratoIA) {
    // data:image/png;base64,iVBORw0KGgjbjgfyvh
    // iVBORw0KGgjbjgfyvh
    const base64Data = req.body.avatarContratoIA.replace(/^data:image\/\w+;base64,/, '')
    // iVBORw0KGgjbjgfyvh  -  010101010101010101
    const buffer = Buffer.from(base64Data, 'base64')
    const { secure_url } = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'agenteSACs', resource_type: 'auto' }, (error, response) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
        stream.end(buffer)
    })
        nuevoAgenteSAC.avatarContratoIA = secure_url
    }

    await nuevoAgenteSAC.save()
    
    
    await sendMailToOwner(emailPropietario,"VIDA"+password) //VET4FEE
    
    
    //-----------------------4
    res.status(201).json({msg:"Registro exitoso de la Contrato y correo enviado al propietario"})

}*/
const registrarAgenteSAC = async (req, res) => {
    try {
        //-----------------------1
        let { emailPropietario } = req.body;

        // Normalizar email
        if (emailPropietario) {
            emailPropietario = emailPropietario.trim().toLowerCase();
            req.body.emailPropietario = emailPropietario;
        }

        // Validar campos vacíos
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }

        //-----------------------2 - Verificar duplicado
        const verificarEmailBDD = await AgenteSAC.findOne({ emailPropietario });
        if (verificarEmailBDD) {
            return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
        }

        //-----------------------3 - Generar contraseña una sola vez
        const passwordGenerada = "VIDA" + Math.random().toString(36).toUpperCase().slice(2, 5);

        const nuevoAgenteSAC = new AgenteSAC({
            ...req.body,
            passwordPropietario: await AgenteSAC.prototype.encrypPassword(passwordGenerada),
            administrador: req.administradorBDD?._id
        });

        //-----------------------4 - Imagen normal
        if (req.files?.imagen) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                req.files.imagen.tempFilePath,
                { folder: 'agenteSACs' }
            );
            nuevoAgenteSAC.avatarContrato = secure_url;
            nuevoAgenteSAC.avatarContratoID = public_id;
            await fs.unlink(req.files.imagen.tempFilePath);
        }

        //-----------------------5 - Imagen IA
        if (req.body?.avatarContratoIA) {
            const base64Data = req.body.avatarContratoIA.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const { secure_url } = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'agenteSACs', resource_type: 'auto' },
                    (error, response) => {
                        if (error) reject(error);
                        else resolve(response);
                    }
                );
                stream.end(buffer);
            });
            nuevoAgenteSAC.avatarContratoIA = secure_url;
        }

        //-----------------------6 - Guardar en BD con manejo de error de duplicado
        try {
            await nuevoAgenteSAC.save();
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
            }
            throw error;
        }

        //-----------------------7 - Enviar correo
        let correoEnviado = false;
        try {
            await sendMailToOwner(emailPropietario, passwordGenerada);
            correoEnviado = true;
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }

        //-----------------------8 - Respuesta final
        if (correoEnviado) {
            res.status(201).json({ msg: "Registro exitoso y correo enviado al propietario" });
        } else {
            res.status(201).json({ msg: "Registro exitoso, pero el correo no pudo enviarse" });
        }

    } catch (error) {
        console.error("Error en registrarAgenteSAC:", error);
        res.status(500).json({ msg: "Ocurrió un error en el registro" });
    }
};

const listarAgentesSAC = async (req,res)=>{
    if (req.agenteSACBDD?.rol ==="agenteSAC"){
        const agentes = await AgenteSAC.find(req.agenteSACBDD._id).select("-salida -createdAt -updatedAt -__v").populate('administrador','_id nombre apellido')
        res.status(200).json(agentes)
    }
    else{
        const agentes = await AgenteSAC.find({estadoContrato:true}).where('administrador').equals(req.administradorBDD).select("-salida -createdAt -updatedAt -__v").populate('administrador','_id nombre apellido')
        res.status(200).json(agentes)
    }
}

const detalleAgenteSAC = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`});
    const agente = await AgenteSAC.findById(id).select("-createdAt -updatedAt -__v").populate('administrador','_id nombre apellido')
    const afiliado = await Afiliado.find().where('agenteSAC').equals(id)
    res.status(200).json({
        agente,
        afiliado
    })

}

const eliminarAgenteSAC = async (req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`})
    const {salidaContrato} = req.body
    await AgenteSAC.findByIdAndUpdate(req.params.id,{salidaContrato:Date.parse(salidaContrato),estadoContrato:false})
    res.status(200).json({msg:"Fecha de salida de la Contrato registrado exitosamente"})
}
const actualizarAgenteSAC = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`})
    if (req.files?.imagen) {
        const agenteSAC = await AgenteSAC.findById(id)
        if (agenteSAC.avatarContratoID) {
            await cloudinary.uploader.destroy(agenteSAC.avatarContratoID);
        }
        const cloudiResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: 'agenteSACs' });
        req.body.avatarContrato = cloudiResponse.secure_url;
        req.body.avatarContratoID = cloudiResponse.public_id;
        await fs.unlink(req.files.imagen.tempFilePath);
    }
    await AgenteSAC.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({msg:"Actualización exitosa del agenteSAC"})
}
const loginPropietario = async(req,res)=>{
    const {email:emailPropietario,password:passwordPropietario} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const agenteSACBDD = await AgenteSAC.findOne({emailPropietario})
    if(!agenteSACBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await agenteSACBDD.matchPassword(passwordPropietario)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = crearTokenJWT(agenteSACBDD._id,agenteSACBDD.rol)
	const {_id,rol} = agenteSACBDD
    res.status(200).json({
        token,
        rol,
        _id
    })
}
const perfilPropietario = (req, res) => {
    
    const camposAEliminar = [
        "fechaIngresoContrato", "especificaionesContrato", "salidaContrato",
        "estadoContrato", "administrador", "tipoContrato",
        "fechaDeInicionContrato", "passwordPropietario", 
        "avatarContrato", "avatarContratoIA","avatarContratoID", "createdAt", "updatedAt", "__v"
    ]

    camposAEliminar.forEach(campo => delete req.agenteSACBDD[campo])

    res.status(200).json(req.agenteSACBDD)
}
export {
    registrarAgenteSAC,
    listarAgentesSAC,
    detalleAgenteSAC,
    eliminarAgenteSAC,
    actualizarAgenteSAC,
    loginPropietario,
    perfilPropietario
}