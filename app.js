import express from 'express'
import cors from 'cors'
import Auth from './routes/authroute.js'
import Calc from './routes/calcCubo.js'
import Users from './routes/Usuario.js'
import Reporte from './routes/reportes.route.js'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import { Classic } from './utilities/CreatingUser.js'
const app = express();

app.use(cors());
app.options('*', cors())
// app.use(express.json()); // Este middleware parsea las solicitudes JSON
// app.use(express.urlencoded({ extended: true })); // Para datos codificados como formularios
app.use(bodyParser.json({limit:'200000mb'}));
app.use(bodyParser.urlencoded({extended: true,limit:'200000mb'}));

app.use(morgan('dev'))
app.use(Auth)
app.use(Calc)
app.use(Users)
app.use(Reporte)

export default app