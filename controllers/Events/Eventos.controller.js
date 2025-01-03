import EventosModel from "../../models/Eventos.model.js";
import UsuariosModel from "../../models/Usuarios.model.js";

export const GetEventosAutor = async(req,res)=>{
    const { Autor }  = req.body
    try {
        //TODOS LOS EVENTOS DE LOS USUARIOS QUE HAN SIDO CREADOS POR EL USUARIO QUE VE ESTA VISTA
        const UsuariosCreadosPorAutor = await UsuariosModel.find({Autor:Autor},{Usuario:1}).lean()
        // console.log(UsuariosCreadosPorAutor)
        const maping = UsuariosCreadosPorAutor.length!==0?UsuariosCreadosPorAutor.map(x=>x.Usuario):[Autor]
        
        // console.log(maping)
        const getPost = await EventosModel.find({Autor:{$in:maping}}).lean()
        res.json({
            data:getPost,
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