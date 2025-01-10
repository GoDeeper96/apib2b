import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import { monitorEventos } from "../utilities/trackEvents.js";
// Configuración de Socket.IO (puedes integrarlo según tu servidor existente)
// const io = new Server(3000, {
//     cors: {
//         origin: '*', // Cambiar por la URL de tu frontend en producción
//         methods: ['GET', 'POST']
//     }
// });
// Inicializar Socket.IO
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*', // Ajustar según el dominio de tu frontend
            methods: ['GET', 'POST']
        }
    });



    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    return io;
};

export const connectDb= async(io)=>{
    try {
        
        const adqw = mongoose.connect(`mongodb://127.0.0.1:27017/b2bmirko?appName=mongosh+2.1.4`)
        // console.log(adqw.models)
        monitorEventos(io)
        // window.localStorage.setItem("roasts", adqw.models);
        // localStorage.setItem('Tablas',adqw.models)
        console.log('Conexión a MongoDB exitosa')
    } catch (error) {
        console.log(error)
    }
}
