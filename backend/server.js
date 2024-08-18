import express from 'express';
import products from "./Data/products.js";
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World! is running on port 5000');
});
app.get('/api/products', (req, res) => {
    res.json(products);
})
app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
        res.json(product);
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});