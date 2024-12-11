import { Router } from "express";
import { Login, Logout, ProtectRoute, Test } from "../controllers/auth/Auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router()
router.get('/test',Test)
router.post('/login',Login)
router.post('/logout',Logout)
router.post('/getserverprops',ProtectRoute)

export default router