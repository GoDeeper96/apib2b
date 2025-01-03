import mongoose, { Schema } from 'mongoose';


const esquemaLicencias = new Schema({

    Nombre: { //UNICO
        type: String,
        required: true,
        unique:true
    },
    FechaEmpiezo: {
        type: Date,
        required: true,
    },
    FechaExpiracion: {
        type: Date,
        required: true,
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

export default mongoose.model('Licencias',esquemaLicencias)