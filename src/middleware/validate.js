export const validate = (schema) =>{
    return (req,res,next)=>{
        const result = schema.safeParse(req.body);
        // console.log(result);
        
        if(!result.success){
            const errorMessages = result.error.issues.map((err)=>err.message);
            return res.status(400).json({
                status:"Fail",
                errors: errorMessages
            })
        }
           req.body = result.data;
           next();

            
        }
    }

// سؤال متوقع : شو الفرق بين .parse() و .safeParse()؟

// parse: إذا البيانات غلط، بيعمل Crash (Throw Error).

// safeParse: هادي ومحترم، بيرجعلك النتيجة وأنت بتتصرف