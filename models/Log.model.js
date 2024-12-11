import mongoose, { Schema, Document, Model } from 'mongoose';


const esquemaLogs = new Schema({
    Usuario: {
      type: String,
      required: true,
    },
    Accion: {
        type: String,
        required: true,
   
    },
    Mensaje: {
        type: String,
        required: true,
    },

    
},
{
    timestamps:true
}
);
export default mongoose.model('Logs',esquemaLogs)
// const b2bLogModel: Model<ILogs> = 
//     mongoose.models['LogUsuarios'] 
//         ? mongoose.model<ILogs>('LogUsuarios') 
//         : mongoose.model<ILogs>('LogUsuarios', esquemaLogs);

// export default b2bLogModel