// controllers/authGoogle_controller.js
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID) // <-- variable de backend

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'Token no proporcionado' })

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    // Aquí puedes crear/buscar el usuario y emitir tu propio JWT si quieres
    res.json({
      message: 'Login con Google exitoso',
      user: { name: payload.name, email: payload.email, picture: payload.picture }
      // token: TU_JWT
    })
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Token inválido' })
  }
}
