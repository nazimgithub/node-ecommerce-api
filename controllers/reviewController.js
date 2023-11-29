import expressAsyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";

// @desc Create New review
// @route POST /api/v1/review
// @access Private/Admin
export const createReview = expressAsyncHandler(async(req, res)=>{
    const { product, user, message, rating } = req.body;
    // 1. Find the product
    const { productID } = req.params;
    const productFound = await Product.findById(productID).populate("reviews");
    if(!productFound){
        throw new Error("Product no found.")
    }
    //2. check if user already provide review and rating for this product
    const hasReviewed = productFound?.reviews?.find((reviews)=>{
        return review?.user?.toString() === req?.userAuthId?.toString();
    });
    if(hasReviewed){
        throw new Error("You have already reviewed this product.");
    }
    //3. create new review
    const review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user: req.userAuthId,
    });
    //4. push review into product found
    productFound.reviews.push(review?._id);
    //5. resave
    await productFound.save();
    res.status(201).json({
        success: true,
        message: "Review created successfully."
    });
});