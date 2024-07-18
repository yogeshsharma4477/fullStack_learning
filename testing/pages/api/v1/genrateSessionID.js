import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function genrateSessionID(req, res) {
    try {
        const sessionIdUrl = ``;
        axios.post(sessionIdUrl)
            .then((responce) => {
                const sessionId = responce?.data?.data?.lead_session_id || null;

                let status = sessionId == null ? false : true;
                return res.status(200).json({ data: { sessionId: sessionId }, success: status });
            })
            .catch((err) => {
                console.error("error", err);
                return res.status(400).json({ data: { sessionId: responce }, success: false });
            })
    } catch (err) {
        console.error("error=> ", err);
        return res.status(500).json({ data: { sessionId: null }, success: false });
    }
}

export default authenticateJWT(genrateSessionID)

