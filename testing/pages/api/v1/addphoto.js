import authenticateJWT from "@/utils/middleware";
import axios from "axios";
import FormData from "form-data";
import multer from "multer";

var storage = multer.memoryStorage();
var upload = multer({ storage: storage }).any();



export const config = {
  api: {
    bodyParser: false,
  },
};


// let Photo_url = process.env.APP_ENV === "production" ? process.env.PHOTO_PRODUCTION_IP : process.env.PHOTO_STAGING_IP


async function addPhoto(req, res){
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.json(200).json({
        error_code: 1,
        message: "Something went wrong",
      });
    } else if (err) {
      return res
        .status(200)
        .json({ error_code: 1, message: "Something went wrong" });
    }
    try {
      if (req.files) {
        var fd = new FormData();
        let files = req.files;
        if (!req.body.docid) {
          return res.json({
            errorCode: 1,
            msg: "Doc Id not available",
          });
        }
        files.forEach((file, i) => {
          console.log(file.originalname);
          if (file.size >= 10000000) {
            return res.json({
              errorCode: 1,
              msg: "file is larger than 10 MB",
            });
          }
          fd.append("files[]", file.buffer, { filename: file.originalname });
        });
        fd.append("insta", req.body.insta);
        fd.append("source", req.body.source);
        fd.append("docid", req.body.docid);
        fd.append("sid", req.body.sid);
        fd.append("city", req.body.city);
        fd.append("verified", req.body.verified);
        fd.append("gallery", req.body.gallery);
        fd.append("catalogue_id", req.body.catalogue_id);
        fd.append("module_type", req.body.module_type);
        fd.append("mod", req.body.mod);
        fd.append("upload_by", req.body.upload_by);
        // const api = "http://192.168.29.37:100/common_upload/upload.php";
        // const api = "http://192.168.12.131:100/common_upload/upload.php";
        //const api = "http://192.168.20.83/common_upload/upload.php";
        const api = "http://192.168.20.160/common_upload/upload.php"
        const formHeaders = fd.getHeaders();
        const response = await axios.post(api, fd, {
          headers: {
            ...formHeaders,
          },
        });
        const responseString = response.data;

        res.status(200).send(responseString);
      }
    } catch (error) {
      //   console.log(error);

      return res
        .status(200)
        .json({ error_code: 1, message: "Something went wrong." });
    }
  });
};

export default authenticateJWT(addPhoto)

