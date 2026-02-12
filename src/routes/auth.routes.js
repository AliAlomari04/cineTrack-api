import express from 'express';
import { register , login } from '../controllers/authControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { Registration, loginSchema } from '../utils/validationSchemas.js';
const router = express.Router();

router.post('/register' , validate(Registration), register)
router.post('/login', validate(loginSchema), login);
router.get("/me" , protect , (req,res) =>{
    res.status(200).json({
        message:"You're allowed to be in .." ,
        user: req.user
    })
})


export default router;


