import mongoose, { Schema } from 'mongoose';


const esquemaGrupos = new Schema({

    NombreGrupo: { //UNICO
        type: String,
        required: true,
        // unique:true
    },
    Usuario: {
        type: String,
        required: false,
    },

    
},
{
    timestamps:true
}
);
esquemaGrupos.index({ Usuario: 1, NombreGrupo: 1 }, { unique: true });
export default mongoose.model('Grupos',esquemaGrupos)