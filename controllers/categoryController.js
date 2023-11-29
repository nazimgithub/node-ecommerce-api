import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

// @desc Create Category
// @route POST /api/v1/categories
// @access Private/Admin

export const createCategory = asyncHandler(async(req, res) => {
    const {name} = req.body;
    
    //category exists
    const categoryFound = await Category.findOne({name});
    if(categoryFound){
        throw new Error("Category already exists");
    }
    //create
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req.file.path
    });

    res.json({
        status: "success",
        message: "Category created successfully.",
        category
    })
});

// @desc Fetch all Categories
// @route GET /api/v1/categories
// @access Public/Admin
export const getAllCategories = asyncHandler(async(req, res)=>{
    const allCategories = await Category.find();
    res.json({
        status: "success",
        message: "All Categories fetch succcessfully.",
        allCategories
    });
});    

// @desc Fetch Single Category
// @route GET /api/v1/categories
// @access Public/Admin
export const getSingleCategory = asyncHandler(async(req, res)=>{
    const category = await Category.findById(req.params.id);
    res.json({
        status: "success",
        message: "Category fetched succcessfully.",
        category
    });
});    

// @desc Update Single Category
// @route PUT /api/v1/categories
// @access Private/Admin
export const updateCategory = asyncHandler(async(req, res)=>{
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true});
    res.json({
        status: "success",
        message: "Update category successfully.",
        category
    })
});

// @desc Delete Single Category
// @route DELETE /api/v1/categories
// @access Private/Admin
export const deleteCategory = asyncHandler(async(req, res)=>{
    await Category.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Category deleted successfully.",
    });
});