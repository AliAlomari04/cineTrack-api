import express from 'express';
import { addToWatchListSchema } from '../utils/validationSchemas.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { addToWatchlist, getWatchlist, removeFromWatchlist, updateWatchlist } from '../controllers/movieControllers.js';

const router = express.Router();

router.post('/',protect,validate(addToWatchListSchema),addToWatchlist)
router.patch('/:id' , protect , updateWatchlist)
router.delete('/:id' , protect , removeFromWatchlist)
router.get('/' , protect , getWatchlist)

export default router;