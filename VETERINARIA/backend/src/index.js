/*import app from './server.js'
import connection from './database.js';
import http from 'http'
import { Server } from 'socket.io'

connection()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on('connection', (socket) => {
    console.log('Usuario conectado',socket.id)
    socket.on('enviar-mensaje-front-back',(payload)=>{
        socket.broadcast.emit('enviar-mensaje-front-back',payload)
    })
})


server.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})*/
import app from './server.js'
import connection from './database.js'
import googleAuthRoutes from './routers/authGoogle_routes.js'

connection()

// Monta primero las rutas adicionales
app.use('/api', googleAuthRoutes)

// AHORA sí, al final del todo, el 404 catch-all:
app.use((req, res) => res.status(404).send('Endpoint no encontrado - 404'))

const PORT = app.get('port') || 3000
app.listen(PORT, () => console.log(`Server ok on http://localhost:${PORT}`))
