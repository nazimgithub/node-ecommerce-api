import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    getOrderStats
} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrder);
orderRouter.get("/", isLoggedIn, getAllOrders);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStats);
orderRouter.get("/:id", isLoggedIn, getSingleOrder);
orderRouter.put("/update/:id", isLoggedIn, updateOrder);

export default orderRouter;