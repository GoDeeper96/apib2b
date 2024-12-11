import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { CrearUsuario, EditarUsuario, EliminarUsuario, GetUsuarios } from "../controllers/usuarios/Usuario.controller.js";

const router = Router()
router.get('/getusuarios',protect,GetUsuarios)
router.post('/adduser',protect,CrearUsuario)
router.post('/editarusuario',protect,EditarUsuario)
router.post('/eliminarusuario',protect,EliminarUsuario)
export default router