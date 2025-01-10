import {  ClickHouseClient } from "@clickhouse/client";

export const clickhouse = new ClickHouseClient({
  url: 'http://192.168.2.40',       // Cambia por la IP o hostname de tu servidor
  port: 8123,                        // Puerto para TCP
  username: 'default',          // Usuario de ClickHouse
  password: 'svlinux',       // Contraseña de ClickHouse
  database: 'B2BTEST',    // Base de datos predeterminada
//   format: 'json',                    // Formato de salida
});
