import { prisma } from "../config/db.js";
import asyncHandler from "../utils/asyncHanler.js";
import AppError from "../utils/AppError.js";

export const addToWatchlist = asyncHandler(async (req,res) => {
   
        let {title , tmdbId , releaseYear , posterUrl , overview , genres , runtime} = req.body;
        const userId = req.user.id;

        let movie = await prisma.movie.findFirst({
            where:{tmdbId:tmdbId}
        })

        if(!movie){
            movie = await prisma.movie.create({
                data:{
                    tmdbId  , title , releaseYear , posterUrl , overview , genres , runtime
                }
            })
        }
        //Checking if the movie exists in the user's watchlist..
       const existingItem = await prisma.watchlistItem.findUnique({
        where:{
            userId_movieId:{
                userId:userId,
                movieId:movie.id
            }
        }
       })
       if (existingItem){
        throw new AppError("This movie already exists in the watchlist!",400);
        
       }

    //    If the movie doesn't exist .. create
    await prisma.watchlistItem.create({
        data:{
            userId: userId ,
            movieId:movie.id ,
            status:"PLANNED" //Default value..
        }
    })
    res.status(201).json({
        status:"Success" ,
        message:"Movie added to the watchlist successfully",
        data:{
            title: movie.title ,
            movieId: movie.id
        }
    })
})

export const updateWatchlist = asyncHandler(async (req,res) => {
    
        const {id} = req.params; 
        const {status , rating , notes} = req.body;
        const userId = req.user.id;

        // Security check .. 
        const existingItem = await prisma.watchlistItem.findUnique({
            where:{id : id}
        })

        // Case 1: movie doesn't exist :
        if(!existingItem){
            throw new AppError("Movie not found in watchlist",404);
            
        }
        // case2: movie exists , but it's another user (Hack attempt) .. "IDOR"
        if(existingItem.userId !== userId){
            throw new AppError("You are not allowed to edit this item",403)
        }

        // Execution if everything is good to go!
        const updateItem = await prisma.watchlistItem.update({
            where:{id:id},
            data:{
                status , rating , notes
            }
        })
        res.status(200).json({status:"Success" , data:updateItem})
   
       
    
})

export const removeFromWatchlist = asyncHandler (async (req,res) => {
   
        const {id} = req.params;
        const userId = req.user.id;

        const existingItem = await prisma.watchlistItem.findUnique({
            where:{id:id}
        })
        if(!existingItem){
            throw new AppError("Movie not found in watchlist" , 404)
        }
        if(existingItem.userId !== userId){
            throw new AppError("You aren't allowed to delete this item",403);
            
        }

        // Execute deletion..
        await prisma.watchlistItem.delete({
            where:{id:id}
        })
        res.status(200).json({message:"Deleted successfully"})
   
        res.status(500).json({message: error.message})
    
})


// Counting pages , movies per page..
export const getWatchlist = asyncHandler(async (req,res) => {
    
        const userId = req.user.id;

    // Query params (to get the pages , limits..)
    // ex: /api/movies?page=2&limit=5
    // The values come as a string , we change it to INT
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit)||10;
    const {search, status} = req.query; 


    const skip = (page -1) * limit;
    // Dynamic filtering (for the current user)
        const whereClause = {
            userId: userId
        }

        // If the user made a search .. we add the search condition
        if(search){
            whereClause.movies = {
                title:{
                    contains: search ,
                    mode:"insensitive" //Ignore if the letters are capital or small
                }
            }
        }
        if(status){
            whereClause.status = status;
        }
    // Fetching data
    const watchlist = await prisma.watchlistItem.findMany({
        where:whereClause, //Just the movies added to a watchlist by this user..
        skip:skip,
        take:limit,
        orderBy:{createdAt: 'desc'}, //Get the newest first
        // Include? yes , bcz watchlistItem only has the ids(numbers) so we tell it to get the movie detail with it
        include:{
            movies:true
        }
    })

    // Count total numbers.. (for the FE developer) to know how many pages
    const totalItem = await prisma.watchlistItem.count({
        where:whereClause
    })
    // ceil --> if it has 1.5 it makes it 1..
    const totalPages = Math.ceil(totalItem/limit)
    res.status(200).json({
        status:"Success",
        pagination:{
            currentPage: page ,
            totalPages:totalPages,
            totalItem:totalItem,
            itemsPerPage: limit
        },
        data:watchlist
    })
  
})