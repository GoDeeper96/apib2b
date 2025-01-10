import express from 'express'
import cors from 'cors'
import Auth from './routes/authroute.js'
import Calc from './routes/calcCubo.js'
import Users from './routes/Usuario.js'
import Reporte from './routes/reportes.route.js'
import Eventos from './routes/Eventroute.js'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import LicenciasRoutes from './routes/Licencias.route.js'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter.js'
import { ExpressAdapter } from '@bull-board/express'
import { Classic } from './utilities/CreatingUser.js'
import { actualizarAdmin, AddFirstQuery, AddTest } from './utilities/Helpers.js'
import { cargaQueue } from './jobs/cargaQueue.CrearQuery.js'
import { createClient } from '@clickhouse/client'
const app = express();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues'); // Ruta base para acceder al tablero

createBullBoard({
  queues: [new BullAdapter(cargaQueue)], // Agrega más colas si es necesario
  serverAdapter,
});

// Monta la interfaz de Bull Board en tu servidor
app.use('/admin/queues', serverAdapter.getRouter());
app.use(cors());
app.options('*', cors())
// app.use(express.json()); // Este middleware parsea las solicitudes JSON
// app.use(express.urlencoded({ extended: true })); // Para datos codificados como formularios
app.use(bodyParser.json({limit:'200000mb'}));
app.use(bodyParser.urlencoded({extended: true,limit:'200000mb'}));
// AddFirstQuery()
app.use(morgan('dev'))
app.use(Auth)
app.use(Calc)
app.use(LicenciasRoutes)
app.use(Eventos)
app.use(Users)
app.use(Reporte)

export default app