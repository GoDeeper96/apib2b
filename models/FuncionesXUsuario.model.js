import mongoose, { Schema, Document, Model } from 'mongoose';


const esquemaFuncionesXUsuario  = new Schema({
    Usuario: {
      type: String,
      required: true,
    },
    IDFuncion: {
        type: String,
        required: true,
    },
    Funcion: {
        type: String,
        required: true,
    },

    
},
{
    timestamps:true,
    collection:'Funciones_Usuario'
}
);
export default mongoose.model('Funciones_intermedio_Usuario',esquemaFuncionesXUsuario)