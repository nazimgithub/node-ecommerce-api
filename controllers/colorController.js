import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

// @desc Create Color
// @route POST /api/v1/color
// @access Private/Admin
export const createColor = asyncHandler(async(req, res)=>{
    const { name } = req.body;
    //check Color exists
    const colorFonund = await Color.findOne({name});
    if(colorFonund){
        throw new Error("Color already exists.")
    }
    //create
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: "success",
        message: "Color added successfully.",
        color
    });
});

// @desc Fetch all Color
// @route GET /api/v1/color
// @access Public/Admin
export const getAllColors = asyncHandler(async(req, res)=>{
    const colors = await Color.find();
    res.json({
        status: "success",
        message: "Fetch colors successfully",
        colors
    });
});

// @desc Fetch single Color
// @route GET /api/v1/color
// @access Public/Admin
export const getColor = asyncHandler(async(req, res)=>{
    const color = await Color.findById(req.params.id);
    res.json({
        status: "success",
        message: "Color fetch successfully",
        color
    });
});

// @desc Delete single Color
// @route DELETE /api/v1/color
// @access Private/Admin
export const deleteColor = asyncHandler(async(req, res)=>{
    await Color.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Color deleted successfully",
    });
});

// @desc update Color
// @route PUT /api/v1/color
// @access Private/Admin
export const updateColor = asyncHandler(async(req, res)=>{
    const { name } = req.body;
    //update
    const color = await Color.findByIdAndUpdate(req.params.id, { name }, { new: true});
    res.json({
        status: "success",
        message: "Color updated successfully",
        color
    });
});