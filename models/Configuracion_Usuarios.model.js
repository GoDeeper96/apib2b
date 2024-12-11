
import mongoose, { Schema, Document, Model } from 'mongoose';


const ConfigUsuario = new Schema({
    IDUsuario: {
      type: String,
      required: true,
      // index: true
    },
    

}
);

export default mongoose.model('ConfiguracionUsuario',ConfigUsuario)