import * as multer from "multer";
import * as path from "path";
import { NextFunction, Request, Response } from "express";

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "src/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
        cb(new Error("File is not supported"), false);
        return;
    }

    cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
