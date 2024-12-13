
import mongoose, { Schema, Document, Model } from 'mongoose';


const Eventos = new Schema({
    EventoNombre: {
      type: String,
      required: true,
      // index: true
    },
    Descripcion: {
        type: String,
        required: true,
        // index: true
      },
      Funcion: {
        type: String,
        required: true,
        // index: true
      },
      Autor: {
        type: String,
        required: true,
        // index: true
      },
    ConsultaPayload: {
        type: String,
        required: true,
        // index: true
      },

      Response: {
        type: String,
        required: true,
        // index: true
      }, 
      ResponseTamaño: {
        type: String,
        required: true,
        // index: true
      }, 
      FechaStart: {
        type: Number,
        required: true,
        // index: true
      },
      FechaEnd: {
        type: Number,
        required: true,
        // index: true
      },   
      TimeSpentSec: {
        type: Number,
        required: true,
        // index: true
      }, 
      Status: {
        type: String,
        required: true,
        // index: true
      },  
      StatusCode: {
        type: Number,
        required: true,
        // index: true
      },  
},{
    timestamps:true,

}
);

export default mongoose.model('Eventos',Eventos)