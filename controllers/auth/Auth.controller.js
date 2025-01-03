import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import config from '../../config.js';
import UsuariosModel from '../../models/Usuarios.model.js';
import SesionUsuarioModel from '../../models/SesionUsuario.model.js';
import { MapError } from '../../errorHelper/ErrorApi.js';
import LicenciasXUsuarios from '../../models/LicenciasXUsuarios.js';
import LicenciaModel from '../../models/Licencia.model.js';
import moment from 'moment';
import QueryXUsuarioModel from '../../models/QueryXUsuario.model.js';
export const generateToken = (id)=>{
    return jwt.sign({id},config.token,{
        expiresIn:'8h',
        
    })
}
export const ProtectRoute = async(req,res)=>{
    const { Usuario, token, permiso,Ruta} = req.body
    console.log(Ruta)
    if(!Usuario||!token)
    {   
        
           return res.status(401).send({
            estado:"Error",
            mensaje:"No se encontraron los parametros principales",
            error:"API error"
           }) 
    }
    try {
       
        if(Ruta==='Panel')
        {
            const UsuarioTieneQuery = await QueryXUsuarioModel.findOne({Usuario:Usuario})

            if(!UsuarioTieneQuery)return res.status(401).send({
                estado:"Error",
                mensaje:"Error, usuario no encontrado, se cancela la autenticacion",
                error:"Error de autenticacion"
            })
        }
        //VERIFICAR SI USUARIO EXISTE Y QUE NO TENGA MAS DE UNA SESION ABIERTA
        const ExisteUsuario = await UsuariosModel.findOne({Usuario:Usuario})
        if(!ExisteUsuario) return res.status(401).send({
            estado:"Usuario no existe",
            mensaje:"Error, usuario no encontrado, se cancela la autenticacion",
            error:"Error de autenticacion"
        })
        //VERIFICAR SI TIENE LICENCIA ACTIVA
        const usuarioConLicencia= await LicenciasXUsuarios.findOne({Usuario:Usuario
        })
        if(!usuarioConLicencia) return res.status(401).send({
            estado:"Usuario sin licencia",
            mensaje:"Error, usuario no encontrado, se cancela la autenticacion",
            error:"Error de licencia"
        })
        // Verificar el rango de fechas de la licencia
        const licencia = await LicenciaModel.findById(usuarioConLicencia.IDLicencia);
        if (!licencia) {
            return res.status(401).send({
                estado:"Error",
                mensaje:"No se encontro informacion de la licencia.",
                error:"Error de autenticacion"
            })
        }

        // Obtener la fecha actual
        const fechaActual = moment();

        // Validar que la fecha actual esté dentro del rango
        const licenciaValida =
            fechaActual.isBetween(licencia.FechaEmpiezo, licencia.FechaExpiracion, null, '[]'); // '[]' incluye los límites

        if (!licenciaValida)  return res.status(401).send({
                estado:"Error",
                mensaje:"La licencia del usuario ha expirado o aún no es válida.",
                error:"Error de autenticacion"
            })

        
        
        
        const SesionActiva = await SesionUsuarioModel.findOne({Usuario:Usuario})
        if(SesionActiva.SesionesActivas>1) return res.status(401).send({
            estado:"Error",
            mensaje:"Hay mas de una sesion activa, se procedera a cerrar la sesion...",
            error:"Error de sesion"
        })
        //VERIFICAR TOKEN
        const decoded = jwt.verify(token, config.token)
        const tokenValido = await UsuariosModel.findById(decoded.id)
        if(tokenValido)
        {
            return res.json({
                estado:'Success',
                mensaje:'Ok',
                error:null
            })

        }
        else{
            return res.status(401).send({
                estado:'Error',
                mensaje:'Token es invalido',
                error:"Error de autorizacion"
            })
        }
    } catch (error) {
        const getError = MapError(error)
     
        res.status(500).send(getError)  
    }
}
export const Login = async(req,res)=>{
    // console.log(req.body)
    const {Usuario,Contraseña} = req.body
    try {
       const existUsuario = await UsuariosModel.findOne({Usuario:Usuario}).select('+Contraseña')
       if(!existUsuario) return res.status(500).send({
        mensaje:'Credenciales invalidas',
        estado:'Error',
        error:'Error'
       })
    
       const { Contraseña: passwordHashed, Nombre, Correo, RutaImagenPerfil, Numero, _id,Rol,Empresa } = existUsuario;
       
       const Login = await bcrypt.compare(Contraseña, passwordHashed);
       const verificarSesionesActivas = await SesionUsuarioModel.findOne({
        Usuario:Usuario
       })
       const usuarioConLicencia= await LicenciasXUsuarios.findOne({Usuario:Usuario
       })
 
       if(!usuarioConLicencia) return res.status(500).send({
           estado:"Usuario sin licencia",
           mensaje:"Error, usuario no encontrado, se cancela la autenticacion",
           error:"Error de licencia"
       })
       console.log(usuarioConLicencia)
       // Verificar el rango de fechas de la licencia
       const licencia = await LicenciaModel.findById(usuarioConLicencia.IDLicencia);
       if (!licencia) {
           return res.status(500).send({
               estado:"Error",
               mensaje:"No se encontro informacion de la licencia.",
               error:"Error de autenticacion"
           })
       }
       console.log(licencia)
       // Obtener la fecha actual
       const fechaActual = moment();

       // Validar que la fecha actual esté dentro del rango
       const licenciaValida =
           fechaActual.isBetween(licencia.FechaEmpiezo, licencia.FechaExpiracion, null, '[]'); // '[]' incluye los límites
       console.log(licenciaValida)
       if (!licenciaValida)  return res.status(500).send({
               estado:"Error",
               mensaje:"La licencia del usuario ha expirado o aún no es válida.",
               error:"Error de autenticacion"
           })

       if(verificarSesionesActivas)
       {
        return res.status(500).send({
            mensaje:'Existe mas de una sesion activa.',
            estado:'Error',
            error:'Error'
           })
       }
       if (Login) {
        // Respuesta con los datos del usuario y el token JWT
        const crearSesion = new SesionUsuarioModel({
            Usuario:Usuario,
            SesionesActivas:1
        })
        await crearSesion.save()
        return res.json(
            {
           data: {
            SuperId: _id,
            Usuario: Usuario,
            Nombre: Nombre,
            Rol:Rol,
            token: generateToken(_id), // Generar token JWT
            },
            estado:'Success',
            mensaje:'Crendenciales Validas',
            error:null
    }
    );
    } else {
        // console.log(`${new Date()} - Contraseña errada para el usuario ${Usuario}`);
        return res.status(400).json({
            estado:'Error',
            mensaje:'Credenciales invalidas',
            error:'Credenciales invalidas'
        });
    }
       
    } catch (error) {
        console.log(error)
        res.status(500).send({
            estado:'Error',
            mensaje:'Error desconocido',
            error:'Error desconocido'
        })

    }
}
export const Logout = async(req,res)=>{
    console.log(req.body)
    const {Usuario} = req.body
    try {
        
            await SesionUsuarioModel.deleteOne({Usuario:Usuario})
            res.json({
                
                estado:'Success',
                mensaje:'Usuario termino una sesion activa',
                error:null
            })
    
      
    } catch (error) {
        res.status(500).send({
            estado:'Error',
            mensaje:'Error desconocido',
            error:'Error desconocido'
        }) 
    }
}
export const Test = async(req,res)=>{
    res.json('PRUEBA')
}