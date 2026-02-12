import reateLimit, { rateLimit } from 'express-rate-limit'

// API's police officer
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000 , //15 min
    max:100, // Maximimum limit for requests

    message:{
        status:"fail",
        message:"You reached your limit for requests.."
    } ,
    standardHeaders:true, //Returns the limit in headers (Good for FE)
    legacyHeaders:false
})