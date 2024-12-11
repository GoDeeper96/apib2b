import mongoose, { Schema, Document, Model } from 'mongoose';


const esquemaOrganizacion  = new Schema({
    Usuario: {
        type: String,
        required: true,
      },
      Organizacion: {
          type: String,
          required: true,
      },
      Nombre: {
          type: String,
          required: true,
      },
  
    
},
{
    timestamps:true
}
);


export default mongoose.model('Organizaciones',esquemaOrganizacion)