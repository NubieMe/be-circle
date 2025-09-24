import * as multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, __dirname + "/uploads");
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
