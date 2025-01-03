import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";
import { GetEventosAutor } from "../controllers/Events/Eventos.controller.js";

const router = Router()

router.post('/vereventos',protect,GetEventosAutor)

export default router