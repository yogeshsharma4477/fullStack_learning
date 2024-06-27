import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function deleteImage(req, res) {
  try {
    // console.log(req.body)
    const { docid = '', pid = '', sid = '', mobilNo = '' } = req.body;
    // console.log("-------------------------------------")
    let cookieObjectString = req?.headers?.cookie || ''
    // let cookieObject = JSON.parse(cookieObjectString)
    // console.log('{'+cookieObjectString+'}')
    // console.log(cookieObjectString.split(';'))
    // console.log(typeof cookieObjectString, cookieObjectString)
    // console.log("here")
    // console.log("-------------------------------------")

    let responceObj = {};

    let payload = {
      docid: '9999PX751.X751.230523180449.E1T1',//docid,//"080PXX80.XX80.220426225924.G5I1",
      pid: '',//"262604954",
      sid: 'NnpaU9ACa7NZ1tDsY0H4mHhAmYPIWIbWX9dnTeqSWaQ%3D',//encodeURIComponent(decodeURIComponent(decodeURIComponent(sid))),//"rTXoGMqJ8bbj%252FvVTo3kyVVQ58rsMYRC88uVdeB%252BpIJg%253D",
      module_type: "6",
      process: "del",
      content: "photo",
      deleted_by: "8879152843"
    }

    let url = `http://${process.env.DELETE_API_IP}/common_upload/api/editImage.php`
    // console.log("-------------------------------------------------------------------------")
    // console.log(payload, 'payload')
    // console.log("-------------------------------------------------------------------------")
    axios.post(url, payload)
      .then((responce) => {
        if (!!responce.data.error_code) {
          return res.status(200).json({ data: responce?.data, success: true });

          // let tempImageArr = [...imagesArr];
          // let tempImageArrLength = tempImageArr.length

          // let deleteImgFunc = 'tempImageArr.slice(0, index-1).concat(tempImageArr.slice(index+1, tempImageArrLength))'
          // if(index==0) deleteImgFunc = 'tempImageArr.slice(1, tempImageArrLength)'
          // if(index==0) deleteImgFunc = 'tempImageArr.length = 0'
          // tempImageArr = eval(deleteImgFunc);

          // setImagesArr(tempImageArr)
          // setMessage({
          //   errFlag: true,
          //   errMsg: "Image Successfully Deleted.",
          // });
        } else if (!responce.data.error_code) {
          return res.status(200).json({ data: responce?.data, success: false });
          // setMessage({
          //   errFlag: true,
          //   errMsg: "Something Went Wrong!!",
          // });
        }
      })
      .catch((err) => {
        console.error("error=> ", err)
        //   setMessage({
        //     errFlag: true,
        //     errMsg: "Something Went Wrong!!",
        //   });
      })
  } catch (error) {
    console.error('error=> ', error)
    return res.status(500).json({ results: error, message: "Something went wrong.", success: false });
  }
}

export default authenticateJWT(deleteImage)
