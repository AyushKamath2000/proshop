import express from 'express';
import products from "./Data/products.js";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
dotenv.config();
const port = process.env.PORT || 6000;
connectDB();
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World! is running on port 5000');
});
app.use('/api/products', productRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(notFound);
app.use(errorHandler);
