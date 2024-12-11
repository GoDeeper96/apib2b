import mongoose from "mongoose";


export const connectDb= async()=>{
    try {
        
        const adqw =await mongoose.connect(`mongodb://127.0.0.1:27017/analytics-b2b?appName=mongosh+2.1.4`)
        // console.log(adqw.models)
        // window.localStorage.setItem("roasts", adqw.models);
        // localStorage.setItem('Tablas',adqw.models)
        console.log('Conexión a MongoDB exitosa')
    } catch (error) {
        console.log(error)
    }
}
