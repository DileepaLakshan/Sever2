import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
dotenv.config()


const port =process.env.PORT || 5000;


connectDB(); // Connecct to MongoDB

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', // Allow specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow cookies if needed
}));

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//Cookie parser middleware
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server running on port ${port}`));