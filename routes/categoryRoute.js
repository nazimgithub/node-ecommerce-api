import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import categoryFileUpload from '../config/categoryFileUpload.js';

import {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js"

const categoryRouter = express.Router();
categoryRouter.post('/', isLoggedIn, categoryFileUpload.single("file"), createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getSingleCategory);
categoryRouter.put('/:id', isLoggedIn, updateCategory);
categoryRouter.delete('/:id', isLoggedIn, deleteCategory);
export default categoryRouter;