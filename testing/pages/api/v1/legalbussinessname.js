import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function legalbussinessname(req, res) {
  try {
    const { name } = req.query;
    let url = "";
    console.log(req.query);
    return res
      .status(200)
      .json({ results: name, message: `${name} is valid.`, success: true });
    // axios.get(url)
    // .then((res)=>{
    //     let returnResponce;
    //     const responce = res;

    //     if(responce?.status==1){
    //         returnResponce = res.status(200).json({ results: name, message: `${name} is valid.`, success: true });
    //     } else if(responce?.status==0){
    //         returnResponce = res.status(200).json({ results: name, message: `${name} is not valid.`, success: false });
    //     } else {
    //         returnResponce = res.status(500).json({ results: name, message: "Something went wrong.", success: false });
    //     }

    //     return returnResponce
    // })
    // .catch((err)=>{
    //     return res.status(500).json({ results: err, message: "Something went wrong.", success: false });
    // })
  } catch (error) {
    //return res.status(500).json({ results: error, message: "Something went wrong.", success: false });
  }
}

export default authenticateJWT(legalbussinessname)
