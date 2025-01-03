import mongoose, { Schema } from 'mongoose';


const esquemaLicencias = new Schema({

    IDLicencia: { //UNICO
        type: String,
        required: true,
    
    },
    Permiso: {
        type: String,
        required: true,
    },

    
},
{
    timestamps:true
}
);
esquemaLicencias.index({ IDLicencia: 1, Permiso: 1 }, { unique: true });
export default mongoose.model('licencias_permisos',esquemaLicencias)