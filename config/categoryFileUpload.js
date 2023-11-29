import cloudinaryPackage from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
import { CloudinaryStorage } from 'multer-storage-cloudinary';

//configure cloudinary
const cloudinary = cloudinaryPackage.v2;

cloudinary.config({
    cloud_name: process.env.CLOUDNIARY_NAME,
    api_key: process.env.CLOUDNIARY_API_KEY,
    api_secret: process.env.CLOUDNIARY_SECRET_KEY
});

//create stroage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params: {  
        folder: "Node-React-Ecommerce-api",
    }
});

//Init multer with storage engine
const categoryFileUpload = multer({
    storage,
});

export default categoryFileUpload;