import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
    createBrand,
    getAllBrands,
    getBrand,
    deleteBrand,
    updateBrand
} from '../controllers/brandController.js';
import isAdmin from "../middlewares/isAdmin.js";

const brandRouter = express.Router();

brandRouter.post("/", isLoggedIn, isAdmin, createBrand);
brandRouter.delete("/:id", isLoggedIn,  isAdmin,deleteBrand);
brandRouter.put("/:id", isLoggedIn,  isAdmin,updateBrand);
brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getBrand);

export default brandRouter;