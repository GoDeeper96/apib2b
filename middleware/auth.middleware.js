import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import UsuariosModel from '../models/Usuarios.model.js'
import config from '../config.js'
import QueryXUsuarioModel from '../models/QueryXUsuario.model.js'
import LicenciasXUsuarios from '../models/LicenciasXUsuarios.js'
import LicenciasXFunciones from '../models/LicenciasXFunciones.js'


export const protect = asyncHandler(async (req, res, next) => {
    let token
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        
        token = req.headers.authorization.split(' ')[1]
 
        // Verify token
    
        const decoded = jwt.verify(token, config.token)
     
        // console.log(decoded.exp.toString())
        // Get user from the token
        req.user = await UsuariosModel.findById(decoded.id)
  
        next()
      } catch (error) {
       
        res.status(401).json({mensaje:'No esta autorizado para realizar esta tarea, porfavor inicie sesión de nuevo.',
            error:'Error:Autorizacion',
            estado:'Error',
        });
      }
    }
  
    if (!token) {
   
      return res.status(401).json({
        mensaje:'No esta autorizado para realizar esta tarea, porfavor inicie sesión de nuevo.',
        error:'Error:Autorizacion',
        estado:'Error',
      });
      // res.status(401)
      // res.send({mensaje:'Sin token'})
      // throw new Error('Sin autorización porque token no fue encontrado')
    }
  })
export const CheckAccess = asyncHandler(async(req,res,next)=>{
    const { FormData,Permiso } = req.body
    // console.log('funcionando')
    // console.log(FormData)
    // console.log(Permiso)
    try {
      const licenciaUsuario = await LicenciasXUsuarios.findOne({Usuario:FormData.Autor})
        const Accesos = await LicenciasXFunciones.find({IDLicencia:licenciaUsuario.IDLicencia}).lean()
        if(Accesos.some(x=>x.Permiso===Permiso)) //primer filtro
        {
          next()
        }
        else{
          return res.status(500).json({
            mensaje:'No esta autorizado para realizar esta tarea, porfavor inicie sesión de nuevo.',
            error:'Error:Autorizacion',
            estado:'Error',
          });
        }
     
    } catch (error) {
      res.status(500).json({
        mensaje:'No esta autorizado para realizar esta tarea, porfavor inicie sesión de nuevo.',
        error:'Error:Autorizacion',
        estado:'Error',
      });
    }
    

})


