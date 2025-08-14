import {Router} from 'express'
import { actualizarPassword, actualizarPerfil, confirmarMail, recuperarPassword, registro, comprobarTokenPassword, crearNuevoPassword, login, perfil } from '../controllers/administrador_controller.js'
import  {verificarTokenJWT} from '../middlewares/JWT.js'
import { actualizarAvatar } from '../controllers/administrador_controller.js';
const router = Router()

router.post('/registro',registro)

router.get('/confirmar/:token', confirmarMail)
router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPassword)
router.post('/nuevopassword/:token',crearNuevoPassword)
router.post ('/login',login)
router.get ('/perfil',verificarTokenJWT,perfil)
router.put('/administrador/:id',verificarTokenJWT,actualizarPerfil)
router.put('/administrador/actualizarpassword/:id',verificarTokenJWT,actualizarPassword)

router.put('/administrador/avatar', verificarTokenJWT, actualizarAvatar);
export default router