import { InitClientRedisOther } from "../../connections/redis.js";
import B2bModeloModel from "../../models/B2bModelo.model.js";
import { getPivotDataSource, runDynamicQuery6_actual } from "../../utilities/Helpers.js";

export const Calculo = async(req,res)=>{
    const { Filas,Columnas,Filtros,Valores,PanelFiltros } = req.body
    try {

        const query = {
          rows: Filas,
          columns: Columnas,
          values: Valores,
          filters: Filtros
      };
        const sd = await InitClientRedisOther().connect()
        console.log(JSON.stringify(query))
        const dataRedisExisteConQuery = await sd.v4.GET(`${JSON.stringify(query)}`)
        // console.log(dataRedisExisteConQuery)
        if(!dataRedisExisteConQuery)
        {
            // console.log(formattedData)
            
            // console.log(query)
            // console.log(JSON.stringify(query))
            const Pipelina = runDynamicQuery6_actual(query)
            
            // console.log(JSON.stringify(Pipelina))
            // console.log(Pipelina)
            // console.log(Pipelina[0])
            // const test = await b2bventas2Model.find({}).limit(10)
            // console.log(test)
            const FiltracionMaxima = await B2bModeloModel.aggregate(Pipelina)
            // console.log(FiltracionMaxima)
            if(FiltracionMaxima.length!==0)
            {
              
              await sd.set(`${JSON.stringify(query)}`,JSON.stringify(FiltracionMaxima))
            }
            console.time('TIEMPOCALCULO')
            const pivotDataSource = getPivotDataSource(query,FiltracionMaxima)
            // console.log(FiltracionMaxima)
            console.timeEnd('TIEMPOCALCULO')
            res.status(200).json({
                pivotDataSource:{...pivotDataSource,PanelFiltros},
                pipeline:Pipelina
            })
        }
        else{
          const pivotDataSource = getPivotDataSource(query,JSON.parse(dataRedisExisteConQuery))
          res.status(200).json(
            {
            pivotDataSource:{...pivotDataSource,PanelFiltros},
            pipeline:{}
            }
        )
        }
    
   

        } catch (error) {
            console.log(error)

            res.status(500).json({message:'Error'})   
        }
}
export const GetDataCol = async(req,res)=>{
    const { Columna } = req.body
    // console.log(Columna)
    // Respuesta para solicitudes GET
    try {
        const pool = await InitClientRedisOther().connect()
        const datita = await pool.v4.GET(Columna)
        const daton = JSON.parse(datita)
        res.status(200).json(daton);
    } catch (error) {
        console.log(error)
    
            res.status(500).json({message:'Error'})   
    }
}