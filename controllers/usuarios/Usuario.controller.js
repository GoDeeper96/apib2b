import moment from "moment";
import { MapError } from "../../errorHelper/ErrorApi.js";
import EventosModel from "../../models/Eventos.model.js";
import UsuariosModel from "../../models/Usuarios.model.js";
import bcrypt from 'bcrypt'
export const GetUsuarios = async(req,res)=>{
    const { Usuario } = req.body
    try {
        const getUsuariosCreadosPorUsuario = await UsuariosModel.find({Autor:Usuario}).lean()
        res.json({
            data: getUsuariosCreadosPorUsuario,
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
export const CrearUsuario = async(req,res)=>{
    const { FormData } = req.body
    
    
    const nuevoPost = new EventosModel({
       Autor:FormData.Autor,
       EventoNombre:'CrearUsuario',
       Descripcion:` creando ${FormData.Usuario}...`,
       Funcion:'crear:usuario',
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
        console.log(FormData)
        const duplicado = await UsuariosModel.findOne({Usuario:FormData.Usuario})
        if(duplicado)  return res.status(500).send({
            estado:'Error',
            mensaje:'Usuario duplicado!',
            error:"Error de duplicacion"
        }) 
        const hashedPassword=await bcrypt.hash(FormData.Contraseña,12)  
        const data = new UsuariosModel({...FormData,Contraseña:hashedPassword})
        await data.save()

        // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
          const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
          const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
          const ResponseTamaño = JSON.stringify(data).length;
      
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
export const EditarUsuario = async(req,res)=>{
    const { FormData } = req.body
    //ANTES O DESPUES?
    if(!FormData.Usuario) return res.status(500).send({
        estado:'Error',
        mensaje:'Usuario no encontrado!',
        error:"Error de servicio"
    }) 
    const nuevoPost = new EventosModel({
        Autor:FormData.Autor,
        EventoNombre:'EditarUsuario',
        Descripcion:`editando ${FormData.Usuario}`,
        Funcion:'crear:usuario',
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
        
        const update = await UsuariosModel.findOneAndUpdate({Usuario:FormData.Usuario},{
            ...FormData
            
        })

        // const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
        const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
        const TimeSpentSec = moment(FechaEnd).diff(moment(nuevoPost.FechaStart), 'seconds');
        const ResponseTamaño = JSON.stringify(req.body).length;

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
export const EliminarUsuario = async(req,res)=>{
    const { Usuario,Autor } = req.body
    //ELIMINAR TODO RASTRO DE USUARIO
    //DE GRUPOS, DE PERMISOS, DE LICENCIAS, DE QUERYS, DE REPORTESxUsuario
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'EliminandoUsuario',
        Descripcion:`eliminando ${Usuario}`,
        Funcion:'eliminar:usuario',
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
        const existeUsuario = await UsuariosModel.findOne({Usuario:Usuario})
        if(!existeUsuario) return res.status(500).send({
            estado:'Error',
            mensaje:'Usuario inexistente',
            error:"Usuario inexistente"
        }) 
        const deleteUser = await UsuariosModel.findOneAndDelete({Usuario:Usuario})






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
export const CambiarContraseña = async(req,res)=>{
    const { Usuario,NuevaContraseña,Autor } = req.body
    const nuevoPost = new EventosModel({
        Autor:Autor,
        EventoNombre:'CambiarContraseña',
        Descripcion:` cambiando contraseña de ${Usuario}...`,
        Funcion:'cambiar_contraseña:usuario',
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
        const cambiarPass = await UsuariosModel.findOne({Usuario:Usuario})
        if(!cambiarPass)return res.status(500).send({
            estado:'Error',
            mensaje:'Usuario no existe',
            error:"Usuario no existe"
        }) 
        const hashedPassword=await bcrypt.hash(NuevaContraseña,12)  
        const updateContraseña = await UsuariosModel.findOneAndUpdate({Usuario:Usuario},{Contraseña:hashedPassword})
        
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