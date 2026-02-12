import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import movieRouter from './routes/movie.routes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import globalErrorHandler from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';

const app = express();

// 1. Middlewares الأساسية
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// 2. أهم خطوة: Health Check (لازم تكون أول راوت في الملف!) 🚨
// ضفنا الرابطين (/) و (/health) عشان شو ما كان إعداد Render يجاوب صح
app.get(['/', '/health'], (req, res) => {
    res.status(200).json({
        status: "Up",
        message: "Server is healthy and running! 🚀"
    });
});

// 3. Rate Limiter
app.use('/api', apiLimiter);

// 4. Routes
const v1Router = express.Router();
v1Router.use("/auth", authRouter);
v1Router.use("/movies", movieRouter);

app.use('/api/v1', v1Router);

// 5. التعامل مع الروابط غير الموجودة (404)
// ملاحظة: هذا الكود بيشتغل بس إذا الرابط مش موجود فوق
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// 6. Global Error Handler
app.use(globalErrorHandler);

export default app;