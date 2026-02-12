import app from "./app.js";
import {config} from 'dotenv';
import { connectDB } from "./config/db.js";


config();

const port =process.env.PORT || 5000;

connectDB().then(()=>{
app.listen(port, '0.0.0.0' , ()=>{
    console.log(`App is running on : ${port}`);
})
}).catch((err)=>{
    console.log("Failed to connect ", err);
    
})

    