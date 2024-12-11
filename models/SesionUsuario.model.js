import mongoose, { Schema, Document, Model } from 'mongoose';


const esquemaSesionToken  = new Schema({
    Usuario: {
        type: String,
        required: true,
      },
      SesionesActivas: {
          type: Number,
          required: true,
      },
      Token: {
        type: String,
        required: false,
    },

},
{
    collection:'usuariosesiones',
    timestamps:true
}
);

export default mongoose.model('SesionUs',esquemaSesionToken)