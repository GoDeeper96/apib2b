import mongoose, { Schema, Document, Model } from 'mongoose';


const esquemaFunciones = new Schema({
    // Usuario: {
    //   type: String,
    //   required: true,
    // },
    IDFuncion: {
        type: Number,
        required: true,
        unique:true
    },
    Funcion: {
        type: String,
        required: true,
        unique:true
    },
    Descripcion: {
        type: String,
        required: false,
    },

    
},
{
    timestamps:true
}
);
export default mongoose.model('Funciones',esquemaFunciones)
// const b2bFuncionesModel: Model<IFunciones> = 
//     mongoose.models['Funciones'] 
//         ? mongoose.model<IFunciones>('Funciones') 
//         : mongoose.model<IFunciones>('Funciones', esquemaFunciones);

// export default b2bFuncionesModel