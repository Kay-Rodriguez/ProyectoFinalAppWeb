import {Router} from 'express'
import { eliminarAfiliado, listarAfiliado, registrarAfiliado, pagarAfiliado } from '../controllers/afiliado_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.post('/afiliado/registro',registrarAfiliado)

router.get ('/afiliados',listarAfiliado)

router.delete('/afiliado/:id', eliminarAfiliado)

router.post('/afiliado/pago',verificarTokenJWT,pagarAfiliado)

export default router