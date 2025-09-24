import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { filePath } from "../libs/config";

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }
        cb(null, filePath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/jpe|jpeg|png|gif/)) {
        cb(new Error("File is not supported"), false);
        return;
    }

    cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
