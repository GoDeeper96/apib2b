import mongoose, { Schema, Document, Model } from 'mongoose';


const esquemaNotificaciones = new Schema({
    Usuario: {
      type: String,
      required: true,
    },
    Mensaje: {
        type: String,
        required: true,
    },
    Tipo:{
        type: String,
        required: true,
    }

    
},
{
    timestamps:true
}
);

export default mongoose.model('notificaciones',esquemaNotificaciones)