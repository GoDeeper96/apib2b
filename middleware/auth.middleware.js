import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import UsuariosModel from '../models/Usuarios.model.js'
import config from '../config.js'
import QueryXUsuarioModel from '../models/QueryXUsuario.model.js'
import LicenciasXUsuarios from '../models/LicenciasXUsuarios.js'
import LicenciasXFunciones from '../models/LicenciasXFunciones.js'
import ReporteModel from '../models/Reporte.model.js'
import QueriesModel from '../models/Queries.model.js'


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
       
        res.status(401).json({
          mensaje:'No esta autorizado para realizar esta tarea, porfavor inicie sesión de nuevo.',
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
export const DesAsignarQuery = asyncHandler(async(req,res,next)=>{
  const { NombreQuery,IDQuery,Usuario,Autor,Permiso }=req.body
  try {
    const licencia = await LicenciasXUsuarios.findOne({Usuario:Autor})
    const PermisosUsuario = await LicenciasXFunciones.find({IDLicencia:licencia.IDLicencia})
    if(PermisosUsuario.some(x=>x.Permiso===Permiso))
      {
            //por ahora solo autor puede hacer que otros usuarios vean o usen su query o desasginar
        const AutorQuery = await QueriesModel.findById(IDQuery)
        if(AutorQuery.Autor===Usuario)
        {
          next()
        }
        else{
          return res.status(500).json({
            mensaje:'No esta autorizado para realizar esta accion.',
            error:'Error:Autorizacion',
            estado:'Error',
          });
        }
      }
  
      
      else{
        return res.status(500).json({
          mensaje:'No esta autorizado para realizar esta accion.',
          error:'Error:Autorizacion',
          estado:'Error',
        });
      }
  } catch (error) {
    res.status(500).json({
      mensaje:'No esta autorizado para realizar esta accion.',
      error:'Error:Autorizacion',
      estado:'Error',
    });
  }
})
export const UnshareQuery = asyncHandler(async(req,res,next)=>{
  const { NombreQuery,IDQuery,Usuario,Autor,Permiso }=req.body
  try {
    const licencia = await LicenciasXUsuarios.findOne({Usuario:Autor})
    const PermisosUsuario = await LicenciasXFunciones.find({IDLicencia:licencia.IDLicencia})
    if(PermisosUsuario.some(x=>x.Permiso===Permiso))
      {
            //por ahora solo autor puede hacer que otros usuarios vean o usen su query o desasginar
        const AutorQuery = await QueriesModel.findById(IDQuery)
        if(AutorQuery.Autor===Usuario)
        {
          next()
        }
        else{
          return res.status(500).json({
            mensaje:'No esta autorizado para realizar esta accion.',
            error:'Error:Autorizacion',
            estado:'Error',
          });
        }
      }
  
      
      else{
        return res.status(500).json({
          mensaje:'No esta autorizado para realizar esta accion.',
          error:'Error:Autorizacion',
          estado:'Error',
        });
      }
  } catch (error) {
    res.status(500).json({
      mensaje:'No esta autorizado para realizar esta accion.',
      error:'Error:Autorizacion',
      estado:'Error',
    });
  }
})
export const CheckCompartir = asyncHandler(async(req,res,next)=>{
  const { NombreQuery,IDQuery,Usuario,Autor,Permiso }=req.body
  try {
    const licencia = await LicenciasXUsuarios.findOne({Usuario:Autor})
    const PermisosUsuario = await LicenciasXFunciones.find({IDLicencia:licencia.IDLicencia})
    if(PermisosUsuario.some(x=>x.Permiso===Permiso))
    {
          //por ahora solo autor puede hacer que otros usuarios vean o usen su query
      const AutorQuery = await QueriesModel.findById(IDQuery)
      if(AutorQuery.Autor===Usuario)
      {
        next()
      }
      else{
        return res.status(500).json({
          mensaje:'No esta autorizado para realizar esta accion.',
          error:'Error:Autorizacion',
          estado:'Error',
        });
      }
    }

    
    else{
      return res.status(500).json({
        mensaje:'No esta autorizado para realizar esta accion.',
        error:'Error:Autorizacion',
        estado:'Error',
      });
    }
  } catch (error) {
    res.status(500).json({
      mensaje:'No esta autorizado para realizar esta accion.',
      error:'Error:Autorizacion',
      estado:'Error',
    });
  }
})
export const CheckCompartirNivelAdministrativo = asyncHandler(async(req,res,next)=>{
  const { NombreQuery,IDQuery,Usuario,Autor,Permiso }=req.body
  try {
    const licencia = await LicenciasXUsuarios.findOne({Usuario:Autor})
    const PermisosUsuario = await LicenciasXFunciones.find({IDLicencia:licencia.IDLicencia})
    if(PermisosUsuario.some(x=>x.Permiso===Permiso))
    {
      next()
    }
    else{
      return res.status(500).json({
        mensaje:'No esta autorizado para realizar esta accion.',
        error:'Error:Autorizacion',
        estado:'Error',
      });
    }
  } catch (error) {
    res.status(500).json({
      mensaje:'No esta autorizado para realizar esta accion.',
      error:'Error:Autorizacion',
      estado:'Error',
    });
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
            mensaje:'No esta autorizado para realizar esta accion.',
            error:'Error:Autorizacion',
            estado:'Error',
          });
        }
     
    } catch (error) {
      res.status(500).json({
        mensaje:'No esta autorizado para realizar esta accion.',
        error:'Error:Autorizacion',
        estado:'Error',
      });
    }
    

})
export const CheckDeleteQuery = asyncHandler(async(req,res,next)=>{ //PARA OTROS QUE NO SEA CREAR
  //deletes - solo un autor puede eliminar
  const { IDQuery,Autor,Permiso } = req.body
  // console.log('funcionando')
  // console.log(FormData)
  // console.log(Permiso)
  try {
    const licenciaUsuario = await LicenciasXUsuarios.findOne({Usuario:Autor})
      const Accesos = await LicenciasXFunciones.find({IDLicencia:licenciaUsuario.IDLicencia}).lean()
      if(Accesos.some(x=>x.Permiso===Permiso)) //primer filtro
      {
        // y que sea autor del recurso
        const query = await QueriesModel.findById(IDQuery)
        if(query.Autor===Autor)
        {
          next()
        }
        else{
          return res.status(500).json({
            mensaje:'No esta autorizado para realizar esta accion.',
            error:'Error:Autorizacion',
            estado:'Error',
          });
        }
        // 
      }
      else{
        return res.status(500).json({
          mensaje:'No esta autorizado para realizar esta accion.',
          error:'Error:Autorizacion',
          estado:'Error',
        });
      }
   
  } catch (error) {
    res.status(500).json({
      mensaje:'No esta autorizado para realizar esta accion.',
      error:'Error:Autorizacion',
      estado:'Error',
    });
  }
  

})
export const CheckDeleteReporte = asyncHandler(async(req,res,next)=>{ //PARA OTROS QUE NO SEA CREAR
  //deletes - solo un autor puede eliminar
  const { idreporte,Autor,Permiso } = req.body
  // console.log('funcionando')
  // console.log(FormData)
  // console.log(Permiso)
  try {
    const licenciaUsuario = await LicenciasXUsuarios.findOne({Usuario:Autor})
      const Accesos = await LicenciasXFunciones.find({IDLicencia:licenciaUsuario.IDLicencia}).lean()
      if(Accesos.some(x=>x.Permiso===Permiso)) //primer filtro
      {
        // y que sea autor del recurso
        const reporte = await ReporteModel.findById(idreporte)
        if(reporte.Autor===Autor)
        {
          next()
        }
        else{
          return res.status(500).json({
            mensaje:'No esta autorizado para realizar esta accion.',
            error:'Error:Autorizacion',
            estado:'Error',
          });
        }
        // 
      }
      else{
        return res.status(500).json({
          mensaje:'No esta autorizado para realizar esta accion.',
          error:'Error:Autorizacion',
          estado:'Error',
        });
      }
   
  } catch (error) {
    res.status(500).json({
      mensaje:'No esta autorizado para realizar esta accion.',
      error:'Error:Autorizacion',
      estado:'Error',
    });
  }
  

})

