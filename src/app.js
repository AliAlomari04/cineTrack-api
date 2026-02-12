import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js';
import movieRouter from './routes/movie.routes.js'
import { apiLimiter } from './middleware/rateLimiter.js';
import globalErrorHandler from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';
const app = express();

// Middlewares
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(express.json());


    // Api routes
    app.use('/api', apiLimiter)

// Routes versioning
    const v1Router = express.Router();
    v1Router.use("/auth", authRouter)
    v1Router.use("/movies",movieRouter)

app.use('/api/v1',v1Router)

// Dealing with unexisting routes:
app.all(/(.*)/ , (req,res,next) =>{
    next(new AppError(`Can't find ${req.originalUrl} on the server!`,404))
})
app.get('/health' , (req,res)=>{
    res.status(200).json({
        status:"Up" ,
        message: "Server is healthy !"
    })
    
})
app.use(globalErrorHandler)
export default app;