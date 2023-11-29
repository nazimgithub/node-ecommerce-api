import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

// @desc Create Brand
// @route POST /api/v1/brand
// @access Private/Admin
export const createBrand = asyncHandler(async(req, res)=>{
    const { name } = req.body;
    //check brand exists
    const brandFonund = await Brand.findOne({name});
    if(brandFonund){
        throw new Error("Brand already exists.")
    }
    //create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: "success",
        message: "Brand added successfully.",
        brand
    });
});

// @desc Fetch all Brand
// @route GET /api/v1/brand
// @access Public/Admin
export const getAllBrands = asyncHandler(async(req, res)=>{
    const brands = await Brand.find();
    res.json({
        status: "success",
        message: "Fetch brands successfully",
        brands
    });
});

// @desc Fetch single Brand
// @route GET /api/v1/brand
// @access Public/Admin
export const getBrand = asyncHandler(async(req, res)=>{
    const brand = await Brand.findById(req.params.id);
    res.json({
        status: "success",
        message: "Brand fetch successfully",
        brand
    });
});

// @desc Delete single Brand
// @route DELETE /api/v1/brand
// @access Private/Admin
export const deleteBrand = asyncHandler(async(req, res)=>{
    await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Brand deleted successfully",
    });
});

// @desc update Brand
// @route PUT /api/v1/brand
// @access Private/Admin
export const updateBrand = asyncHandler(async(req, res)=>{
    const { name } = req.body;
    //update
    const brand = await Brand.findByIdAndUpdate(req.params.id, { name }, { new: true});
    res.json({
        status: "success",
        message: "Brand updated successfully",
        brand
    });
});