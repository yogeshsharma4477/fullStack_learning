
import axios from "axios";
import { encodeQueryData } from "@/utils/commonFunc";
import authenticateJWT from "@/utils/middleware";

async function successStories(req, res) {
    try {
        let url = `http://192.168.20.228/cms_api/cms/cms/successStories?limit=all`
        const response = await axios.post(url, { 'hname': "Success Videos" }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded ',
            }
        });

        let data = await response?.data?.results?.data
        return res.status(200).json({ results: data, message: "", success: true });
    } catch (error) {
        return res.status(200).json({ results: error.message, message: "", success: false });
    }

}

export default authenticateJWT(successStories)

