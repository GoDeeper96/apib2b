
import mongoose, { Schema, Document, Model } from 'mongoose';


// Definir el esquema de ventas
const Queries = new Schema({

    QueryNombre:{
        type: String,
        required: true,
    },
    Usuario:{
        type: String,
        required: true,
    }
},{
    timestamps:true,
    
});
Queries.index({ Usuario: 1, QueryNombre: 1 }, { unique: true });
export default mongoose.model('Queries',Queries)