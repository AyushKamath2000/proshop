import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGINATION_LiMIT;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = !req.query.keyword ? {} : {name: { $regex: req.query.keyword, $options: 'i'}};
    const count = await Product.countDocuments({...keyword});
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));
    res.json({products, page, pages : Math.ceil(count / pageSize)});
});

// @desc Fetch product
// @route GET /api/product/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Resource not found")
    }
});

// @desc create product
// @route post /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample name",
        price: 0,
        user:req.user._id,
        image:'/images/sample.jpg',
        brand:'sample brand',
        category:'sample Catogory',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc put product
// @route put /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;
    const product = await Product.findById(req.params.id);
    if(product){
        product.name = name,
        product.price= price,
        product.description = description,
        product.image =image,
        product.brand = brand,
        product.category = category,
        product.countInStock =countInStock

        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);
    } else {
        res.status(400);
        throw new Error("Product not found");
    }

});

// @desc delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        await Product.deleteOne({_id:product._id})
        res.status(200).json( {message: "product deleted Successfully"})
    }else {
        res.status(400);
        throw new Error("Product not found");
    }
});

// @desc create product review
// @route PUT /api/products/:id/reviews
// @access Private
    const createProductReview = asyncHandler(async (req, res) => {
        const {rating, comment} = req.body;
        const product = await Product.findById(req.params.id);
        if(product){
            const alredyReviewed =product.reviews.find(r => r.user.toString() === req.user._id.toString());
            if(alredyReviewed){
                res.status(400);
                throw new Error("Product already reviewed");
            }
            const review ={
                name:req.user.name,
                rating:Number(rating),
                comment,
                user:req.user._id
            }
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length;
            await product.save();
            res.status(201).json({message:"your review has been added"})
        }else {
            res.status(404);
            throw new Error("Resource not found");
        }    

});

// @desc get top-rated product
// @route GET /api/product/top
// @access Public
const getTopRatedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating:-1}).limit(3);
    if (products) {
        res.json(products);
    } else {
        res.status(404);
        throw new Error("Resource not found")
    }
});

export {getProductById, getProducts , createProduct , updateProduct, deleteProduct , createProductReview, getTopRatedProducts};


