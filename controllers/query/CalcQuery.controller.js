import moment from "moment/moment.js";
import { InitClientRedisOther } from "../../connections/redis.js";
import B2bModeloModel from "../../models/B2bModelo.model.js";
import EventosModel from "../../models/Eventos.model.js";
import { generateClickhouseQuery, generateClickhouseQueryv2, getPivotDataSource, runDynamicQuery6_actual } from "../../utilities/Helpers.js";
import UsuariosModel from "../../models/Usuarios.model.js";
import QueryXUsuarioModel from "../../models/QueryXUsuario.model.js";
import QueriesModel from "../../models/Queries.model.js";
import { MapError } from "../../errorHelper/ErrorApi.js";
import { clickhouse } from "../../connections/clickhousedb.js";

export const Calculo = async(req,res)=>{
    const { Filas,Columnas,Filtros,Valores,PanelFiltros,Usuario } = req.body
     //IN PROCESS QUERY

    //  const AutorUsuario = await UsuariosModel.findOne({Usuario:Usuario})
 
     const nuevoPost = new EventosModel({
        Autor:Usuario,
        EventoNombre:'CalculoQuery',
        Descripcion:`${Usuario} consulta tabla origen que le corresponde`,
        Funcion:'calcular:query',
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
       



        const query = {
          rows: Filas,
          columns: Columnas,
          values: Valores,
          filters: Filtros
      };
        const sd = await InitClientRedisOther().connect()
        console.log(JSON.stringify(query))
        const dnuew = generateClickhouseQueryv2(query)
        // console.log(dnuew)
        const result = await clickhouse.query({
            query:dnuew,
            format:'JSONEachRow'
        });
        const pivotDataSource = getPivotDataSource(query,result)
        // const dataRedisExisteConQuery = await sd.v4.GET(`${JSON.stringify(query)}`)
        // console.log(dataRedisExisteConQuery)
        // if(!dataRedisExisteConQuery)
        // {
        //     const Pipelina = runDynamicQuery6_actual(query)
          
        //     const FiltracionMaxima = await B2bModeloModel.aggregate(Pipelina)
        //     if(FiltracionMaxima.length!==0)
        //     {
              
        //       await sd.set(`${JSON.stringify(query)}`,JSON.stringify(FiltracionMaxima))
        //     }
        //     console.time('TIEMPOCALCULO')
        //     const pivotDataSource = getPivotDataSource(query,FiltracionMaxima)
        //     // console.log(FiltracionMaxima)
        //     console.timeEnd('TIEMPOCALCULO')
        // const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        // const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        // const ResponseTamaño = JSON.stringify(pivotDataSource).length;

        // // Actualizar el evento con estado "DONE"
        // await EventosModel.findByIdAndUpdate(nuevoPost.id, {
        //     Response: 'pivotDataSource-pipeline',
        //     ResponseTamaño,
        //     FechaEnd,
        //     TimeSpentSec,
        //     Status: 'DONE',
        //     StatusCode: 200
        // });

        //     res.status(200).json({
        //         pivotDataSource:{...pivotDataSource,PanelFiltros},
        //         pipeline:Pipelina
        //     })
        // }
        // else{
        //   const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
        //   const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        //   const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        //   const ResponseTamaño = JSON.stringify(pivotDataSource).length;
  
        //   // Actualizar el evento con estado "DONE"
        //   await EventosModel.findByIdAndUpdate(nuevoPost.id, {
        //       Response: 'pivotDataSource-pipeline',
        //       ResponseTamaño,
        //       FechaEnd,
        //       TimeSpentSec,
        //       Status: 'DONE',
        //       StatusCode: 200
        //   });
        //   res.status(200).json(
        //     {
        //     pivotDataSource:{...pivotDataSource,PanelFiltros},
        //     pipeline:{}
        //     }
        // )
        // }
    
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        const ResponseTamaño = JSON.stringify(pivotDataSource).length;

        // Actualizar el evento con estado "DONE"
        await EventosModel.findByIdAndUpdate(nuevoPost.id, {
            Response: 'pivotDataSource-pipeline',
            ResponseTamaño,
            FechaEnd,
            TimeSpentSec,
            Status: 'DONE',
            StatusCode: 200
        });

            res.status(200).json({
                pivotDataSource:{...pivotDataSource,PanelFiltros},
                pipeline:Pipelina
            })

        } catch (error) {

        // Calcular tiempo transcurrido hasta el error
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
            console.log(error)

            const getError = MapError(error); // Función para mapear el error
            res.status(500).send(getError);  
        }
}
export const GetSearchedValue = async(req,res)=>{
    const { Columna , value } = req.body
    // console.log(Columna)
    // console.log(value)
    try {
        const pool = await InitClientRedisOther().connect()
        const datita = await pool.v4.GET(Columna)
        const daton = JSON.parse(datita)

        // Filtrar los valores más parecidos al `value`
        const searched = daton.filter(item => 
            item.toLowerCase().includes(value.toLowerCase()) // Filtrado básico
        );
        res.status(200).json(searched);
    } catch (error) {
        console.log(error)
    
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);    
    }
}
export const ValidateQuery = async(req,res)=>{
    const { Usuario,IDQuery } = req.body
    //CHEQUEAR SI EL USUARIO ES EL AUTOR VERDADERO Y SI TAMBIEN TIENE ACCESO A EL
    try {
        let queryState = 'NotAllowed'
        const queriesCreadosxUsuariio = await QueriesModel.find({Autor:Usuario}).lean()
        const queryCreadoXUsuario = queriesCreadosxUsuariio.some(x=>x._id===IDQuery) 
        const queriesCompartidos = await QueryXUsuarioModel.findOne({IDQuery:IDQuery,Usuario:Usuario})?true:false
        if(queryCreadoXUsuario&&queriesCompartidos)
        {
            queryState='Editable'
        }
        if(!queryCreadoXUsuario&&queriesCompartidos)
        {
            queryState='Viewable'
        }
        res.json({

            StateQuery:queryState,
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
export const GetDataQuery = async(req,res)=>{
    const { Usuario,IDQuery } = req.body
    console.log(req.body)
    try {
        const data = await QueriesModel.findById(IDQuery)
        
        console.log(data)
        res.json({

            Data:data,
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

export const GetQueriesVistaAutor = async(req,res)=>{
    const {Usuario} = req.body
    try {
        let queriesTotales = []
        const llavesQueries = await QueryXUsuarioModel.find({Usuario:Usuario})
        for (let index = 0; index < llavesQueries.length; index++) {
            if(llavesQueries[index].Permisos.includes('Ver'))
            {
                const querUsuario = await QueriesModel.findById(llavesQueries[index].IDQuery).lean()
                queriesTotales.push({
                    ...querUsuario,
                    Permisos:llavesQueries[index].Permisos
                })
            }
            
        }
        //VISTA QUERIES DE LOS QUE CREO Y LOS QUE SE LE HAN COMPARTIDO
        // const QueriesAutor = await QueriesModel.find({Autor:Usuario}).lean() //LOS QUE CREO
        // const queriesCreadosIDs = QueriesAutor.map(query => query._id.toString());
        // const queriesQueMeCompartieron = await QueryXUsuarioModel.find({Usuario:Usuario}).lean() //LOS QUE ME COMPARTIERON //tambien incluye los mios

        // const queriesTotales = [
        //     ...QueriesAutor, // Los creados por el usuario
        //     ...await QueriesModel.find({ _id: { $in: 
        //         queriesQueMeCompartieron.map(x=>x.IDQuery).filter(x=>!queriesCreadosIDs.includes(x))
        //         // .filter(x => !queriesCreadosIDs.includes(x.IDQuery)) 
        //     } }).lean() // Los compartidos que no creó
        // ];

        // console.log(queriesTotales)

        // console.log(queriesAsignadosv1)
        // console.log(queriesAsignadosv2)
        res.json({

            QueriesTotal:queriesTotales,
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

export const GetQueriesAutorYCompartidos = async(req,res)=>{
    const {Usuario} = req.body
    try {
        //VISTA QUERIES DE LOS QUE CREO Y LOS QUE SE LE HAN COMPARTIDO
        const QueriesAutor = await QueriesModel.find({Autor:Usuario}).lean() //LOS QUE CREO

        let queriesAsignadosv2 = []
        const UsuariosAutor = await UsuariosModel.find({Autor:Usuario}).lean()
     
        const queriesAsignadosv1 = await QueryXUsuarioModel.find({Usuario:{$in:UsuariosAutor.map(x=>x.Usuario)}}).lean() //queries asignados 

        for (let index = 0; index < queriesAsignadosv1.length; index++) {
            const query = await QueriesModel.findById(queriesAsignadosv1[index].IDQuery).lean()
            if(query)
            {
                queriesAsignadosv2.push({...query,Usuario:queriesAsignadosv1[index].Usuario})
            }
           
        }
        // console.log(queriesAsignadosv1)
        // console.log(queriesAsignadosv2)
        res.json({
            QueriesAutor:QueriesAutor,
            QueriesAsignados:queriesAsignadosv2,
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
export const GetTablasUsuario = async(req,res)=>{
    const {Usuario} = req.body
    try {
        let TablasUsuario = []
        const tablasUsuarios = await QueryXUsuarioModel.find({Usuario:Usuario})
        for (let index = 0; index < tablasUsuarios.length; index++) {
            const existeTabla = await QueriesModel.findById(tablasUsuarios[index].IDQuery)
            if(existeTabla)
            {
                TablasUsuario.push(existeTabla.Nombre)
            }  
        }
        return res.json({
            Data:TablasUsuario.map(x=>({
                label:x,
                value:x
            })),
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
export const GetColumnasPorTabla = async(req,res)=>{
    const {Nombre} = req.body
    try {
        const columnasTabla = await QueriesModel.findOne({Nombre:Nombre})
        return res.json({
            Data:JSON.parse(columnasTabla.Columnas),
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
export const GetDataCol = async(req,res)=>{
    const { Columna } = req.body
    // console.log(Columna)
    // Respuesta para solicitudes GET
    try {
        const pool = await InitClientRedisOther().connect()
        const datita = await pool.v4.GET(Columna)
        const daton = JSON.parse(datita)
        res.status(200).json(daton);
    } catch (error) {
        console.log(error)
    
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);  
    }
}