import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import routerAdministrador from './routers/Administrador_routes.js'
import routerAgenteSAC from './routers/AgenteSAC_routes.js'
import routerAfiliados from './routers/Afiliado_routes.js'
import cloudinary from 'cloudinary'

dotenv.config()

const app = express()

// ✅ ¡ESTO DEBE IR PRIMERO!
app.use(express.json())

// Configuraciones
app.set('port', process.env.PORT || 3000)
app.use(cors())
// Configura CORS (mejor explícito)
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }))

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// ✅ File Upload DEBE IR DESPUÉS de express.json()
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))

// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})

// Rutas para administradores
app.use('/api',routerAdministrador)

// Rutas para agentes
app.use('/api',routerAgenteSAC)
// Rutas para afiliado
app.use('/api',routerAfiliados)
// Manejo de una ruta que no sea encontrada
//app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia 
export default  app