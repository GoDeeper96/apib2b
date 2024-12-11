
import mongoose, { Schema, Document, Model } from 'mongoose';


// Definir el esquema de ventas
const esquemaReportes = new Schema({
    Usuario: {
        type: String,
        required: true,
        
        // index: true,
    },
    PKIDReporte:{
        type: String,
        required: true,
    }
},{
    timestamps:true,
    collection:'usuarioreportes'
});
esquemaReportes.index({ Usuario: 1, PKIDReporte: 1 }, { unique: true });
export default mongoose.model('Reportes_intermedio_Usuario',esquemaReportes)