import mongoose from "mongoose";

export const dataEsquemCubo = [
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
// Función para generar el esquema dinámico
export const crearEsquemaDinamico = (nombre_tabla,columnas) => {
    const esquema = {};
    console.log(columnas)
    columnas.forEach((columna) => {
      const campo = dataEsquemCubo.find((item) => item.Nombre === columna);
      if (campo) {
        // Convertir tipo de dato a Mongoose
        const tipoMongoose = {
          String: String,
          Number: Number,
          Date: Date,
        }[campo.TipoDato] 
        // || mongoose.Schema.Types.Mixed;
  
        esquema[columna] = { type: tipoMongoose, required: false, index: true };
      }
    });
  
    return new mongoose.Schema(esquema, { timestamps: true });
  };