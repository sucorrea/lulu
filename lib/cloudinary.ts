import { v2 as cloudinary } from 'cloudinary';

const credentials = Object.fromEntries(
  Object.entries({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }).filter(([, value]) => Boolean(value))
);

cloudinary.config(credentials);

export default cloudinary;
