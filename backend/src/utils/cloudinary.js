import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    // ⭐ Optional file handling
    if (!localPath) return null;

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "image",
      folder: "job_cover_images",
    });

    // ✅ Delete local file safely
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    // ✅ Return only what you need
    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    // ✅ Safe cleanup
    if (localPath && fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    console.error("Cloudinary Upload Error:", error.message);
    return null;
  }
};

export { uploadOnCloudinary };
