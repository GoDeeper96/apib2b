import app from "./app.js";
import { connectDb, initializeSocket } from "./connections/mongodb.js";
import http from "http";

async function main() {
    try {
      const server = http.createServer(app); // Crear un servidor HTTP con Express
      const io = initializeSocket(server);
      await connectDb(io)
      server.listen(4000,()=>{
        // console.log(server)
        console.log("Api b2b Puerto 8084")
        
    })
    } catch (error) {
      console.error(error);
    }
  }

  main();