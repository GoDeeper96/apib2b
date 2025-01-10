import {  createClient } from "@clickhouse/client";

export const clickhouse = createClient({
  url: 'http://localhost:8123',       // Cambia por la IP o hostname de tu servidor              // Puerto para TCP
  username: 'default',          // Usuario de ClickHouse
  password: 'svlinux',       // Contraseña de ClickHouse
  database: 'B2BTEST',    // Base de datos predeterminada
//   format: 'json',                    // Formato de salida
});
