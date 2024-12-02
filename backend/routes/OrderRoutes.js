import express  from "express";
const router = express.Router();
import {addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders} from "../controllers/OrderController.js";
import {admin, protect} from "../middleware/authMiddleware.js";

router.route('/').post( protect ,addOrderItems).get(protect, admin, getOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.route('/:id/deliverd').get(protect, admin, updateOrderToDelivered);
router.route('/:id/pay').put(protect, updateOrderToPaid);


export default router;
