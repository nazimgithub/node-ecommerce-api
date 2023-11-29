import express from 'express';
import {
    registerUser,
    userLogin,
    updateShippingAddress,
    getUserProfile
} from "../controllers/userController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();
userRoutes.post('/register', registerUser);
userRoutes.post('/login', userLogin);
userRoutes.put('/update/shipping', isLoggedIn, updateShippingAddress);
userRoutes.post('/profile', isLoggedIn, getUserProfile);
export default userRoutes;