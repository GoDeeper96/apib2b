import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";
import { ActivarUsuario,DesactivarUsuario, CreateLicencias, DeleteLicencias, UpdateLicencias, ViewLicencias } from "../controllers/Licencias/Licencias.controller.js";


const router = Router()
router.post('/addlicense',protect,CreateLicencias)
router.post('/editarlicense',protect,UpdateLicencias)
router.post('/getlicenses',protect,ViewLicencias)
router.post('/activarusuario',protect,ActivarUsuario)
router.post('/desactivarusuario',protect,DesactivarUsuario)
router.post('/eliminarlicencias',protect,DeleteLicencias) 
export default router