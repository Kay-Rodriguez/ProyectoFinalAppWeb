import Afiliado from "../models/Afiliado.js"
import mongoose from "mongoose"
import {Stripe} from "stripe"

const stripe = new Stripe(`${process.env.STRIPE_PRIVATE_KEY}`)

const registrarAfiliado = async (req,res)=>{
    const {agenteSAC} = req.body
    if( !mongoose.Types.ObjectId.isValid(agenteSAC) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    await Afiliado.create(req.body)
    res.status(200).json({msg:"Registro exitoso del Afiliado"})
}

const listarAfiliado = async (req,res)=>{
    const afiliados = await Afiliado.find()
   res.status(200).json (afiliados)
}
const eliminarAfiliado = async (req,res)=>{
   const {id} = req.params
   if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status (200).json({msg: "ID de Afiliado no existe"})
   }
   await Afiliado.findByIdAndDelete(id)
   res.status(200).json({msg: "Afiliado eliminado correctamente"})
}

const pagarAfiliado = async (req, res) => {

    const { paymentMethodId, treatmentId, cantidad, motivo } = req.body


    try {

        const afiliado = await Afiliado.findById(treatmentId).populate('agenteSAC')
        //Verificar que exista el Afiliado en BDD
        if (!afiliado) return res.status(404).json({ message: "Afiliado no encontrado" })
        //Verificar si el Afiliado fue pagado
        if (afiliado.estadoPago === "Pagado") return res.status(400).json({ message: "Este Afiliado ya fue pagado" })
        if (!paymentMethodId) return res.status(400).json({ message: "paymentMethodId no proporcionado" })

        let [cliente] = (await stripe.customers.list({ email:afiliado.emailPropietario, limit: 1 })).data || [];
        
        if (!cliente) {
            cliente = await stripe.customers.create({ name:afiliado.nombrePropietario, email:Afiliado.emailPropietario });
        }

        const payment = await stripe.paymentIntents.create({
            amount:cantidad,
            currency: "USD",
            description: motivo,
            payment_method: paymentMethodId,
            confirm: true,
            customer: cliente.id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        })

        //Si el pago fue exitoso, se registra en la BDD y se cambia de estado
        if (payment.status === "succeeded") {
            await Afiliado.findByIdAndUpdate(treatmentId, { estadoPago: "Pagado" });
            return res.status(200).json({ msg: "El pago se realizó exitosamente" })
        }
    } catch (error) {
        res.status(500).json({ msg: "Error al intentar pagar el Afiliado", error });
    }
}

export{
    registrarAfiliado,
    listarAfiliado,
    eliminarAfiliado,
    pagarAfiliado
}