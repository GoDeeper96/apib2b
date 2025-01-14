import axios from "axios";
import { MapError } from "../../errorHelper/ErrorApi.js";
import { crearEsquemaDinamico, dataEsquemCubo } from "../../utilities/DataEsquemaCubo.js";
import mongoose, { mongo } from "mongoose";
import { SchemaModelVentas } from "../../models/SchemaModelVentas.js";
import { buildAggregationPipeline } from "../../utilities/ConversionTable2Json.js";
import ConsultaPaginacionCacheModel from "../../models/ConsultaPaginacionCache.model.js";
import EventosModel from "../../models/Eventos.model.js";
import QueriesModel from "../../models/Queries.model.js";
import NotificacionesModel from "../../models/Notificaciones.model.js";
import moment from "moment";
import QueryXUsuarioModel from "../../models/QueryXUsuario.model.js";
import { cargaQueue } from "../../jobs/cargaQueue.CrearQuery.js";
import { buildSQLQuery } from "../../utilities/ConversionFromTableToSQL.js";
import { clickhouse } from "../../connections/clickhousedb.js";

// export const CrearQuery = async(req,res)=>{
//     const { FormData }  = req.body
//     console.log(FormData)
//     const nuevoPost = new EventosModel({
//         Autor:FormData.Autor,
//         EventoNombre:'CrearFiltroQuery',
//         Descripcion:` creando ${FormData.nombre_tabla}...`,
//         Funcion:'crear:query',
//         ConsultaPayload:JSON.stringify(req.body),
//         Response:'En progreso...',
//         ResponseTamaño:0,
//         FechaStart:moment().format('YYYY-MM-DD hh:mm:ss'),
//         FechaEnd:null,
//         TimeSpentSec:0,
//         Status:'LOADING',
//         StatusCode:0
//     })
//     await nuevoPost.save()
//     try {
//         const nombre_tabla = FormData.nombre_tabla
//         const queryTable = JSON.stringify(FormData.queryTable)
//         const queryJson = JSON.stringify(buildAggregationPipeline(FormData.queryTable))
//         const columnas = FormData.columnas
//         const dinamico = FormData.dinamico
//         const tabla_origen = FormData.tabla_origen
//         const descripcion = FormData.descripcion
//         // console.log(queryJson)
//         // console.log(FormData.queryTable)
//         const nuevoQuery = new QueriesModel({
//             Autor:FormData.Autor,
//             QueryJson:queryJson,
//             QueryTabla:queryTable,
//             Columnas:JSON.stringify(dataEsquemCubo.filter(x=>columnas.includes(x.Nombre))),
//             Descripcion:descripcion||'',
//             Dinamico:dinamico,
//             Nombre:nombre_tabla,
//             TablaOrigen:tabla_origen
//         })
//         await nuevoQuery.save()
//         const crearModelo = crearEsquemaDinamico(nombre_tabla,columnas) //CREACION MODELO
//         const nuevoModelo = mongoose.model(nombre_tabla,crearModelo)
//         // http://170.231.81.173:5000/b2b/cargab2b
//         const InsertarData = await axios.post('http://170.231.81.173:5000/b2b/cargab2b',
//             {
//                 filter:queryJson,
//                 nombre_tabla:'tabla1',
//                 columnas:columnas
//             }
//         )
//         console.log(InsertarData)
//         // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
//         const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
//         const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
//         const ResponseTamaño = 1;
//         const sendNotificacion = new NotificacionesModel({
//             Usuario:FormData.Autor,
//             Mensaje:'El nuevo query ha sido creado correctamente',
//             Tipo:'Carga'
//         })
//         sendNotificacion.save()
//         // Actualizar el evento con estado "DONE"
//         await EventosModel.findByIdAndUpdate(nuevoPost.id, {
//             Response: 'FormData',
//             ResponseTamaño,
//             FechaEnd,
//             TimeSpentSec,
//             Status: 'DONE',
//             StatusCode: 200
//         });
//         res.json({
//             estado:'Success',
//             mensaje:'Ok',
//             error:null
//         })
//     } catch (error) {
//         console.log(error)
//         console.error(error);
//         const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
//         const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
//         // Intentar actualizar el evento solo si fue creado exitosamente
//         if (nuevoPost && nuevoPost.id) {
//             await EventosModel.findByIdAndUpdate(nuevoPost.id, {
//                 Response: JSON.stringify(error.message),
//                 ResponseTamaño: JSON.stringify(error.message).length,
//                 FechaEnd,
//                 TimeSpentSec,
//                 Status: 'ERROR',
//                 StatusCode: 500
//             });
//         }
//         const getError = MapError(error); // Función para mapear el error
//         res.status(500).send(getError);    
//     }
// }
export const CrearQuery = async (req, res) => {
    const { FormData } = req.body;
    // Crea un nuevo evento en progreso
    const nuevoPost = new EventosModel({
        Autor: FormData.Autor,
        EventoNombre: 'CrearFiltroQuery',
        Descripcion: `Creando ${FormData.nombre_tabla}...`,
        Funcion: 'crear:query',
        ConsultaPayload: JSON.stringify(req.body),
        Response: 'En progreso...',
        ResponseTamaño: 0,
        FechaStart: moment().format('YYYY-MM-DD hh:mm:ss'),
        FechaEnd: null,
        TimeSpentSec: 0,
        Status: 'LOADING',
        StatusCode: 0,
      });
      await nuevoPost.save();
    try {
      
      const nombre_tabla = FormData.nombre_tabla
      const queryTable = JSON.stringify(FormData.queryTable)
      const queryJson = JSON.stringify(buildAggregationPipeline(FormData.queryTable))
      const columnas = FormData.columnas
      const dinamico = FormData.dinamico
      const tabla_origen = FormData.tabla_origen
      const descripcion = FormData.descripcion
      // console.log(queryJson)
      // console.log(FormData.queryTable)
      const nuevoQuery = new QueriesModel({
          Autor:FormData.Autor,
          QueryJson:queryJson,
          QueryTabla:queryTable,
          Columnas:JSON.stringify(dataEsquemCubo.filter(x=>columnas.includes(x.Nombre))),
          Descripcion:descripcion||'',
          Dinamico:dinamico,
          Nombre:nombre_tabla,
          TablaOrigen:tabla_origen
      })
      await nuevoQuery.save()
      const crearQueryUsuario = new QueryXUsuarioModel({
        Permisos:['Ver'],
        IDQuery:nuevoQuery.id,
        Usuario:FormData.Autor
      })
      await crearQueryUsuario.save()
      const crearModelo = crearEsquemaDinamico(nombre_tabla,columnas) //CREACION MODELO
      const nuevoModelo = mongoose.model(nombre_tabla,crearModelo)       
      // Agregar tarea a la cola
      await cargaQueue.add({
        FormData,
        nuevoPostId: nuevoPost.id,
      });
  
      res.json({
        estado: 'Success',
        mensaje: 'Tarea en cola. Se notificará cuando termine.',
        error: null,
      });
    } catch (error) {
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        // Intentar actualizar el evento solo si fue creado exitosamente
        if (nuevoPost && nuevoPost.id) {
            await EventosModel.findByIdAndUpdate(nuevoPost.id, {
                Response: JSON.stringify(error.message),
                ResponseTamaño: JSON.stringify(error.message).length,
                FechaEnd,
                TimeSpentSec,
                Status: 'ERROR',
                StatusCode: 500
            });
        }
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);     
    }
  };
export const GetSharedViewQuery = async(req,res)=>{
    const { idquery } = req.body
   
    try {
        let newView =[]
                const dataReporte = await QueriesModel.findById(idquery)
                // console.log(dataReporte)
                const data = await QueryXUsuarioModel.find({
                    IDQuery:idquery,
                }).lean()
                newView = data.map(x=>({
                    ...x,
                    Autor:dataReporte.Autor
                }))
                // console.log(newView)
                res.json({
                    Data:newView,
                    estado:'Success',
                    mensaje:'Ok',
                    error:null
                })  
    } catch (error) {
       
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);  
    }
}
export const ShareQuery = async(req,res)=>{
    const {NombreQuery,IDQuery,Usuario,Autor,Editable } = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'ShareQuery',
        Descripcion:` Compartir ${NombreQuery}...`,
        Funcion:'compartir:query',
        ConsultaPayload:JSON.stringify(req.body),
        Response:'En progreso...',
        ResponseTamaño:0,
        FechaStart:moment().format('YYYY-MM-DD hh:mm:ss'),
        FechaEnd:null,
        TimeSpentSec:0,
        Status:'LOADING',
        StatusCode:0
    })
    await nuevoPost.save()
    try {
        const queryParaUsuario = new QueryXUsuarioModel({
            IDQuery:IDQuery,
            Usuario:Usuario,
            Permisos:['Usar'],
        })
        await queryParaUsuario.save()
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        const ResponseTamaño = 1;
        await EventosModel.findByIdAndUpdate(nuevoPost.id, {
            Response: 'FormData',
            ResponseTamaño,
            FechaEnd,
            TimeSpentSec,
            Status: 'DONE',
            StatusCode: 200
        });
    } catch (error) {
        console.log(error)
        console.error(error);
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        // Intentar actualizar el evento solo si fue creado exitosamente
        if (nuevoPost && nuevoPost.id) {
            await EventosModel.findByIdAndUpdate(nuevoPost.id, {
                Response: JSON.stringify(error.message),
                ResponseTamaño: JSON.stringify(error.message).length,
                FechaEnd,
                TimeSpentSec,
                Status: 'ERROR',
                StatusCode: 500
            });
        }
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);     
    }
}
export const UnshareQuery = async(req,res)=>{
    const { NombreQuery,IDQuery,Usuario,Autor,Editable } = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'DescompartirQuery',
        Descripcion:` Descompartir ${NombreQuery}...`,
        Funcion:'descompartir:query',
        ConsultaPayload:JSON.stringify(req.body),
        Response:'En progreso...',
        ResponseTamaño:0,
        FechaStart:moment().format('YYYY-MM-DD hh:mm:ss'),
        FechaEnd:null,
        TimeSpentSec:0,
        Status:'LOADING',
        StatusCode:0
    })
    await nuevoPost.save()
    try {
        const unAssigned = await QueryXUsuarioModel.findOneAndDelete({IDQuery:IDQuery,Usuario:Usuario}) //USUARIO AL CUAL LE VAS A DESASIGNAR
        // const queryParaUsuario = new QueryXUsuarioModel({
        //     IDQuery:IDQuery,
        //     Usuario:Usuario,
        //     Permisos:['Usar'],
        // })
        // await queryParaUsuario.save()
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        const ResponseTamaño = 1;
        // const sendNotificacion = new NotificacionesModel({
        //     Usuario:FormData.Autor,
        //     Mensaje:'El nuevo query ha sido asignado correctamente',
        //     Tipo:'Carga'
        // })
        // sendNotificacion.save()
        // Actualizar el evento con estado "DONE"
        await EventosModel.findByIdAndUpdate(nuevoPost.id, {
            Response: 'FormData',
            ResponseTamaño,
            FechaEnd,
            TimeSpentSec,
            Status: 'DONE',
            StatusCode: 200
        });
        res.json({
            estado:'Success',
            mensaje:'Ok',
            error:null
        })
    } catch (error) {
        console.log(error)
        console.error(error);
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        // Intentar actualizar el evento solo si fue creado exitosamente
        if (nuevoPost && nuevoPost.id) {
            await EventosModel.findByIdAndUpdate(nuevoPost.id, {
                Response: JSON.stringify(error.message),
                ResponseTamaño: JSON.stringify(error.message).length,
                FechaEnd,
                TimeSpentSec,
                Status: 'ERROR',
                StatusCode: 500
            });
        }
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);      
    }
}
// export const UnassignQuery = async(req,res)=>{
//     const { NombreQuery,IDQuery,Usuario,Autor,Editable } = req.body
//     const nuevoPost = new EventosModel({
//         Autor:Autor,
//         EventoNombre:'DesasignandoQuery',
//         Descripcion:` Desasignar ${NombreQuery}...`,
//         Funcion:'desasignar:query',
//         ConsultaPayload:JSON.stringify(req.body),
//         Response:'En progreso...',
//         ResponseTamaño:0,
//         FechaStart:moment().format('YYYY-MM-DD hh:mm:ss'),
//         FechaEnd:null,
//         TimeSpentSec:0,
//         Status:'LOADING',
//         StatusCode:0
//     })
//     await nuevoPost.save()
//     try {
//         // const queryParaUsuario = new QueryXUsuarioModel({
//         //     IDQuery:IDQuery,
//         //     Usuario:Usuario,
//         //     Permisos:['Usar'],
//         // })
//         // await queryParaUsuario.save()
//         const unAssigned = await QueryXUsuarioModel.findOneAndDelete({IDQuery:IDQuery,Usuario:Usuario})
//         const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
//         const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
//         const ResponseTamaño = 1;
//         // const sendNotificacion = new NotificacionesModel({
//         //     Usuario:FormData.Autor,
//         //     Mensaje:'El nuevo query ha sido asignado correctamente',
//         //     Tipo:'Carga'
//         // })
//         // sendNotificacion.save()
//         // Actualizar el evento con estado "DONE"
//         await EventosModel.findByIdAndUpdate(nuevoPost.id, {
//             Response: 'FormData',
//             ResponseTamaño,
//             FechaEnd,
//             TimeSpentSec,
//             Status: 'DONE',
//             StatusCode: 200
//         });
//         res.json({
//             estado:'Success',
//             mensaje:'Ok',
//             error:null
//         })
//     } catch (error) {
//         console.log(error)
//         console.error(error);
//         const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
//         const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
//         // Intentar actualizar el evento solo si fue creado exitosamente
//         if (nuevoPost && nuevoPost.id) {
//             await EventosModel.findByIdAndUpdate(nuevoPost.id, {
//                 Response: JSON.stringify(error.message),
//                 ResponseTamaño: JSON.stringify(error.message).length,
//                 FechaEnd,
//                 TimeSpentSec,
//                 Status: 'ERROR',
//                 StatusCode: 500
//             });
//         }
//         const getError = MapError(error); // Función para mapear el error
//         res.status(500).send(getError);      
//     }
// }
export const AsignarQuery = async(req,res)=>{ //COMPARTIR QUERY
    const { NombreQuery,IDQuery,Usuario,Autor,Editable } = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'AsignarQuery',
        Descripcion:` Asignando/Compartir ${NombreQuery}...`,
        Funcion:'asignar:query',
        ConsultaPayload:JSON.stringify(req.body),
        Response:'En progreso...',
        ResponseTamaño:0,
        FechaStart:moment().format('YYYY-MM-DD hh:mm:ss'),
        FechaEnd:null,
        TimeSpentSec:0,
        Status:'LOADING',
        StatusCode:0
    })
    await nuevoPost.save()
    try {
        const queryParaUsuario = new QueryXUsuarioModel({
            IDQuery:IDQuery,
            Usuario:Usuario,
            Permisos:['Usar'],
        })
        await queryParaUsuario.save()
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        const ResponseTamaño = 1;
        // const sendNotificacion = new NotificacionesModel({
        //     Usuario:FormData.Autor,
        //     Mensaje:'El nuevo query ha sido asignado correctamente',
        //     Tipo:'Carga'
        // })
        // sendNotificacion.save()
        // Actualizar el evento con estado "DONE"
        await EventosModel.findByIdAndUpdate(nuevoPost.id, {
            Response: 'FormData',
            ResponseTamaño,
            FechaEnd,
            TimeSpentSec,
            Status: 'DONE',
            StatusCode: 200
        });
        res.json({
            estado:'Success',
            mensaje:'Ok',
            error:null
        })
    } catch (error) {
        console.log(error)
        console.error(error);
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        // Intentar actualizar el evento solo si fue creado exitosamente
        if (nuevoPost && nuevoPost.id) {
            await EventosModel.findByIdAndUpdate(nuevoPost.id, {
                Response: JSON.stringify(error.message),
                ResponseTamaño: JSON.stringify(error.message).length,
                FechaEnd,
                TimeSpentSec,
                Status: 'ERROR',
                StatusCode: 500
            });
        }
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);      
    }
}
// export const EditarQuery = async(req,res)=>{
//     const { FormData } = req.body
//     try {
        
//     } catch (error) {
//         console.log(error)
//         console.error(error);
//         const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
//         const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
//         // Intentar actualizar el evento solo si fue creado exitosamente
//         if (nuevoPost && nuevoPost.id) {
//             await EventosModel.findByIdAndUpdate(nuevoPost.id, {
//                 Response: JSON.stringify(error.message),
//                 ResponseTamaño: JSON.stringify(error.message).length,
//                 FechaEnd,
//                 TimeSpentSec,
//                 Status: 'ERROR',
//                 StatusCode: 500
//             });
//         }
//         const getError = MapError(error); // Función para mapear el error
//         res.status(500).send(getError);  
//     }
// }
export const DeleteQuery = async(req,res)=>{
    const {IDQuery,Autor,AutorQuery,NombreQuery,Usuario } = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'Eliminar query',
        Descripcion:` eliminar query ${NombreQuery}...`,
        Funcion:'eliminar:query',
        ConsultaPayload:JSON.stringify(req.body),
        Response:'En progreso...',
        ResponseTamaño:0,
        FechaStart:moment().format('YYYY-MM-DD hh:mm:ss'),
        FechaEnd:null,
        TimeSpentSec:0,
        Status:'LOADING',
        StatusCode:0
    })
    try {
        const eliminarQuery = await QueriesModel.findByIdAndDelete(IDQuery) //ELIMINAR DE QUERIES
        const eliminarQueryUsuarios = await QueryXUsuarioModel.deleteMany({IDQuery:IDQuery}) // ELIMINA INCLUSO A LOS QUE SE LE HA COMPARTIDO
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        const ResponseTamaño = 1;
        await EventosModel.findByIdAndUpdate(nuevoPost.id, {
            Response: 'FormData',
            ResponseTamaño,
            FechaEnd,
            TimeSpentSec,
            Status: 'DONE',
            StatusCode: 200
        });
        res.json({
            estado:'Success',
            mensaje:'Ok',
            error:null
        })
    } catch (error) {
        // console.log(error)
        // console.error(error);
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        // Intentar actualizar el evento solo si fue creado exitosamente
        if (nuevoPost && nuevoPost.id) {
            await EventosModel.findByIdAndUpdate(nuevoPost.id, {
                Response: JSON.stringify(error.message),
                ResponseTamaño: JSON.stringify(error.message).length,
                FechaEnd,
                TimeSpentSec,
                Status: 'ERROR',
                StatusCode: 500
            });
        }
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);     
    }
}
export const ConvertirTable2Json = async(req,res)=>{
    const {QueryTable,Tabla} = req.body
    console.log(QueryTable)
    // console.log(JSON.stringify(QueryTable))
    try {
        let bd ={}
        let ahoraQuery = ''
        if(QueryTable&&Array.isArray(QueryTable)&&QueryTable.length!==0)
        {
            //  bd = buildAggregationPipeline(QueryTable)
             ahoraQuery = buildSQLQuery(QueryTable,Tabla)
        }
        console.log(ahoraQuery)
     
       res.json({
        Data:bd,
        estado:'Success',
        mensaje:'Ok',
        error:null
    })
    } catch (error) {
        console.log(error)
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);   
    }
}
export const PrevisualizarData = async(req,res)=>{
    const { QueryTable,tabla_origen,Columnas } = req.body
    const { start, size, filters, sorting, globalFilter } = req.query 
    const GlobalFilter = globalFilter
    const Filtros = JSON.parse(filters)
    // console.log(GlobalFilter.length)
    const page = parseInt(start)
    const limit = parseInt(size)
    try {

        let obj = {_id:0}
        for (let index = 0; index < Columnas.length; index++) {
            obj[Columnas[index]] = 1
            
        }
        // const getTablaDinamica = await mongoose.model('90005').find(JSON.parse(QueryTable),obj).skip(page).limit(limit)
        console.log(JSON.stringify(obj))
        console.log(typeof QueryTable)
        const junteQuery = QueryTable+JSON.stringify(obj)
        console.log(junteQuery)
        const existeEnCache = await ConsultaPaginacionCacheModel.findOne({QueryString:junteQuery})
        let resultado =[]
        let tamaño = 0
        if(existeEnCache)
        {
            resultado = await mongoose.model('90005').aggregate([
                { $match: JSON.parse(QueryTable) },
                { $project: obj },
                {
                    $facet: {
                        data: [
                            { $skip: page },
                            { $limit: limit },
                        ],
                    },
                },
            ]);
            tamaño = existeEnCache.TamañoTotal
        }
        else{

            resultado = await mongoose.model('90005').aggregate([
                { $match: JSON.parse(QueryTable) },
                { $project: obj },
                {
                    $facet: {
                        data: [
                            { $skip: page },
                            { $limit: limit },
                        ],
                        totalCount: [
                            { $count: "count" },
                        ],
                    },
                },
            ]);
            tamaño = resultado[0]?.totalCount[0]?.count || 0;

            // Si no estaba en cache, guardar el resultado en cache
            if (resultado.length) {
                const nuevoCache = new ConsultaPaginacionCacheModel({
                    QueryString: junteQuery,
                    TamañoTotal: tamaño,
                });
                await nuevoCache.save();
            }
        }
 
        res.json({
            Data:resultado[0]?.data||[],
            Tamaño:tamaño,
            estado:'Success',
            mensaje:'Ok',
            error:null
        })
    } catch (error) {
        console.log(error)
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError); 
    }
}
export const PrevisualizarDataSql = async(req,res)=>{
    const { QueryTable,tabla_origen,Columnas } = req.body
    const { start, size, filters, sorting, globalFilter } = req.query 
    const GlobalFilter = globalFilter
    const Filtros = JSON.parse(filters)
    // console.log(GlobalFilter.length)
    const page = parseInt(start)
    const limit = parseInt(size)
    const offset = page*limit
    console.log(sorting)
    try {
        const columnList = Columnas.length > 0 ? Columnas.toString() : '*';
        const junteQuery = `select ${columnList} from ${tabla_origen&&tabla_origen!==''?tabla_origen:'ventas_b2b'} ${QueryTable} `
        const existeEnCache = await ConsultaPaginacionCacheModel.findOne({QueryString:junteQuery})
        let resultado =[]
        let tamaño = 0
        if(existeEnCache)
        {
            const queryReal = `select ${columnList} from ${tabla_origen&&tabla_origen!==''?tabla_origen:'ventas_b2b'} ${QueryTable} LIMIT ${limit} OFFSET ${offset} `
      
            const res  = await clickhouse.query({
                query: queryReal,
                format: 'JSONEachRow',
            });
            resultado = await res.json()
            tamaño = existeEnCache.TamañoTotal
        }
        if(!existeEnCache){
            const queryReal = `select ${columnList} from ${tabla_origen&&tabla_origen!==''?tabla_origen:'ventas_b2b'} ${QueryTable} LIMIT ${limit} OFFSET ${offset} `
            const queryCount = `select COUNT(*) AS total from ${tabla_origen&&tabla_origen!==''?tabla_origen:'ventas_b2b'} ${QueryTable}`
            const res  = await clickhouse.query({
                query: queryReal,
                format: 'JSONEachRow',
            });
            const countRes  = await clickhouse.query({
                query: queryCount,
                format: 'JSONEachRow',
            });
            const preTamaño = await countRes.json()
            tamaño = preTamaño[0].total 
            resultado = await res.json()
            if (resultado&&tamaño&&resultado.length&&tamaño>0) {
                const nuevoCache = new ConsultaPaginacionCacheModel({
                    QueryString: junteQuery,
                    TamañoTotal: tamaño,
                });
                await nuevoCache.save();
            }
        }
        res.json({
            Data:resultado.length>0?resultado:[],
            Tamaño:tamaño,
            estado:'Success',
            mensaje:'Ok',
            error:null
        })
    } catch (error) {
        console.log(error)
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);     
    }
}
export const testing = async(req,res)=>{
    try {
        console.log('EMPEZO')
        const query = {
          "$and": [
              {"PKIDProveedor": {"$in": [90005]}},
              {"Sucursal": {"$in": ["VEGA SUR"]}}
              
          ]
        }
        // http://170.231.81.173:5000/b2b/cargab2b
        // http://192.168.2.48:3019/cargab2b
        const first = await axios.post(`http://170.231.81.173:5000/b2b/cargab2b`,{
        filter:JSON.stringify(query),
        nombre_tabla:"tabla1",
        columnas:["ValorVenta", "Periodo", "Sucursal", "CantidadUnitaria", "FuerzaVentas"]
        })
        res.json('ok')
        console.log(first)
      } catch (error) {
        res.status(500).send('que paso')
        console.log(error)
      }
}