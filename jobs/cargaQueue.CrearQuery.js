import Queue from 'bull';
import axios from 'axios';
import moment from 'moment';
import EventosModel from '../models/Eventos.model.js';
import NotificacionesModel from '../models/Notificaciones.model.js';

// Configura la cola
export const cargaQueue = new Queue('cargaQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

// Procesar las tareas de la cola
cargaQueue.process(async (job) => {
  const { FormData, nuevoPostId } = job.data;

  try {
    // Realiza la carga pesada
    const queryJson = JSON.stringify(FormData.queryTable);
    const columnas = FormData.columnas;
    const InsertarData = await axios.post('http://170.231.81.173:5000/b2b/cargab2b', {
      filter: queryJson,
      nombre_tabla: FormData.nombre_tabla,
      columnas,
    });

    // Actualizar el evento con estado "DONE"
    const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
    const TimeSpentSec = moment(FechaEnd).diff(moment(FormData.FechaStart), 'seconds');
    await EventosModel.findByIdAndUpdate(nuevoPostId, {
      Response: JSON.stringify(InsertarData.data),
      ResponseTamaño: JSON.stringify(InsertarData.data).length,
      FechaEnd,
      TimeSpentSec,
      Status: 'DONE',
      StatusCode: 200,
    });

    // Crear notificación para el usuario
    const sendNotificacion = new NotificacionesModel({
      Usuario: FormData.Autor,
      Mensaje: 'El nuevo query ha sido creado correctamente',
      Tipo: 'Carga',
    });
    await sendNotificacion.save();

    return InsertarData.data; // Retorna los datos procesados
  } catch (error) {
    // Manejo de errores
    const FechaEnd = moment().format('YYYY-MM-DD HH:mm:ss');
    const TimeSpentSec = moment(FechaEnd).diff(moment(FormData.FechaStart), 'seconds');
    await EventosModel.findByIdAndUpdate(nuevoPostId, {
      Response: JSON.stringify(error.message),
      ResponseTamaño: JSON.stringify(error.message).length,
      FechaEnd,
      TimeSpentSec,
      Status: 'ERROR',
      StatusCode: 500,
    });

    throw new Error(error.message);
  }
});