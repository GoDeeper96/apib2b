import app from "./app.js";
import { connectDb } from "./connections/mongodb.js";


async function main() {
    try {
      
      await connectDb()
      app.listen(8084,()=>{
        console.log("Api b2b Puerto 8084")
        
    })
    } catch (error) {
      console.error(error);
    }
  }

  main();