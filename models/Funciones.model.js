import mongoose, { Schema, Document, Model } from 'mongoose';


const esquemaFunciones = new Schema({

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