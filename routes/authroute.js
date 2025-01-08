import { Router } from "express";
import { AccessPage, AccessResource, getAccesoRecursos, Login, Logout, ProtectRoute, Test } from "../controllers/auth/Auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router()
router.get('/test',Test)
router.post('/login',Login)
router.post('/logout',Logout)
router.post('/getserverprops',ProtectRoute)
router.post('/getaccesstoroute',AccessPage)
router.post('/getpermisos',getAccesoRecursos)
router.post('/accesstoresource',AccessResource)
export default router