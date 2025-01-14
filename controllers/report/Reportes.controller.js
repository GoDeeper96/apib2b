import moment from "moment"
import { MapError } from "../../errorHelper/ErrorApi.js"
import EventosModel from "../../models/Eventos.model.js"
import PaginaReportesModel from "../../models/PaginaReportes.model.js"
import ReporteModel from "../../models/Reporte.model.js"
import Reportes_UsuariosModel from "../../models/Reportes_Usuarios.model.js"

export const getReportesNombres = async(req,res)=>{
    const {Usuario} = req.body
    try {
        let repUsuarios = []
        let panes = []
        const LlaveRepsUsuario = await Reportes_UsuariosModel.find({Usuario:Usuario}) //ids Reportes del Usuario
        // console.log('MOTOMAMI')
        // console.log(LlaveRepsUsuario)
        for (let index = 0; index < LlaveRepsUsuario.length; index++) {
            const repUsuario = await ReporteModel.findById(LlaveRepsUsuario[index].PKIDReporte)
            // console.log(repUsuario)
            repUsuarios.push(repUsuario)
            
        }
        // console.log(LlaveRepsUsuario)
        for (let index = 0; index < LlaveRepsUsuario.length; index++) {
            const pag = await PaginaReportesModel.find({PKIDReporte:LlaveRepsUsuario[index].PKIDReporte}).lean()
        
            panes.push(...pag)
        }
        // console.log(panes)
        // const panes = await PaginaReportesModel.find({Usuario:Usuario},{_id:0})
        
        res.json({
            data: {
                Reportes:repUsuarios,
                PanesStorage:panes
            },
            estado:'Success',
            mensaje:'Ok',
            error:null
        })

    } catch (error) {
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);  
    }
} 
export const GetShareViewReporte = async(req,res)=>{
    const {NombreReporte} = req.body

    try {
        let newView =[]
        const dataReporte = await ReporteModel.findById(NombreReporte)
        // console.log(dataReporte)
        const data = await Reportes_UsuariosModel.find({
            PKIDReporte:NombreReporte,
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
export const UnAssignReporte = async(req,res)=>{
    const {Usuario,idreporte,Autor} = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'Desasignar reporte',
        Descripcion:`Desasignando/descompartir reporte ${idreporte}`,
        Funcion:'descompartir:reporte',
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
          const unAssigned = await Reportes_UsuariosModel.findOneAndDelete({PKIDReporte:idreporte,Usuario:Usuario})

          // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
          const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
          const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
          const ResponseTamaño = 1;
  
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
export const EditAssignReporte = async(req,res)=>{
    const {Usuario,IDReporte,Autor,Permisos} = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'Editando accesos reporte',
        Descripcion:`Editando accesos reporte ${IDReporte}`,
        Funcion:'editar:accesos:reporte',
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

         const editarFila = await Reportes_UsuariosModel.updateOne({
            PKIDReporte: IDReporte,
            Usuario: Usuario,
          },
          {
            $set: { Permisos: Permisos }, // Asegura que el array se actualice explícitamente.
          }
         )
         console.log(editarFila)
         // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
         const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
         const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
         const ResponseTamaño = 1;
 

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
export const EditarReporte = async(req,res)=>{
    const { FormData } = req.body
    const nuevoPost = new EventosModel({
        Autor:FormData.Autor,
        EventoNombre:'Guardando cambios en Reporte...',
        Descripcion:`Editando reporte ${FormData.Nombre}`,
        Funcion:'editar:reporte', // = EDITAR
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
            console.log(FormData)
            const repUsuarios = await Reportes_UsuariosModel.find({
                Usuario:FormData.Usuario
            })
            const itemsStorageParsed = JSON.parse(FormData.itemsStorage)
            //  await ReporteModel.findByIdAndDelete(dupId)
            // await Reportes_UsuariosModel.deleteMany({PKIDReporte:dupId})
            await PaginaReportesModel.deleteMany({PKIDReporte:FormData.PKIDReporte})
            if(FormData.Favorito) //SI ES FAVORITO ENTONCES CAMBIAR EL FAVORITO ANTERIOR Y PONERLE FALSO Y AL NUEVO HAY QUE PONERLE TRUE SOLO DEBE EXISTIR UN FAVORITOP
        
            {   
            
                for (let index = 0; index < repUsuarios.length; index++) {
                    const existeFavorito = await ReporteModel.findById(repUsuarios[index].PKIDReporte)
                    if(existeFavorito&&existeFavorito.Favorito)
                    {
                        const updateado = await ReporteModel.findByIdAndUpdate(repUsuarios[index].PKIDReporte,
                        {
                            Favorito:false
                        }
                    )
                    }
                    
                }
               
            }
            const reporteUpdate = await ReporteModel.findByIdAndUpdate(FormData.PKIDReporte,{
                Nombre:FormData.Nombre,
                Favorito:FormData.Favorito?true:false,
                Descripcion:FormData.Descripcion,
                DinamicoEstatico:FormData.DinamicoEstatico?true:false,
                RutaImagenReporte:'',
                // Editable:FormData.Editable?true:false,
                Autor:FormData.Usuario,
                
            })
            // const reporteUsuarioUpdate = await Reportes_UsuariosModel.findOneAndUpdate({

            // },{})
            for (let index = 0; index < FormData.Paginas.length; index++) {
            
                const PaginaN = itemsStorageParsed.filter(x=>x.idReporte===FormData.Paginas[index].idReporte)
                
                const nuevaPagina = new PaginaReportesModel({
                    // Usuario:FormData.Usuario,
                    PKIDReporte:FormData.PKIDReporte,
                    IDReporte:FormData.Nombre,
                    Descripcion:FormData.Paginas[index].DescripcionReporte,
                    Nombre:FormData.Paginas[index].idReporte,
                    ReporteData:JSON.stringify(PaginaN)
                })
                await nuevaPagina.save()
                
            }
            

            const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
            const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
            const ResponseTamaño = 1;

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
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);   
    }
}
export const ShareAsignReport = async(req,res)=>{
    const { NombreReporte,
        IDReporte,
        Usuario,
        Autor,
        Permisos} = req.body
        const nuevoPost = new EventosModel({
            Autor:Autor,
            EventoNombre:'CompartirReporte',
            Descripcion:`Compartiendo reporte ${NombreReporte}`,
            Funcion:'compartir:reporte',
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
        // const getPKIDReporte= await ReporteModel.findOne({Nombre:NombreReporte})
        const nuevoInstancia = new Reportes_UsuariosModel(
            {
                Permisos:Permisos,
                Usuario:Usuario,
                PKIDReporte:IDReporte
            })
        await nuevoInstancia.save()
           
         // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
         const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
         const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
         const ResponseTamaño = 1;
 
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
export const getReportesSolido = async(req,res)=>{
    const {PKIDReporte,Pagina} = req.body
    try {
        const Reportes = await PaginaReportesModel.find({PKIDReporte:PKIDReporte,Nombre:Pagina},{_id:0})
        res.json({
            data: Reportes,
            estado:'Success',
            mensaje:'Ok',
            error:null
        })

    } catch (error) {
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);  
    }
} 
export const GetReporte = async(req,res)=>{
    const {idreporte} = req.body
    try {
       const reporte =await ReporteModel.findById(idreporte)
       if(!reporte) return res.status(500).send({
        estado:"Error",
        mensaje:"Reporte no existe",
        error:"Reporte inexistente"
        })
       const data= await PaginaReportesModel.find({
        PKIDReporte:idreporte
        })
        res.json({
            data: data,
            ReporteInfo:reporte,
            estado:'Success',
            mensaje:'Ok',
            error:null
        })  
    } catch (error) {
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);    
    }
}
export const getReporteQuery = async(req,res)=>{
    const { Usuario } = req.body
    try {
        // console.log(Usuario)
        let repUsuarios = []
        const LlaveRepsUsuario = await Reportes_UsuariosModel.find({Usuario:Usuario}) //ids Reportes del Usuario
        for (let index = 0; index < LlaveRepsUsuario.length; index++) {
            if(LlaveRepsUsuario[index].Permisos.includes('Ver'))
            {
                const repUsuario = await ReporteModel.findById(LlaveRepsUsuario[index].PKIDReporte).lean()
                repUsuarios.push({...repUsuario,Permisos:LlaveRepsUsuario[index].Permisos})
            }
           
            
        }
        console.log(repUsuarios)
        // const dataTotal = await Reportes_UsuariosModel.find({Usuario:Usuario}).lean()
        // console.log(dataTotal)
        res.json({
            data: repUsuarios,
            estado:'Success',
            mensaje:'Ok',
            error:null
        })    
    } catch (error) {
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);  
    }
    // try {
    //     // Construir el filtro dinámico
    //     const filtro = {};
    
    //     if (SearchInput) {
    //       filtro.Nombre = { $regex: SearchInput, $options: "i" }; // Búsqueda insensible a mayúsculas
    //     }
    
    //     if (Fecha && Array.isArray(Fecha) && Fecha.length === 2) {
    //       const [startDate, endDate] = Fecha;
    //       filtro.createdAt = {
    //         $gte: new Date(startDate), // Fecha inicial
    //         $lte: new Date(endDate),   // Fecha final
    //       };
    //     }
    
    //     // Configuración de paginación pagSize siempre es 20
    //     const skip = (page - 1) * pageSize;
    //     const limit = pageSize;
    
    //     // Consultar los datos y contar el total
    //     // const [data, totalDocuments] = await Promise.all([
    //     //     Reportes_UsuariosModel.find(filtro).skip(skip).limit(limit).exec(),
    //     //     Reportes_UsuariosModel.countDocuments(filtro).exec(),
    //     // ]);
    //     console.log(filtro)

    //     const data = await Reportes_UsuariosModel.find(filtro).skip(skip).limit(limit)
    //     const tamaño = await Reportes_UsuariosModel.find(filtro).countDocuments()
        
    //     // Calcular total de páginas
    //     const totalPages = Math.ceil(tamaño / pageSize);
    //     console.log(data)
    //     console.log(tamaño)
    //     console.log(totalPages)
    //     // Responder con datos y metadatos
    //     res.status(200).json({
    //     estado:'Success',
    //       data,
    //       pagination: {
    //         tamaño,
    //         totalPages,
    //         currentPage: page,
    //         pageSize,
    //       },
    //     });
    //   } catch (error) {
    //     console.error(error);
    //     const getError = MapError(error); // Función para mapear el error
    //     res.status(500).send(getError);
    //   }
}
//SE DEBE ASEGURAR CON UN ROLLBACK EL SEGUNDO SAVE
export const crearReporte = async(req,res)=>{
        const { FormData } = req.body
        // console.log(FormData)
        // console.log(FormData)
        // console.log(req.body)
        const nuevoPost = new EventosModel({
            Autor:FormData.Autor,
            EventoNombre:'Guardando cambios en Reporte...',
            Descripcion:`Creando reporte ${FormData.Nombre}`,
            Funcion:'crear:reporte', //CREAR = EDITAR
            ConsultaPayload:JSON.stringify(req.body),
            Response:'En progreso...',
            ResponseTamaño:0,
            FechaStart:moment().format('YYYY-MM-DD hh:mm:ss'),
            FechaEnd:null,
            TimeSpentSec:0,
            Status:'LOADING',
            StatusCode:0
        })
        // await nuevoPost.save()    
        // let nuevoPost = null
    try {
        // let duplicado = false
        // let dupId = null
        const repUsuarios = await Reportes_UsuariosModel.find({
            Usuario:FormData.Usuario
        })
        // for (let index = 0; index < repUsuarios.length; index++) {
        //     const ExisteReporteConMismoNombre = await ReporteModel.findById(repUsuarios[index].PKIDReporte)
        //     if(ExisteReporteConMismoNombre.Nombre===FormData.Nombre)
        //     {
        //         duplicado=true
        //         dupId=ExisteReporteConMismoNombre.id
        //         // return res.status(500).send({
        //         //     estado:"Error",
        //         //     mensaje:"Nombre de reporte duplicado",
        //         //     error:"Reporte Duplicacion"
        //         // })
        //     }
        // }
        const itemsStorageParsed = JSON.parse(FormData.itemsStorage)
        // if(duplicado&&dupId) //CAMBIARA CUANDO SE PONGA LA LOGICA DE COMPARTIR
        // {
        //     nuevoPost = new EventosModel({
        //         Autor:FormData.Autor,
        //         EventoNombre:'Editando reporte...',
        //         Descripcion:`Editando reporte ${FormData.Nombre}`,
        //         Funcion:'editar:reporte', //CREAR = EDITAR
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




        //     // await ReporteModel.findByIdAndDelete(dupId)
        //     // await Reportes_UsuariosModel.deleteMany({PKIDReporte:dupId})
        //     await PaginaReportesModel.deleteMany({PKIDReporte:dupId})
        //     if(FormData.Favorito) //SI ES FAVORITO ENTONCES CAMBIAR EL FAVORITO ANTERIOR Y PONERLE FALSO Y AL NUEVO HAY QUE PONERLE TRUE SOLO DEBE EXISTIR UN FAVORITOP
        
        //     {   
            
        //         for (let index = 0; index < repUsuarios.length; index++) {
        //             const existeFavorito = await ReporteModel.findById(repUsuarios[index].PKIDReporte)
        //             if(existeFavorito&&existeFavorito.Favorito)
        //             {
        //                 const updateado = await ReporteModel.findByIdAndUpdate(repUsuarios[index].PKIDReporte,
        //                 {
        //                     Favorito:false
        //                 }
        //             )
        //             }
                    
        //         }
               
        //     }
        //     const reporteUpdate = await ReporteModel.findByIdAndUpdate(dupId,{
        //         Nombre:FormData.Nombre,
        //         Favorito:FormData.Favorito?true:false,
        //         Descripcion:FormData.Descripcion,
        //         DinamicoEstatico:FormData.DinamicoEstatico?true:false,
        //         RutaImagenReporte:'',
        //         // Editable:FormData.Editable?true:false,
        //         Autor:FormData.Usuario,
                
        //     })
        //     // const reporteUsuarioUpdate = await Reportes_UsuariosModel.findOneAndUpdate({

        //     // },{})
        //     for (let index = 0; index < FormData.Paginas.length; index++) {
            
        //         const PaginaN = itemsStorageParsed.filter(x=>x.idReporte===FormData.Paginas[index].idReporte)
                
        //         const nuevaPagina = new PaginaReportesModel({
        //             // Usuario:FormData.Usuario,
        //             PKIDReporte:dupId,
        //             IDReporte:FormData.Nombre,
        //             Descripcion:FormData.Paginas[index].DescripcionReporte,
        //             Nombre:FormData.Paginas[index].idReporte,
        //             ReporteData:JSON.stringify(PaginaN)
        //         })
        //         await nuevaPagina.save()
                
        //     }
            
        //     // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
        //     const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        //     const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        //     const ResponseTamaño = 1;

        //     // Actualizar el evento con estado "DONE"
        //     await EventosModel.findByIdAndUpdate(nuevoPost.id, {
        //         Response: 'FormData',
        //         ResponseTamaño,
        //         FechaEnd,
        //         TimeSpentSec,
        //         Status: 'DONE',
        //         StatusCode: 200
        //     });
        //     return res.json({
        //         estado:'Success',
        //         mensaje:'Ok',
        //         error:null
        //     })
        // }
      

        //1.PRIMERO CREAR REPORTE EN REPORTEMODEL
        //2.CREAR REPORTES EN REPORTE USUARIO 
        if(FormData.Favorito) //SI ES FAVORITO ENTONCES CAMBIAR EL FAVORITO ANTERIOR Y PONERLE FALSO Y AL NUEVO HAY QUE PONERLE TRUE SOLO DEBE EXISTIR UN FAVORITOP
        
            {   
               
                for (let index = 0; index < repUsuarios.length; index++) {
                    const existeFavorito = await ReporteModel.findById(repUsuarios[index].PKIDReporte)
                    if(existeFavorito&&existeFavorito.Favorito)
                    {
                        const updateado = await ReporteModel.findByIdAndUpdate(repUsuarios[index].PKIDReporte,
                        {
                            Favorito:false
                        }
                    )
                    }
                    
                }
               
            }
        const reporte = new ReporteModel({
            Nombre:FormData.Nombre,
            Favorito:FormData.Favorito?true:false,
            Descripcion:FormData.Descripcion,
            DinamicoEstatico:FormData.DinamicoEstatico?true:false,
            RutaImagenReporte:'',
            // Editable:FormData.Editable?true:false,
            Autor:FormData.Usuario,
            NombreQuery:FormData.NombreQuery
        })
        await reporte.save()

        const reportes = new Reportes_UsuariosModel({
            // Nombre:FormData.Nombre,
            PKIDReporte:reporte.id,
            Usuario:FormData.Usuario,
            Permisos:['Ver','Editar']
            // Favorito:FormData.Favorito,
            // Descripcion:FormData.Descripcion,

        })
        
        await reportes.save()
        for (let index = 0; index < FormData.Paginas.length; index++) {
            
            const PaginaN = itemsStorageParsed.filter(x=>x.idReporte===FormData.Paginas[index].idReporte)
            
            const nuevaPagina = new PaginaReportesModel({
                // Usuario:FormData.Usuario,
                PKIDReporte:reporte.id,
                IDReporte:FormData.Nombre,
                Descripcion:FormData.Paginas[index].DescripcionReporte,
                Nombre:FormData.Paginas[index].idReporte,
                ReporteData:JSON.stringify(PaginaN)
            })
            await nuevaPagina.save()
            
        }
        // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        const ResponseTamaño = 1;

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
        const getError = MapError(error)
        console.log(getError)
        res.status(500).send(getError)  
    }
}
export const deleteReporte = async(req,res)=>{
    const {idreporte,Autor} = req.body
    const rep = await ReporteModel.findById(idreporte)
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'Eliminando Reporte...',
        Descripcion:`Eliminando reporte ${rep.Nombre}`,
        Funcion:'eliminar:reporte',
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
        //ADVERTIR COMPARTIDO

        const rep = await ReporteModel.findByIdAndDelete(idreporte)
        const rep1 = await Reportes_UsuariosModel.deleteMany({
            PKIDReporte:idreporte
        })
        const paginasEliminadas = await PaginaReportesModel.deleteMany({PKIDReporte:idreporte})

        // const rep2 = await Reportes_UsuariosModel.deleteMany({
        //     PKIDReporte:idreporte
        // })
          // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
          const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
          const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
          const ResponseTamaño = 1;
  
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