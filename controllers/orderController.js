import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Order from "../model/Order.js";
import Stripe from "stripe";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Coupan from "../model/Coupan.js";

 
//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrder = asyncHandler(async(req, res)=>{

    //get the coupan
    const { coupan } = req?.query;
    
    const coupanFound = await Coupan.findOne({
        code: coupan?.toUpperCase(),
    });

    if(coupanFound?.isExpired){
        throw new Error("Coupan has Expired.");
    }

    if(!coupanFound){
        throw new Error("Coupan does not exists.");
    }
    
    //get discount
    const discount = coupanFound?.discount / 100;

    //Get the payload(customer, orterItems,     , totalPrice)
    const { orderItems, shippingAddress, totalPrice } = req.body;

    //find the user
    const user = await User.findById(req.userAuthId);
    
    //Check if user has shipping address
    if(!user?.hasShippingAddress) {
        throw new Error("Please provide shipping address.");
    }
    
    //check if order is not empty
    if(orderItems?.length <= 0){
        throw new Error("No Order Items");
    }

    //Place/Create order - save in to DB
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice: coupanFound ? totalPrice - totalPrice * discount : totalPrice,
    });

    console.log(order);

    //Update the product qty
    const products = await Product.find({ _id: { $in: orderItems } });
    
    orderItems?.map(async (order) => {
        const product = products?.find((product)=>{
            return product?._id?.toString() === order?._id.toString();
        });
        if(product){
            product.totalSold += order.qty;
        }
        await product.save();
    });

    //push order into user
    user.orders.push(order?._id);
    await user.save();
    
    //make payment (Stripe)
    //Convert order items to have same structure that stripe need
    const convertedOrders = orderItems.map((item) => {
        return {
            price_data:{
                currency: "usd",
                product_data: {
                    name: item?.name,
                    description: item?.description
                },
                unit_amount: item?.price * 100,
            },
            quantity: item?.qty,
        };
    });

    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId: JSON.stringify(order?._id),
        },
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel'
    });
    
    res.send({ url: session.url });
});

//@desc get all orders
//@route POST /api/v1/orders
//@access private

export const getAllOrders = asyncHandler(async (req, res) =>{
    //find all orders
    const orders = await Order.find();
    res.json({
        success: true,
        msg: "All orders fetch successfully",
        orders
    });
});

//@desc get single orders
//@route POST /api/v1/orders/:id
//@access private

export const getSingleOrder = asyncHandler(async (req, res) => {
    //fetch single order
    const id = req.params.id;
    const order = await Order.findById(id);
    res.status(200).json({
        success: true,
        msg: "Order fetch successfully.",
        order
    });
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin
export const updateOrder = asyncHandler(async (req, res)=>{
    //get the id from params
    const orderId = req.params.id;
    //update order status
    const updateOrder = await Order.findByIdAndUpdate(
        id,
        {
            status: req.body.status,       
        },
        {
            new: true,
        }
    );

    res.status(200).json({
        success: true,
        msg: "Order status update successfully.",
        updateOrder
    });
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin
export const getOrderStats = asyncHandler(async(req, res) => {
    //get minimum order
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                minimumSale:{
                    $min: "$totalPrice",
                },
                totalSales: {
                    $sum: "$totalPrice",
                },
                maxSales: {
                    $max: "$totalPrice",
                },
                avgerageSales: {
                    $avg: "$totalPrice",
                },
            },
        },
    ]);

    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const saleToday = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: today,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalSales: {
                    $sum: "$totalPrice"
                },
            },
        },
    ]);
    
    res.status(200).json({
        success: true,
        msg: "Total orders of sum calculated.",
        orders,
        saleToday
    });
});