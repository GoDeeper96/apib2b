
import mongoose, { Schema, Document, Model } from 'mongoose';


// Definir el esquema de ventas
const Queries = new Schema({

    IDQuery:{
        type: String,
        required: true,
    },
    Usuario:{
        type: String,
        required: true,
    },
    Permisos:{
        type: Array,
        required: true,
    },
},{
    timestamps:true,
    
});
Queries.index({ Usuario: 1, IDQuery: 1 }, { unique: true });
export default mongoose.model('usuarios_queries',Queries)