// controllers/authGoogle_controller.js
import { OAuth2Client } from 'google-auth-library'
import Administrador from '../models/Administrador.js'
import bcrypt from 'bcryptjs'
import { crearTokenJWT } from '../middlewares/JWT.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'Token no proporcionado' })

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    const { email, name, picture } = payload

    // 1) Busca o crea admin por email
    let user = await Administrador.findOne({ email })
    if (!user) {
      const [nombre, ...rest] = (name || '').split(' ')
      const hash = await bcrypt.hash(crypto.randomUUID(), 10)
      user = await Administrador.create({
        nombre: nombre || 'Usuario',
        apellido: rest.join(' ') || '',
        email,
        password: hash,
        confirmEmail: true
      })
    }

    // 2) Emite JWT con su rol
    const jwt = crearTokenJWT(user._id, user.rol)

    res.json({
      msg: 'Login con Google exitoso',
      token: jwt,
      rol: user.rol,
      user: { name, email, picture }
    })
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Token inválido' })
  }
}
