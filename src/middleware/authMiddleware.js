import jwt from 'jsonwebtoken'
import {prisma} from '../config/db.js'
import asyncHandler from '../utils/asyncHanler.js';
import AppError from '../utils/AppError.js';
export const protect =asyncHandler(async (req,res,next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }else if(req.cookies?.jwt){
        token = req.cookies.jwt
    }
    if(!token){
        throw new AppError("Not authorized ! No  token provided..");
        
    }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where:{id : decoded.id},
            select:{
                id:true ,
                name:true ,
                email:true
            }
        })

        if(!user){
            throw new AppError("User not found !");
            
        }

        req.user = user;
        next();
   
})