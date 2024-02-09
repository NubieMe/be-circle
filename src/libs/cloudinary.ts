import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

export default new (class CloudinaryConfig {
    upload() {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true,
        });
    }

    async destination(image: string) {
        try {
            return await cloudinary.uploader.upload(`src/uploads/${image}`);
        } catch (error) {
            throw error;
        }
    }
})();
