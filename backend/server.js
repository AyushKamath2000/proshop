import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/UserRoutes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/OrderRoutes.js";
import uploadRouter from "./routes/uploadRouter.js";
import  path from "path";
dotenv.config();
const port = process.env.PORT || 6000;
connectDB();
const app = express();

//Add body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());

//routes
app.get('/', (req, res) => {
  res.send('Hello World! is running on port 5000');
});
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRouter);
app.get('/api/config/paypal',(req,res)=>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID}));


const dirName = path.resolve();
app.use('/uploads', express.static(path.join(dirName, '/uploads')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(notFound);
app.use(errorHandler);
