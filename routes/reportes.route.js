import { Router } from "express";

import { CheckAccess, CheckDeleteReporte, protect } from "../middleware/auth.middleware.js";
import { crearReporte, deleteReporte, EditAssignReporte, GetReporte, getReporteQuery, getReportesNombres, getReportesSolido, GetShareViewReporte, ShareAsignReport, UnAssignReporte } from "../controllers/report/Reportes.controller.js";

const router = Router()

router.post('/getreportesnombre',protect,getReportesNombres)
router.post('/getreportesporid',protect,getReportesSolido)
router.post('/getreportesporquery',protect,getReporteQuery)
router.post('/getreporte',protect,GetReporte) 
router.post('/sharereporte',protect,ShareAsignReport) //- NECESITA ACCESO/PERMISO agregar:acceso:reporte
router.post('/unassignreporte',protect,UnAssignReporte) //- NECESITA ACCESO/PERMISO eliminar:acceso:reporte
router.post('/editaccesosreporte',protect,EditAssignReporte) //- NECESITA ACCESO/PERMISO editar:acceso:reporte
router.post('/getviewsharereporte',protect,GetShareViewReporte)
router.post('/postreporte',protect,CheckAccess,crearReporte) //RASTREABLE - NECESITA ACCESO/PERMISO - OK
router.post('/deletereporte',protect,CheckDeleteReporte,deleteReporte) //RASTREABLE - NECESITA ACCESO/PERMISO - OK

export default router