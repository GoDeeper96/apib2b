
import mongoose, { Schema, Document, Model } from 'mongoose';


// Definir el esquema de ventas
const Queries = new Schema({

    QueryNombre:{
        type: String,
        required: true,
        unique:true
    },
    QueryString:{
        type: String,
        required: true,

        // index: true,
    },
    QueryTabla:{
        type: String,
        required: true,
 
        // index: true,
    },
    Autor:{
        type: String,
        required: true,
 
        // index: true,
    },
},{
    timestamps:true,
    
});

export default mongoose.model('Queries',Queries)