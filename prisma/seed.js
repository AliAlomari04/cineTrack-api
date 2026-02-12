import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// movie data (from tmdb)
const moviesData = [
    { tmdbId: "27205", title: "Inception", releaseYear: 2010, posterUrl: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
    { tmdbId: "157336", title: "Interstellar", releaseYear: 2014, posterUrl: "/gEU2QniL6E77NI6lCU6MxlNBvIx.jpg" },
    { tmdbId: "155", title: "The Dark Knight", releaseYear: 2008, posterUrl: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    { tmdbId: "19995", title: "Avatar", releaseYear: 2009, posterUrl: "/6EiRUJz5kjez5givVNNCwhquy0.jpg" },
    { tmdbId: "299536", title: "Avengers: Infinity War", releaseYear: 2018, posterUrl: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg" },
    { tmdbId: "299534", title: "Avengers: Endgame", releaseYear: 2019, posterUrl: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
    { tmdbId: "671", title: "Harry Potter and the Philosopher's Stone", releaseYear: 2001, posterUrl: "/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg" },
    { tmdbId: "120", title: "The Lord of the Rings: The Fellowship of the Ring", releaseYear: 2001, posterUrl: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg" },
    { tmdbId: "680", title: "Pulp Fiction", releaseYear: 1994, posterUrl: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" },
    { tmdbId: "13", title: "Forrest Gump", releaseYear: 1994, posterUrl: "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg" }
];

async function main() {
    console.log("Start seeding ..");
    
    // 1st: cleaning the DB
    await prisma.watchlistItem.deleteMany()
    await prisma.movie.deleteMany()
    await prisma.user.deleteMany()

    console.log("DB cleaned ..");
    
    // 2nd: Create a user
    const hashedPassword = await bcrypt.hash("password123",10)
    const user = await prisma.user.create({
        data:{
            name:"Test user" ,
            email:"test@seed.com",
            password: hashedPassword
        }
    })
    console.log(`Created user : ${user.email}`);

    // 3rd: Adding movies , connect them to the user..
    for (const movie of moviesData){
        // A: adding the movies to movie db
        const createdMovie = await prisma.movie.create({
            data:{
                tmdbId: movie.tmdbId ,
                title: movie.title ,
                releaseYear: movie.releaseYear,
                posterUrl: movie.posterUrl ,
                overview: "This is a seeded movie description .." ,
                genres:["Action" , "Drama"],
                runtime: 120
            }
        })
        // B: Adding it to the user's watchlist..
        await prisma.watchlistItem.create({
            data:{
                userId: user.id ,
                movieId: createdMovie.id ,
                status:"PLANNED",
                rating: 0
            }
        })
    }
    console.log(`✅Seeded ${moviesData.length} movies for the user.`);
    console.log(`Seeding finished ..`);
    
  
    
}
  main().catch((e)=>{
        console.error(e);
        process.exit(1)
    }).finally(async () => {
        await prisma.$disconnect();
    })