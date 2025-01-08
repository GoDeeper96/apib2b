
import mongoose, { Schema, Document, Model } from 'mongoose';


// Definir el esquema de ventas
const esquemaQueries = new Schema({

    Nombre:{
        type: String,
        required: true,
        unique:true
    },
    QueryJson:{
        type: String,
        required: true,

        // index: true,
    },
    QueryTabla:{
        type: String,
        required: true,

        // index: true,
    },
    TablaOrigen:{
        type: String,
        required: false,

        // index: true,
    },
    Descripcion:{
        type: String,
        required: false,
 
        // index: true,
    },
    Dinamico:{
        type: Boolean,
        required: true,
 
        // index: true,
    },
    // Editable:{
    //     type: Boolean,
    //     required: true,
 
    //     // index: true,
    // },
    Autor:{
        type: String,
        required: true,
 
        // index: true,
    },
    Columnas:{
        type: String,
        required: true,
 
        // index: true,
    },
},{
    timestamps:true,
    
});

export default mongoose.model('filtroqueries',esquemaQueries)