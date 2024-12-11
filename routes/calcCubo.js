import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";
import { Calculo, GetDataCol } from "../controllers/calcquery/CalcQuery.controller.js";


const router = Router()

router.post('/calcularcubo',protect,Calculo)
router.post('/gotdata',protect,GetDataCol)
export default router