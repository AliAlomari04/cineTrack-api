const globalErrorHandler = (err,req,res,next)=>{
    // Default values if the err isn't specified
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        res.status(err.statusCode).json({
            status: err.status ,
            error: err ,
            message: err.message ,
            stack: err.stack //The err path
        })
    }
    else{
        res.status(err.statusCode).json({
            status:err.status ,
            message:err.message
        })
    }
}

export default globalErrorHandler;