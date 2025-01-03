import moment from "moment";
import EventosModel from "../../models/Eventos.model.js";
import LicenciaModel from "../../models/Licencia.model.js";
import LicenciasXFunciones from "../../models/LicenciasXFunciones.js";
import LicenciasXUsuarios from "../../models/LicenciasXUsuarios.js";
import { MapError } from "../../errorHelper/ErrorApi.js";
import UsuariosModel from "../../models/Usuarios.model.js";

export const CreateLicencias = async(req,res)=>{
    const {FormData} = req.body
    console.log(FormData)
    const nuevoPost = new EventosModel({
        Autor:FormData.Autor,
        EventoNombre:'creando licencia...',
        Descripcion:`creando licencia ${FormData.Nombre}`,
        Funcion:'crear:licencia',
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
        const data = new LicenciaModel({Autor:FormData.Autor,Nombre:FormData.Nombre,
            FechaExpiracion:moment(FormData.FechaExpiracion[1]).format('YYYY-MM-DD'),
            FechaEmpiezo:moment(FormData.FechaExpiracion[0]).format('YYYY-MM-DD')
        })
        await data.save()
        for (let index = 0; index < FormData.Permisos.length; index++) {
            const nuevosPermisos = new LicenciasXFunciones({IDLicencia:data.id,Permiso:FormData.Permisos[index]})
            await nuevosPermisos.save()
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
        return res.json({
            LicenciaID:data.id,
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
export const DeleteLicencias = async(req,res)=>{
    const {IDLicencia,Autor} = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'eliminando licencia...',
        Descripcion:`eliminando licencia ${IDLicencia}`,
        Funcion:'crear:licencia',
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
        const deletearLicencias = await LicenciaModel.findByIdAndDelete(IDLicencia)
        const deletearLicenciasXFunciones = await LicenciasXFunciones.deleteMany({IDLicencia:IDLicencia})
        const deletearLicenciasDeUsuarios  = await LicenciasXUsuarios.deleteMany({IDLicencia:IDLicencia})
        
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
        return res.json({
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
export const ActivarUsuario = async(req,res)=>{
    const { LicenciaID,Usuario,Autor} = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'activando usuario...',
        Descripcion:`activando Usuario ${Usuario}`,
        Funcion:'crear:licencia',
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

         const usuarioEstaActivado = await LicenciasXUsuarios.findOne({IDLicencia:LicenciaID,Usuario:Usuario})
    
         if(usuarioEstaActivado) 
         {
            const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
            const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
            // Intentar actualizar el evento solo si fue creado exitosamente
            if (nuevoPost && nuevoPost.id) {
                await EventosModel.findByIdAndUpdate(nuevoPost.id, {
                    Response: 'Error de activacion',
                    ResponseTamaño: 0,
                    FechaEnd,
                    TimeSpentSec,
                    Status: 'ERROR',
                    StatusCode: 500
                });
            }
            return res.status(500).send({
                estado:'Error',
                mensaje:'Usuario ya tiene licencia!',
                error:"Error de activacion"
            }) 
         }   
         const licenciaEnUso = await LicenciasXUsuarios.findOne({IDLicencia:LicenciaID})
         if(licenciaEnUso)
            {
                const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
            const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
            // Intentar actualizar el evento solo si fue creado exitosamente
            if (nuevoPost && nuevoPost.id) {
                await EventosModel.findByIdAndUpdate(nuevoPost.id, {
                    Response: 'Error de activacion',
                    ResponseTamaño: 0,
                    FechaEnd,
                    TimeSpentSec,
                    Status: 'ERROR',
                    StatusCode: 500
                });
            }
            return res.status(500).send({
                estado:'Error',
                mensaje:'Licencia en uso',
                error:"Error de activacion"
            }) 
            }  
        const nuevoUsuarioXLicencia = new LicenciasXUsuarios({
            IDLicencia:LicenciaID,
            Usuario:Usuario
        })
        await nuevoUsuarioXLicencia.save()
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
         return res.json({
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
export const DesactivarUsuario = async(req,res)=>{
    const { LicenciaID,Usuario,Autor} = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'activando usuario...',
        Descripcion:`activando Usuario ${Usuario}`,
        Funcion:'crear:licencia',
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
        const buscarUsuarioLicenciaID= await LicenciasXUsuarios.findOne({IDLicencia:LicenciaID,Usuario:Usuario})
        if(buscarUsuarioLicenciaID)
        {
            await LicenciasXUsuarios.findOneAndDelete({IDLicencia:LicenciaID,Usuario:Usuario})

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
            return res.json({
                estado:'Success',
                mensaje:'Ok',
                error:null
            })
        }
        else{
            const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
            const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
            // Intentar actualizar el evento solo si fue creado exitosamente
            if (nuevoPost && nuevoPost.id) {
                await EventosModel.findByIdAndUpdate(nuevoPost.id, {
                    Response: 'Error de activacion',
                    ResponseTamaño: 0,
                    FechaEnd,
                    TimeSpentSec,
                    Status: 'ERROR',
                    StatusCode: 500
                });
            }
            return res.status(500).send({
                estado:'Error',
                mensaje:'El usuario seleccionado no existe o no tiene ninguna licencia activada',
                error:"Error de activacion"
            }) 
        }
       
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
export const UpdateLicencias = async(req,res)=>{
    
}
export const ViewLicencias = async(req,res)=>{
    const {Autor } = req.body
    try {
        let vistaFinal = []
        
        const UsuariosAutor = await UsuariosModel.find({Autor:Autor}).lean()
        const UsuariosConLicencia = await LicenciasXUsuarios.find({
            Usuario:{$in:UsuariosAutor.map(x=>x.Usuario)}
        }).lean()
        
        for (let index = 0; index < UsuariosConLicencia.length; index++) {
            const PermisosUsuarios=await LicenciasXFunciones.find({IDLicencia:UsuariosConLicencia[index].IDLicencia}).lean()
            const Licencias = await LicenciaModel.findById(UsuariosConLicencia[index].IDLicencia).lean()
            vistaFinal.push({
         
                    Nombre:Licencias.Nombre,
                    Usuario:UsuariosConLicencia[index].Usuario,
                    Permisos:PermisosUsuarios,
                    FechaEmpiezo:Licencias.FechaEmpiezo,
                    FechaExpiracion:Licencias.FechaExpiracion,
            })
            
        }
        return res.json({
            Data:vistaFinal,
            estado:'Success',
            mensaje:'Ok',
            error:null
        })
    } catch (error) {
        const getError = MapError(error); // Función para mapear el error  
        res.status(500).send(getError);      
    }
}