// routers/authGoogle_routes.js
import { Router } from 'express'
import { googleLogin } from '../controllers/authGoogle_controller.js'
const router = Router()

router.post('/auth/google', googleLogin)

export default router
