import mongoose, { Schema, Document, Model } from 'mongoose';


//SOLO REQUERIDO USUARIO,CONTRASEÑA,CORREO Y NUMERO
const FiltroUsuarios= new Schema({
    PkidUsuario: {
      type: String,
      required: true,
        
    },
   
},
{
    timestamps:true
}
);

export default mongoose.model('Filtro_Usuarios',FiltroUsuarios)