import mongoose, { Schema } from 'mongoose';


const esquemaLicenciasXUsuarios = new Schema({

    IDLicencia: { //UNICO
        type: String,
        required: true,
    
    },
    Usuario: {
        type: String,
        required: true,
    },

    
},
{
    timestamps:true
}
);
esquemaLicenciasXUsuarios.index({ IDLicencia: 1, Usuario: 1 }, { unique: true });
export default mongoose.model('usuarios_licencias',esquemaLicenciasXUsuarios)