import express  from "express";
const router = express.Router();
import {
    createProduct, createProductReview,
    deleteProduct,
    getProductById,
    getProducts, getTopRatedProducts,
    updateProduct
} from "../controllers/productController.js";
import {admin, protect} from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route('/').get(getProducts).post( protect ,admin, createProduct);
router.route('/top').get(getTopRatedProducts);
router.route('/:id').get( checkObjectId, getProductById).put(protect ,admin, checkObjectId, updateProduct).delete(protect ,admin, checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protect,checkObjectId, createProductReview);

export default router;
