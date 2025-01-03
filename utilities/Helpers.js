import QueriesModel from "../models/Queries.model.js";
import QueryXUsuarioModel from "../models/QueryXUsuario.model.js";
import TestModel from "../models/Test.model.js";
import UsuariosModel from "../models/Usuarios.model.js";
const dataEsquemCubo = [
  { Nombre: 'Periodo', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'CodSupervisor', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'NroDocSupervisor', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'VendedorCodigo', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'ValorVenta', TipoDato: 'Number' ,Color:'#2ecc71',tabla:'CuboProyeccion'},
  { Nombre: 'CantidadUnitaria', TipoDato: 'Number' ,Color:'#2ecc71',tabla:'CuboProyeccion'},
  { Nombre: 'NomVen', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'Sucursal', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'Nombre', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'ClienteCodigo', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'FuerzaVentas', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'ProductoDescripcion', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'Fecha', TipoDato: 'Date' ,Color:'#cea302' ,tabla:'CuboProyeccion'},
  { Nombre: 'Marca', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'Proveedor', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'GrupoVentas', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'IDCaracteristica4', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'SubProveedor', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'ProductoCodigo', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'EsBonificacion', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'linea', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'PKIDProveedor', TipoDato: 'Number',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'Pedido', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'Canal', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'Distrito', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'EAN13', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'CodigoFabrica', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'JefeVentas', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'FactorConversion', TipoDato: 'Number',Color:'#2ecc71',tabla:'CuboProyeccion' },
  { Nombre: 'Cajas', TipoDato: 'Number' ,Color:'#2ecc71',tabla:'CuboProyeccion'},
  { Nombre: 'Anio', TipoDato: 'Number' ,Color:'#2ecc71',tabla:'CuboProyeccion'},
  { Nombre: 'Mes', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'BloqueNegocio', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'Bloque', TipoDato: 'String' ,Color:'#5d6d7e',tabla:'CuboProyeccion'},
  { Nombre: 'Zona', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'EstadoCliente', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'GiroCliente', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'ClienteNombre', TipoDato: 'String',Color:'#5d6d7e',tabla:'CuboProyeccion' },
  { Nombre: 'TipoVentas', TipoDato: 'String',Color:'#5d6d7e' ,tabla:'CuboProyeccion'},
  { Nombre: 'Factor', TipoDato: 'Number',Color:'#2ecc71' ,tabla:'CuboProyeccion'},
  { Nombre: 'NumPedido', TipoDato: 'Number',Color:'#2ecc71',tabla:'CuboProyeccion' },
];
export const getOperationType = (operation) => {
    switch (operation.toUpperCase()) {
      // case 'COUNT':
      //   return 'Count';
      case 'SUM':
        return 'Sum';
      // case 'AVG':
      //   return 'Average';
      // Puedes agregar más casos según sea necesario para otras operaciones
      default:
        return 'Sum'; // Por defecto, asumimos Sum
    }
  };
export const actualizarAdmin = async()=>{
  const updated = await UsuariosModel.findOneAndUpdate({Usuario:'SuperAdmin'},{Autor:'SuperAdmin'})
}
function transformQuery(originalQuery) {
    // Creamos un nuevo array con las condiciones para $and
    // const transformedQuery = {
    //   $match: {
    //     $and: Object.entries(originalQuery).map(([key, value]) => ({
    //       [key]: value
    //     }))
    //   }
    // };
  // Creamos un nuevo objeto para las condiciones de $match
    const transformedQuery = {
        $match: {}
    };

    // Recorremos las claves del originalQuery
    for (const [key, value] of Object.entries(originalQuery)) {
        // Verificamos si la clave es 'Fecha' y el valor es un objeto con '$gte' o '$lte'
        if (key === 'Fecha' && typeof value === 'object' && (value['$gte'] || value['$lte'])) {
            // Convertimos a Date si hay condiciones de fecha
            transformedQuery.$match[key] = {
                '$gte': new Date(value['$gte']),
                '$lte': new Date(value['$lte'])
            };
        } else {
            // Mantenemos el valor original si no es 'Fecha'
            transformedQuery.$match[key] = value;
        }
    }
    return transformedQuery;
  }
export const getPivotDataSource = (configuracionOriginal,data) => {
    const rows = configuracionOriginal.rows.map(row => ({
      name: row,
      caption: row
    }));
  
    const columns = configuracionOriginal.columns.map(column => ({
      name: column,
      caption: column
    }));
    return {
      dataSource:data,
      rows: rows || [],
      columns: columns || [],
      values: Object.keys(configuracionOriginal.values).map(key => ({
        name: key,
        caption: key,
        type: getOperationType(configuracionOriginal.values[key].operation),
        axis: 'value'
      })),
      filters:  []
    };
  };
export function runDynamicQuery6_actual(query) {
    // Construir la etapa $match para los filtros
    let matchCondition = {};
    if (query.filters && query.filters.length > 0) {
      matchCondition = transformQuery(query.filters);
    }
    const matchStage = transformQuery(query.filters);
  
    // Construir la etapa $group para las filas, columnas y valores
    const groupFields = {};
    query.rows.forEach(row => groupFields[row] = `$${row}`);
    query.columns.forEach(column => groupFields[column] = `$${column}`);
  
    const groupValues = {};
    let requiresPercentageCalculation = false;
    let percentageKey = null;
  
    // Revisar las operaciones en query.values
    Object.entries(query.values).forEach(([key, value]) => {
      if (value.operation === 'SUM') {
        groupValues[key] = { $sum: `$${key}` };
      } else if (value.operation === 'COUNT') {
        groupValues[key] = { $addToSet: `$${key}` };
      } else if (value.operation === 'MIN') {
        groupValues[key] = { $min: `$${key}` };
      } else if (value.operation === 'MAX') {
        groupValues[key] = { $max: `$${key}` };
      } else if (value.operation === 'AVG') {
        groupValues[key] = { $avg: `$${key}` };
      } else if (value.operation === 'PERCENTAGE') {
        requiresPercentageCalculation = true;
        percentageKey = key;
        groupValues[key] = { $sum: `$${key}` }; // Temporal para el cálculo de porcentaje después
      } else {
        throw new Error(`Operación no soportada: ${value.operation}`);
      }
    });
  
    const groupStage = {
      $group: {
        _id: groupFields,
        ...groupValues
      }
    };
  
    // Condicional para agregar el cálculo de porcentaje solo si es necesario
    const pipeline = [matchStage, groupStage];
  
    if (requiresPercentageCalculation && percentageKey) {
      // Si se necesita el cálculo de porcentaje, agregamos las etapas adicionales
      const percentageGroupStage = {
        $group: {
          _id: null,
          totalPercentageField: { $sum: `$${percentageKey}` },
          data: { $push: "$$ROOT" }
        }
      };
  
      const unwindStage = { $unwind: "$data" };
  
      // Construir la etapa de proyección para el cálculo de porcentaje
      const projectFields = {
        _id: 0,
        ...groupFields,
      };
  
      Object.keys(query.values).forEach(key => {
        const operation = query.values[key].operation;
        if (operation === 'COUNT') {
          projectFields[key] = { $size: `$data.${key}` };
        } else if (operation === 'PERCENTAGE' && key === percentageKey) {
          projectFields[key] = {
            $multiply: [
              { $divide: [`$data.${key}`, "$totalPercentageField"] },
              100
            ]
          };
        } else {
          projectFields[key] = `$data.${key}`;
        }
      });
  
      // Agregar las filas y columnas al proyecto
      query.rows.forEach(row => projectFields[row] = `$data._id.${row}`);
      query.columns.forEach(column => projectFields[column] = `$data._id.${column}`);
  
      const projectStage = { $project: projectFields };
  
      pipeline.push(percentageGroupStage, unwindStage, projectStage);
    } else {
      // Construir la etapa de proyección estándar si no hay cálculo de porcentaje
      const projectFields = {
        _id: 0,
        ...groupFields,
      };
  
      Object.keys(query.values).forEach(key => {
        const operation = query.values[key].operation;
        projectFields[key] = operation === 'COUNT'
          ? { $size: `$${key}` }
          : `$${key}`;
      });
  
      // Agregar las filas y columnas al proyecto
      query.rows.forEach(row => projectFields[row] = `$_id.${row}`);
      query.columns.forEach(column => projectFields[column] = `$_id.${column}`);
  
      const projectStage = { $project: projectFields };
      pipeline.push(projectStage);
    }
  
    return pipeline;
  }
export const AddTest = async()=>{
    const data = new TestModel({
      Test:'hola'
    })
    await data.save()
}
export const AddFirstQuery = async()=>{
  const primerb2bquery = new QueriesModel({
    Nombre:'1234',
    QueryJson:'tabla_origen',
    Descripcion:'Tabla origen inicial',
    Dinamico:true,
    Autor:'SuperAdmin',
    Columnas:JSON.stringify(dataEsquemCubo)
  })
  primerb2bquery.save()
  const primerqueryUsuario = new QueryXUsuarioModel({
    IDQuery:'676327c85935466faf60eeee',
    Usuario:'SuperAdmin'
  })
  await primerqueryUsuario.save()
}