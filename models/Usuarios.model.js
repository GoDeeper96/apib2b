import mongoose, { Schema, Document, Model } from 'mongoose';


//SOLO REQUERIDO USUARIO,CONTRASEÑA,CORREO Y NUMERO
const esquemaUsuarios= new Schema({
    Usuario: {
      type: String,
      required: true,
        unique:true
    },
    Contraseña: {
        type: String,
        required: true,
        default:'',
        select: false,
    },
    Rol: {
        type: String,
        required: false,
        default:'INVITADO',
    },
    Nombre: {
        type: String,
        required: true,
        default:'',
    },
    Correo: {
        type: String,
        required: true,
        default:'',
    },
    Numero: {
        type: String,
        required: true,
        default:'',
    },
    DNI: {
        type: String,
        required: false,
        default:'',
    },
    CodigoFlex: {
        type: String,
        required: false,
        default:'',
    },
    Autor: {
        type: String,
        required: true,
        default:'',
    },
},
{
    timestamps:true
}
);

export default mongoose.model('Usuarios',esquemaUsuarios)