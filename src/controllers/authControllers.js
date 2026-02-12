import { prisma } from "../config/db.js";
import bcrypt from 'bcrypt'
import { createToken } from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHanler.js";
import AppError from "../utils/AppError.js";

export const register = asyncHandler (async(req,res,next) => {
    
        let {name  , email , password} = req.body;
        if(!name || !email || !password){
            throw new AppError("All fields are required" , 400);
            
        }
    email = email.toLowerCase().trim();
    // Password strength check..
    if (password.length < 8 || !/\d/.test(password)){
       throw new AppError("Password must be at least 8 chars , containing a number" , 400)
    }
    
    const userExists = await prisma.user.findUnique({
        where: {email : email},
    });
    if (userExists){
       throw new AppError("User already exists" , 400);
       
    }

    const salted = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password , salted);

    const user = await prisma.user.create({
        data:{
            name , email , password:hashedPassword
        }
    })
    const token = createToken(user.id , res);
    res.status(200).json({
        status:"success",
        data:{
            user:{
                id:user.id,
                name: name , 
                email: email
            },
            token
        }
    })
})

export const login= asyncHandler (async (req,res) => {
    
         let {email , password} = req.body;

         if(!email || !password){
            throw new AppError("Please provide email and password",400);
            
         }
         email = email.toLowerCase().trim();

    const user= await prisma.user.findUnique({
        where:{email: email}
    })

        const isPasswordCorrect = user && await bcrypt.compare(password , user.password);
    if (!user || !isPasswordCorrect){
       throw new AppError("Invalid email or password" , 401)
    }

   //Success
    const token = createToken(user.id , res);

    res.status(200).json({
        status:"Success",

        data:{
            user:{id: user.id ,
                name:user.name ,
                email:user.email
            },token
        }
    })
        
   
   
})