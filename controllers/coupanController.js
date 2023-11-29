import asyncHandler from "express-async-handler";
import Coupan from "../model/Coupan.js";
// @desc Create new Coupan
// @route POST/api/v1/coupans
// @access Private/Admin

export const createNewCoupan = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;
    //check if admin
    
    //check if coupan already exists
    const coupanExists = await Coupan.findOne({code});

    if(coupanExists){
        throw new Error("Coupan already exists");
    }

    if(isNaN(discount)){
        throw new Error("Discount value must be a number.");
    }

    //create coupan
    const coupan = await Coupan.create({
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate,
        user: req.userAuthId,
    });

    //send the response
    res.status(201).json({
        status: "success",
        message: "New coupan created successfully.",
        coupan
    })
});

// @desc get all coupans
// @route GET/api/v1/coupans
// @access Private/Admin
export const getAllCoupans = asyncHandler(async(req, res)=>{
    const coupans = await Coupan.find();
    res.status(200).json({
        status: "success",
        message: "All coupans fetch successfully!",
        coupans
    });
});

// @desc get single coupan
// @route GET/api/v1/coupan/:id
// @access Private/Admin
export const getCoupan = asyncHandler(async(req, res)=>{
    const coupan = await Coupan.findById(req.params.id);
    res.json({
        status: "success",
        message: "Coupan fetch successfully.",
        coupan,
    });
});

// @desc update coupan
// @route GET/api/v1/coupan/:id
// @access Private/Admin
export const updateCoupan = asyncHandler(async(req, res)=>{
    const { code, discount, startDate, endDate } = req.body;
    const coupan = await Coupan.findByIdAndUpdate(req.params.id,
        {
            code: code?.toUpperCase(),
            discount,
            startDate,
            endDate,
        },
        {
            new: true
        }
    );
    res.json({
        status: "success",
        message: "Coupan detail update successfully.",
        coupan,
    });
});

// @desc delete coupan
// @route GET/api/v1/coupan/:id
// @access Private/Admin
export const deleteCoupan = asyncHandler(async(req, res)=>{
    await Coupan.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Coupan deleted successfully."
    });
});
