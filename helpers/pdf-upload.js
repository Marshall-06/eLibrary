const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {fieldNameSize: 10*1024*1024},
    fileFilter:(req, file, cb) => {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        cb(null, allowed.includes(file.mimetype));
    }
});

module.exports.upload = upload;