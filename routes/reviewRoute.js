import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
    createReview,
} from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.post("/:productID", isLoggedIn, createReview);

export default reviewRouter;