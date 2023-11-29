import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
    createNewCoupan,
    getAllCoupans,
    getCoupan,
    updateCoupan,
    deleteCoupan
} from '../controllers/coupanController.js';
import isAdmin from "../middlewares/isAdmin.js";

const coupanRouter = express.Router();

coupanRouter.post("/", isLoggedIn, isAdmin, createNewCoupan);
coupanRouter.get("/", isLoggedIn, getAllCoupans);
coupanRouter.get("/:id", isLoggedIn, getCoupan);
coupanRouter.put("/update/:id", isLoggedIn, isAdmin, updateCoupan);
coupanRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCoupan);

export default coupanRouter;