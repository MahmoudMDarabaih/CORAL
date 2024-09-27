import express, { Express, NextFunction, Request, Response } from 'express';
import authRouter from './routes/authRoutes';
import categoryRouter from './routes/categoryRoutes';
import carouselSlideRouter from './routes/crouselSlideRoutes';
import brandRouter from './routes/brandRoutes';
import userRouter from './routes/userRoutes';
import productsRouter from './routes/productRoutes';
import orderRouter from './routes/orderRoutes';
import reviewsRouter from './routes/reviewRoutes';
import wishListRouter from './routes/wishlistRoutes';
import errorController from './controllers/errorController';
import rateLimit from 'express-rate-limit';
import {
  endpointNotImplemented,
  tooManyRequests,
} from './controllers/suspicionController';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { setupSwagger } from './api-documentation/swagger';
import morganMiddleware from './middlewares/morganMiddleware';

const app: Express = express();

// to log any http request to the console and http.log file
app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // For parsing cookies

// setup CORS allowed origins

const allowedOrigins: string[] = [
  'http://127.0.0.1:4000',
  'http://127.0.0.1:5173',
  'http://localhost:4000',
  'http://localhost:5173',
  'https://backend-final-g3-qngl.onrender.com',
];

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// limit the number of requests sent to the server to under 500 requests per minute.
app.use(
  rateLimit({
    windowMs: 1000 * 60, // time in ms
    limit: 500,
    handler: tooManyRequests,
  }),
);

// Setup Swagger
setupSwagger(app);

app.use('/api/auth', authRouter);
app.use('/api/brands', brandRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productsRouter);
app.use('/api/carouselSlides', carouselSlideRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/wishList', wishListRouter);

// whenever a user sends a request to an unimplemented endpoint,
// they will get a 404 status code response
app.route('*').all(endpointNotImplemented);

// pass errors to the global error controller
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorController(err, req, res, next);
});

export default app;
