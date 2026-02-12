import app from "./app.js";
import {config} from 'dotenv';
import { connectDB } from "./config/db.js";


config();

const port =process.env.PORT || 5000;

app.listen(port, '0.0.0.0' , ()=>{
    console.log(`App is running on : ${port}`);
})

// connectDB().then(()=>{
//     console.log("DB connected successfully");
    
// }).catch((err)=>{
//     console.log("Failed to connect ", err);
    
// })

    