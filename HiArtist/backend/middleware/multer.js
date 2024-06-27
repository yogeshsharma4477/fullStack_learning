const multer = require('multer')

const vidoeFormat = ["MP4", "MOV"] // max 149 mb
const imageFormt = ["JPEG", "PNG", "BMP"] //not more than 8mb

const imageUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileSize = parseInt(req.headers["content-length"])
        console.log(fileSize, "fileSize");
        if (fileSize <= 1000) {
            console.log(file, "enter");
        } else {
            console.log(file, "exit");
        }
        if ((file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "application/octet-stream") && fileSize <= 5e+6) { //5e+6
            cb(null, './myuploads/images')
        } else if (file.mimetype === "video/mp4" && fileSize <= 1.49e+8) {
            cb(null, './myuploads/videos')
        } else {
            cb("File size overloaded!!", false);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
    onError: (err, next) => {
        console.log(err, "catch");
    }
})

const upload = multer(
    {
        storage: imageUpload
    }
)

module.exports = upload