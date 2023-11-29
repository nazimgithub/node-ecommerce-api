import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';
import isAdmin from "../middlewares/isAdmin.js";
import {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js"

const productRouter = express.Router();
productRouter.post('/', isLoggedIn, isAdmin, upload.array("files"), createProduct);
productRouter.get('/', getProducts);
productRouter.get('/:id', getProduct);
productRouter.put('/:id', isLoggedIn, isAdmin, updateProduct);
productRouter.delete('/:id/delete', isLoggedIn, isAdmin, deleteProduct);
export default productRouter;