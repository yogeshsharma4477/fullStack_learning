import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function sendotp(req, res) {
    try{
        let  { number } = req.query;
        let url = `https://www.justdial.com/api/india_api_write/20march2020/sendvcode.php?mobile=${number}&fname=&wap=2&resend=0&randtime=1681810274575&source=2&version=3.2&searchReferrer=gen%7Chmpge&utmCampaign=&utm_campaign=&referer=https%3A%2F%2Fwww.justdial.com%2Fjdmart&utm_source=&utm_medium=&lat=19.185&long=72.840&enc=1&env=p`
        axios.get(url)
        .then((responce)=>{
            let returnResponce;
            if(responce?.data?.result === 'Verification code sent successfully'){
                returnResponce = res.status(200).json({ results: responce?.data, message: `OTP send successfully.`, success: true });
                return
            } else {
                returnResponce = res.status(200).json({ results: responce?.data, message: "OTP didn't send successfully.", success: false });
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

export default authenticateJWT(sendotp)
