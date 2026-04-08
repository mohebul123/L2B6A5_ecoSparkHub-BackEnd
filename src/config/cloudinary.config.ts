import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Config (Memory Storage use korchi jate direct cloud-e jay)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const cloudinaryUpload = cloudinary;
