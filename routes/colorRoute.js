import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
    createColor,
    getAllColors,
    getColor,
    deleteColor,
    updateColor
} from '../controllers/colorController.js';
import isAdmin from "../middlewares/isAdmin.js";

const colorRouter = express.Router();

colorRouter.post("/", isLoggedIn, isAdmin, createColor);
colorRouter.delete("/:id", isLoggedIn, isAdmin, deleteColor);
colorRouter.put("/:id", isLoggedIn, isAdmin, updateColor);
colorRouter.get("/", getAllColors);
colorRouter.get("/:id", getColor);

export default colorRouter;