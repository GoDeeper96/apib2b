import app from "./app.js";
import { connectDb } from "./connections/mongodb.js";


async function main() {
    try {
      
      await connectDb()
      app.listen(4000,()=>{
        console.log("Api b2b Puerto 4000")
        
    })
    } catch (error) {
      console.error(error);
    }
  }

  main();