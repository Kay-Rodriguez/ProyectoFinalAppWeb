import {Router} from 'express'
import { registrarAgenteSAC,
    listarAgentesSAC,
    detalleAgenteSAC,
    eliminarAgenteSAC,
    actualizarAgenteSAC,
    loginPropietario,
    perfilPropietario } from '../controllers/agenteSAC_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()

router.post('/agenteSAC/login',loginPropietario)
router.get('/agenteSAC/perfil',verificarTokenJWT,perfilPropietario)
router.post("/agenteSAC/registro",verificarTokenJWT, registrarAgenteSAC)
router.get("/agenteSACs",verificarTokenJWT,listarAgentesSAC)
router.get("/agenteSAC/:id",verificarTokenJWT, detalleAgenteSAC)
router.delete("/agenteSAC/eliminar/:id", verificarTokenJWT,eliminarAgenteSAC)
router.put("/agenteSAC/actualizar/:id", verificarTokenJWT,actualizarAgenteSAC)

export default router