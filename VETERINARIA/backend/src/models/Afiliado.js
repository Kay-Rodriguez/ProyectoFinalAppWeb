import mongoose, {Schema,model} from 'mongoose'

const afiliadoSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    descripcion:{
        type:String,
        require:true,
        trim:true
    },
    prioridad:{
        type:String,
        require:true,
        enum:['Baja','Media','Alta']
    },
    Sac:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Sac'
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    estadoPago: {
        type: String,
        enum: ['Pendiente', 'Pagado'],
        default: 'Pendiente'
    }
},{
    timestamps:true
})

export default model('Afiliado',afiliadoSchema)