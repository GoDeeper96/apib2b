import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import UsuariosModel from '../models/Usuarios.model.js'
import config from '../config.js'


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


