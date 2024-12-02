
import asyncHandler from "../middleware/asyncHandler.js";
import Orders from '../models/orderModel.js';

// @desc Create new Order
// @route POST /api/Orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
    const{orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;
    if(orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("NO ORDERS")
    } else{
        const orders = new Orders({
            orderItems: orderItems.map((x)=>{return {...x, product: x._id ,_id: undefined}}),
            user: req.user._id, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice
        });
        const createdOrder = await orders.save();
        res.status(201).json(createdOrder);
    }
});

// @desc Fetch Orders of a User 
// @route GET /api/orders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Orders.find({user: req.user._id});
    res.status(200).json(orders);
});

// @desc Fetch Order by iD
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Orders.findById(req.params.id).populate('user', 'name email');
    if(order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc Update Order to paid
// @route PUT /api/orders/:id
// @access Private admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Orders.findById(req.params.id);
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404).error("order not found");
    }

});

// @desc Update Order to deliverd
// @route GET /api/orders/:id
// @access Private admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    res.json({"ghfghg": "ghfghg"});
});

// @desc  Get All orders
// @route GET /api/orders/
// @access Private admin
const getOrders = asyncHandler(async (req, res) => {
    res.json({"ghfghg": "ghfghg"});
});



export {addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders};


