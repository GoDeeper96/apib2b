import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { CambiarContraseña, CrearUsuario, EditarUsuario, EliminarUsuario, GetUsuarios } from "../controllers/usuarios/Usuario.controller.js";

const router = Router()
router.post('/getusuarios',protect,GetUsuarios) //RASTREABLE
router.post('/adduser',protect,CrearUsuario) //RASTREABLE
router.post('/editarusuario',protect,EditarUsuario) //RASTREABLE
router.post('/eliminarusuario',protect,EliminarUsuario) //RASTREABLE
router.post('/cambiarcontrasenia',protect,CambiarContraseña)
export default router