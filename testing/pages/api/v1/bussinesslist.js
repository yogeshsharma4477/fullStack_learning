import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function bussinesslist(req, res) {
    try{
        let  { number } = req.query;
        
        let url = `http://192.168.8.12:9001/web_services/PhoneSearch.php?phone_nos=${number}&lme=1&limit=200`
        axios.get(url)
        .then((responce)=>{
            let returnResponce;
            if(responce?.data?.error.code == 0){
                returnResponce = res.status(200).json({ results: responce?.data, message: `Record fetched successfully.`, success: true });
                return
            } else {
                returnResponce = res.status(200).json({ results: responce?.data, message: "Record fetched unsuccessfully.", success: false });
                return
            }

            return returnResponce
        })
        .catch((err)=>{
            return res.status(500).json({ results: err, message: "Something went wrong.", success: false });
        })

    } catch(error){
        return res.status(500).json({ results: error, message: "Something went wrong.", success: false });
    }
}

export default authenticateJWT(bussinesslist)
