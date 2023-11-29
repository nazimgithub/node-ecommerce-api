import User from "../model/User.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from '../utils/generateToken.js'
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import {verifyToken} from "../utils/verifyToken.js"

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUser = expressAsyncHandler(async (req, res) => {
   const { fullName, email, password } = req.body;
   //check user exists
   const userExists = await User.findOne({email});
   if(userExists){
      throw new Error("User already exists");
   }
   //hash password
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);

   //create new user
   const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
   });
   res.status(201).json({
      status: "success",
      message: "User Registered Successfully!",
      data: user,
   });
});

// @desc Login user
// @route POST /api/v1/users/login
// @access Public
export const userLogin = expressAsyncHandler(async (req, res) => {
   const { email, password } = req.body;
   //Find the user in db by email only
   const userFound = await User.findOne({
      email,
   });
   if(userFound && (await bcrypt.compare(password, userFound?.password))){
      res.json({
         status: "success", 
         msg: "Login Success",
         userFound,
         token: generateToken(userFound?._id),
      });
   }else{
      throw new Error("Invalid Login Details.");
   }
});

// @desc Update user shipping addres
// @route POST /api/v1/update/shipping
// @access Private
export const updateShippingAddress = expressAsyncHandler(async(req, res) =>{
   const { firstName, lastName, address, city, postalCode, state, country, phone } = req.body;
   const user = await User.findByIdAndUpdate(req.userAuthId, {
      shippingAddress: {
         firstName,
         lastName,
         address,
         city,
         postalCode,
         state,
         country,
         phone
      },
         hasShippingAddress: true,
      },
      {
         new: true,
      }
   );
   
   //send response
   res.json({
      status: "success",
      message: "User shipping address updata successfully.",
      user,
   });
});

export const getUserProfile = expressAsyncHandler(async (req, res) =>{
   const user = await User.findById(req.userAuthId).populate("orders");
   res.status(200).json({
      status: "success",
      msg: "User profile fetched successfully.",
      user
   });
});