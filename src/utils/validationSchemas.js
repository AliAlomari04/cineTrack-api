import {z} from 'zod'

export const Registration = z.object({
    name: z.string().nonempty().min(3 , {message:"Name must be at least 3 chars .."}),
    email: z.string().email({message:"example@gmail.com"}),
    password: z.string().min(8,{message:"At least 8 chars!"}).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,{message:"Must contain chars and letters!"})
});

export const loginSchema = z.object({
    email: z.string().email() ,
    password: z.string().min(1,{message:"Password is required!"})
})

export const addToWatchListSchema = z.object({
    tmdbId: z.string({required_error:"Movie number is required!"}),
    title: z.string({required_error:"Title of the movie is required!"}).min(1),
    releaseYear: z.number().int(),

    // Optional fields..
    posterUrl: z.string().optional() ,
    overview: z.string().optional(),
    genres: z.array(z.string()).optional(),
    runtime: z.number().optional()

})