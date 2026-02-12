import app from "./app.js";
import {config} from 'dotenv';
import { connectDB } from "./config/db.js";


config();

const port =process.env.PORT || 3000;

connectDB().then(()=>{
app.listen(port , ()=>{
    console.log(`App is running on : ${port}`);
})
})

    