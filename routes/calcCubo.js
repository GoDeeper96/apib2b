import { Router } from "express";

import { CheckAccess, CheckCompartir, CheckCompartirNivelAdministrativo, CheckDeleteQuery, DesAsignarQuery, protect } from "../middleware/auth.middleware.js";
import { Calculo,  GetColumnasPorTabla, GetDataCol, GetDataQuery, GetQueriesAutorYCompartidos, GetQueriesVistaAutor, GetSearchedValue, GetTablasUsuario, ValidateQuery } from "../controllers/query/CalcQuery.controller.js";
import { AsignarQuery,DeleteQuery, ConvertirTable2Json, CrearQuery,PrevisualizarData,testing, GetSharedViewQuery, ShareQuery, UnshareQuery, PrevisualizarDataSql } from "../controllers/query/Query.controller.js";

const router = Router()
//FALTA EDITAR QUERY
router.post('/calcularcubo',protect,Calculo) // FALTA
router.post('/gotdata',protect,GetDataCol)
router.post('/searchvalue',protect,GetSearchedValue)
router.post('/gettablas',protect,GetTablasUsuario)
router.post('/validatequeryuser',protect,ValidateQuery)
router.post('/getdataquery',protect,GetDataQuery)
router.post('/getcolumnasportabla',protect,GetColumnasPorTabla)
router.post('/getviewsharequery',protect,GetSharedViewQuery)
//falta desasignar

router.post('/unassignquery',protect,DesAsignarQuery,UnshareQuery)
router.post('/unsharequery',protect,DesAsignarQuery,UnshareQuery)
router.post('/sharequery',protect,CheckCompartir,ShareQuery) //a nivel usuario
router.post('/asignarquery',protect,CheckCompartirNivelAdministrativo,AsignarQuery) //a nivel administrativo FALTA 
// router.post('/editarquery',protect,CheckEditQuery,EditarQuery)
router.post('/crearquery',protect,CheckAccess,CrearQuery) //OK - ACCESOS VALIDADOS
router.post('/deletequery',protect,CheckDeleteQuery,DeleteQuery) //OK - ACCESOS VALIDADOS
router.post('/getqueriesautor',protect,GetQueriesAutorYCompartidos)
router.post('/getqueriesvista',protect,GetQueriesVistaAutor)
router.post('/convertirtabletojson',protect,ConvertirTable2Json) // FALTA - no necesita
router.post('/previsualizardata',protect,PrevisualizarDataSql)

router.get('/testb2b',testing)
export default router