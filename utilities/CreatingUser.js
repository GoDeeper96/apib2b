import bcrypt from 'bcrypt'
import UsuariosModel from '../models/Usuarios.model.js'

const Data = [
    {
        Usuario:'UsuarioPrueba1',
        Contraseña:'Up1Cubbo2024',
        Rol:'Invitado',
        Nombre:'UsPrueba1',
        Correo:'usprueba1@hotmail.com',
        Numero:'979895949',
        DNI:'99897492',
        CodigoFlex:'12345678',
        Autor:'674603156a53e877f0c4f6c0'
    },
    {
        Usuario:'UsuarioPrueba2',
        Contraseña:'Up2Cubbo2024',
        Rol:'Invitado',
        Nombre:'UsPrueba2',
        Correo:'usprueba2@hotmail.com',
        Numero:'979895949',
        DNI:'99897492',
        CodigoFlex:'12345678',
            Autor:'674603156a53e877f0c4f6c0'
    },
    {
        Usuario:'UsuarioPrueba3',
        Contraseña:'Up3Cubbo2024',
        Rol:'Invitado',
        Nombre:'UsPrueba3',
        Correo:'usprueba3@hotmail.com',
        Numero:'979895949',
        DNI:'99897492',
        CodigoFlex:'12345678',
            Autor:'674603156a53e877f0c4f6c0'
    },
]
export const Classic = async()=>{

    for (let index = 0; index < Data.length; index++) {
        const hashedPassword=await bcrypt.hash(Data[index].Contraseña,12)
        const newUser = new UsuariosModel({...Data[index],Contraseña:hashedPassword})
        
        await newUser.save()
        
    }
   
}