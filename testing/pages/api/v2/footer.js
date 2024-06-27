
import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function footer(req, res) {
    try {
        let url = `http://192.168.20.101/20march2020/vertical-cmn-footer.php?vertical=free-listing&city=mumbai`
        const response = await axios.get(url)

        let data = await response?.data
        return res.status(200).json({ results: data, message: "", success: true });
    } catch (error) {
        return res.status(200).json({ results: error.message, message: "", success: false });
    }

}

export default authenticateJWT(footer)
