const asyncHandler = (fn) =>{
    return (req,res,next)=>{
        // Execute the function . if there's an error .. sent it to 'next'
        fn(req,res,next).catch(next);
    }
}

export default asyncHandler;