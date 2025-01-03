import mongoose from "mongoose";
export const monitorEventos = async(io) => {
    const db = mongoose.connection;
    // console.log(await db.listCollections())
    db.once('open', () => {
        console.log('Monitoreando cambios en la colección "Eventos"...');
        const colecciones = ['eventos',
            'reportes',
            'notificaciones'
            // 'usuarios'
        ];
        // const collectionStream = db.collection('Eventos').watch();
        colecciones.forEach((coleccion) => {
            const collectionStream = db.collection(coleccion).watch();
            
            collectionStream.on('change', (change) => {
                console.log('Cambio detectado:', change);
                
                if (coleccion === "eventos") {
                    //SOLO VER CAMBIOS DE USUARIOS QUE HE CREADO
                    // const autor = change.fullDocument.Autor
               
                    io.emit("refreshEventos", { message: "Actualizar datos de eventos" 
                        // ,Autor:autor
                    });
                  } else if (coleccion === "reportes") {
                    io.emit("refreshReportes", { message: "Actualizar datos de reportes" 
                        // ,Autor:change.Autor
                    });
                  } else if (coleccion=== "notificaciones")
                  {
                    const autor = change.fullDocument.Usuario
                    io.emit("sendNotificacion",{message:"se envio notificacion al usuario",Data:autor})
                  }
                //   else if (coleccion === "usuarios") {
                //     // const autor = ''
                //     // if(change.operationType==='insert')
                //     // {

                //     // }
                //     // if(change.operationType==='update')
                //     // {

                //     // }
                //     // if(change.operationType==='delete')
                //     // {

                //     // }

                //     io.emit("refreshUsuarios", { message: "Actualizar datos de Usuarios" 
                //         // ,Autor:change.Autor
                //     });
                //   }
                // Notificar a los clientes sobre el cambio
                // io.emit('refreshEventos', { message: 'Actualizar datos de eventos' });
            });
    
            collectionStream.on('error', (error) => {
                console.error('Error en el monitor de cambios:', error);
            });
        })
       
    });

    // db.on('error', (error) => {
    //     console.error('Error en la conexión de MongoDB:', error);
    // });
};