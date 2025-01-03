import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";
import { crearReporte, deleteReporte, GetReporte, getReporteQuery, getReportesNombres, getReportesSolido } from "../controllers/report/Reportes.controller.js";

const router = Router()

router.post('/getreportesnombre',protect,getReportesNombres)
router.post('/getreportesporid',protect,getReportesSolido)
router.post('/getreportesporquery',protect,getReporteQuery)
router.post('/getreporte',protect,GetReporte) 
router.post('/postreporte',protect,crearReporte) //RASTREABLE
router.post('/deletereporte',protect,deleteReporte) //RASTREABLE

export default router