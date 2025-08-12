import mongoose, {Schema,model} from 'mongoose'
import bcrypt from "bcryptjs"

const agenteSACSchema = new Schema({
    nombrePropietario:{
        type:String,
        required:true,
        trim:true
    },
    cedulaPropietario:{
        type:String,
        required:true,
        trim:true
    },
    emailPropietario:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    passwordPropietario:{
        type:String,
        required:true
    },
    celularPropietario:{
        type:String,
        required:true,
        trim:true
    },
    nombreContrato:{
        type:String,
        required:true,
        trim:true
    },
    avatarContrato:{
        type:String,
        trim:true
    },
    avatarContratoID:{
        type:String,
        trim:true
    },
    avatarContratoIA:{
        type:String,
        trim:true
    },
    tipoContrato:{
        type:String,
        required:true,
        trim:true
    },
    fechaDeInicioContrato:{
        type:Date,
        required:true,
        trim:true
    },
    especificacionesContrato:{
        type:String,
        required:true,
        trim:true
    },
    fechaIngresoContrato:{
        type:Date,
        required:true,
        trim:true,
        default:Date.now
    },
    salidaContrato:{
        type:Date,
        trim:true,
        default:null
    },
    estadoContrato:{
        type:Boolean,
        default:true
    },
    rol:{
        type:String,
        default:"agenteSAC"
    },
    administrador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Administrador'
    }
},{
    timestamps:true
})


// Método para cifrar el password del propietario
agenteSACSchema.methods.encrypPassword = async function(password){
    console.log(password);
    
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

// Método para verificar si el password ingresado es el mismo de la BDD
agenteSACSchema.methods.matchPassword = async function(password){
    return bcrypt.compare(password, this.passwordPropietario)
}

export default model('agenteSAC',agenteSACSchema)