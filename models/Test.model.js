import mongoose, { Schema, Document, Model } from 'mongoose';


//SOLO REQUERIDO USUARIO,CONTRASEÑA,CORREO Y NUMERO
const esquemaTest= new Schema({
    Test: {
      type: String,
      required: true,

    },
},
{
    collection:'test',
    timestamps:true
}
);

export default mongoose.model('Usuario2s',esquemaTest)