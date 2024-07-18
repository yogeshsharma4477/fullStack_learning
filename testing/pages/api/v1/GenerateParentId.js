// 192.168.8.99:81/api_services/api_parentid_gen.php?rquest=pidgenerator&module=cs&datacity=delhi&source=JDMART&req_data_city=delhi

import axios from "axios";
import {
    PORT_ADDRESS,
} from "../links";
import { encodeQueryData } from "@/utils/commonFunc";
import authenticateJWT from "@/utils/middleware";



async function GenerateParentId(req, res) {
    try {
        let body = req.body ? req.body : "";
        let datacity = body && body.datacity ? body.datacity : "";
        let req_data_city = body && body.req_data_city ? body.req_data_city : "";

        let data = {
            rquest: "pidgenerator",
            module: "cs",
            datacity,
            source: "JOINFREE",
            req_data_city
        }

        var config = {
            method: "get",
            url: ``
        };

        const response = await axios(config);
        let datas = await response.data
        return res
            .status(200)
            .json({ results: datas, message: "", success: true });
    } catch (error) {
        return res.status(200).json({ results: error.message, message: "", success: false });
    }

}

export default authenticateJWT(GenerateParentId)

