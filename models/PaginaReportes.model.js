
import mongoose, { Schema, Document, Model } from 'mongoose';


// Definir el esquema de ventas
const PaginaReportes = new Schema({
    // IDReporte: {
    //     type: String,
    //     required: true,
    //     // index: true,
    // },
    PKIDReporte:{
        type: String,
        required: true,
    },
    Nombre:{
        type: String,
        required: true,

        // index: true,
    },
    Descripcion:{
        type: String,
        required: true,
 
        // index: true,
    },
    ReporteData:{
        type: String,
        required: true,
        // index: true,
    },
},{
    timestamps:true,
    
});
PaginaReportes.index({ PKIDReporte: 1, Nombre: 1 }, { unique: true });
export default mongoose.model('PaginaReportes',PaginaReportes)