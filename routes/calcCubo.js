import { Router } from "express";

import { CheckAccess, protect } from "../middleware/auth.middleware.js";
import { Calculo,  GetColumnasPorTabla, GetDataCol, GetDataQuery, GetQueriesAutorYCompartidos, GetQueriesVistaAutor, GetSearchedValue, GetTablasUsuario, ValidateQuery } from "../controllers/query/CalcQuery.controller.js";
import { AsignarQuery,DeleteQuery, ConvertirTable2Json, CrearQuery,PrevisualizarData,testing } from "../controllers/query/Query.controller.js";

const router = Router()

router.post('/calcularcubo',protect,Calculo)
router.post('/gotdata',protect,GetDataCol)
router.post('/searchvalue',protect,GetSearchedValue)
router.post('/gettablas',protect,GetTablasUsuario)
router.post('/validatequeryuser',protect,ValidateQuery)
router.post('/getdataquery',protect,GetDataQuery)
router.post('/getcolumnasportabla',protect,GetColumnasPorTabla)
router.post('/asignarquery',protect,AsignarQuery)
router.post('/crearquery',protect,CheckAccess,CrearQuery)
router.post('/deletequery',protect,DeleteQuery)
router.post('/getqueriesautor',protect,GetQueriesAutorYCompartidos)
router.post('/getqueriesvista',protect,GetQueriesVistaAutor)
router.post('/convertirtabletojson',protect,ConvertirTable2Json)
router.post('/previsualizardata',protect,PrevisualizarData)
router.get('/testb2b',testing)
export default router