import mongoose, { Schema } from 'mongoose';


const esquemaGrupos = new Schema({

    Nombre: {
        type: String,
        required: true,
        unique:true
    },
    Descripcion: {
        type: String,
        required: false,
    },
    Autor: {
        type: String,
        required: true,
    },
    
},
{
    timestamps:true
}
);
export default mongoose.model('Grupos',esquemaGrupos)