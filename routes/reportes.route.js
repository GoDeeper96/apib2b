import { Router } from "express";

import { CheckAccess, protect } from "../middleware/auth.middleware.js";
import { crearReporte, deleteReporte, EditAssignReporte, GetReporte, getReporteQuery, getReportesNombres, getReportesSolido, GetShareViewReporte, ShareAsignReport, UnAssignReporte } from "../controllers/report/Reportes.controller.js";

const router = Router()

router.post('/getreportesnombre',protect,getReportesNombres)
router.post('/getreportesporid',protect,getReportesSolido)
router.post('/getreportesporquery',protect,getReporteQuery)
router.post('/getreporte',protect,GetReporte) 
router.post('/sharereporte',protect,ShareAsignReport) //- NECESITA ACCESO/PERMISO
router.post('/unassignreporte',protect,UnAssignReporte) //- NECESITA ACCESO/PERMISO
router.post('/editaccesosreporte',protect,EditAssignReporte) //- NECESITA ACCESO/PERMISO
router.post('/getviewsharereporte',protect,GetShareViewReporte)
router.post('/postreporte',protect,CheckAccess,crearReporte) //RASTREABLE - NECESITA ACCESO/PERMISO
router.post('/deletereporte',protect,deleteReporte) //RASTREABLE - NECESITA ACCESO/PERMISO

export default router