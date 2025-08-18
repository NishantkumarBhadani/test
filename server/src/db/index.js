import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB=async()=>{
    try{
        const connctionInstan=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDb connected || DB HOST : ${connctionInstan.connection.host}`);
        
    } catch(error){
        console.log("Database connection failed",error);
        process.exit(1); 
    }
}
export default connectDB;