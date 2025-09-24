import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import * as fs from "fs";
import { extractPublicId, setConfig } from "cloudinary-build-url";
import { filePath } from "./config";

setConfig({
    cloudName: process.env.CLOUD_NAME,
});

export default new (class CloudinaryConfig {
    config() {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true,
        });
    }

    async upload(image: string) {
        try {
            const res = await cloudinary.uploader.upload(`${filePath}/${image}`, { folder: "circle-pp" });
            fs.unlinkSync(`${filePath}/${image}`);
            return res;
        } catch (error) {
            throw error;
        }
    }

    async uploads(image: any[]) {
        try {
            const files = [];
            let i = 0;
            const len = image.length;
            for (i; i < len; i++) {
                files.push(
                    (await cloudinary.uploader.upload(`${filePath}/${image[i].filename}`, { folder: "circle-pp" }))
                        .secure_url
                ),
                    fs.unlinkSync(`${filePath}/${image[i].filename}`);
            }
            return await Promise.all(files);
        } catch (error) {
            throw error;
        }
    }

    async delete(image: string) {
        const publicId = extractPublicId(image);
        cloudinary.api.delete_resources([publicId]);
    }

    async deletes(image: string[]) {
        const files = [];
        let i = 0;
        const len = image.length;
        for (i; i < len; i++) {
            const publicId = extractPublicId(image[i]);
            files.push(publicId);
        }
        cloudinary.api.delete_resources(files);
    }
})();
