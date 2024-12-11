import UsuariosModel from "../../models/Usuarios.model.js";

export const GetUsuarios = async(req,res)=>{
    const { Autor } = req.body
    try {
        
    } catch (error) {
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);   
    }
}
export const CrearUsuario = async(req,res)=>{
    const { FormData } = req.body
    try {
      
    } catch (error) {
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);   
    }
}
export const EditarUsuario = async(req,res)=>{
    const { FormData } = req.body
    try {
        
    } catch (error) {
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);   
    }
}
export const EliminarUsuario = async(req,res)=>{
    const { IDUsuario } = req.body
    try {
        
    } catch (error) {
        console.error(error);
        const getError = MapError(error); // Función para mapear el error
        res.status(500).send(getError);   
    }
}