
import mongoose, { Schema, Document, Model } from 'mongoose';


// Definir el esquema de ventas
const esquemaReportes = new Schema({
    Nombre:{
        type: String,
        required: true,
        // unique:true
        // index: true,
    },
    Favorito:{
        type: Boolean,
        required: true,
        // index: true,
    },
    Editable:{
        type: Boolean,
        required: true,
        // index: true,
    },
    DinamicoEstatico:{
        type: Boolean,
        required: true,
        // index: true,
    },
    RutaImagenReporte:{
        type: String,
        required: false,
        // index: true,
    },
    Descripcion:{
        type: String,
        required: false,
        // index: true,
    },
    Autor:{
        type: String,
        required: true,
        // index: true,
    },
},{
    timestamps:true,
    // collection:'reportes'
});
export default mongoose.model('reportes',esquemaReportes)