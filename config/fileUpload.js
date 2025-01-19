import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinaryPackage from "cloudinary";

const cloudinary = cloudinaryPackage.v2;

//configuring cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

//create storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, //passing the config object
  params: {
    folder: "uploads",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
}); //this will upload the file to cloudinary

//Initiating the multer object with the storage engine it helps in storing and retrieve files
const upload = multer({ storage: storage });

export default upload;
