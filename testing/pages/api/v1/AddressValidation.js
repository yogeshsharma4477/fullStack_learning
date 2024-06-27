import axios from "axios";
import {
    PORT_ADDRESS,
} from "../links";
import { encodeQueryData } from "@/utils/commonFunc";
import authenticateJWT from "@/utils/middleware";



async function AddressValidation(req, res) {
    try {
        let body = req.body ? req.body : "";
        let building_name = body && body.building_name ? body.building_name : "";
        let street = body && body.street ? body.street : "";
        let landmark = body && body.landmark ? body.landmark : "";
        let data_city = body && body.data_city ? body.data_city : "";
        let area = body && body.area ? body.area : "";
        let state = body && body.state ? body.state : "";

        let data = {
            building_name,
            street,
            landmark,
            data_city,
            area,
            state,
            module: "el",
            fieldwise: '1',
            m: "1",
            old: "1"
        }

        var config = {
            method: "get",
            url: `http://${process.env.V2.GLOBAL_COMPANY_API}?${encodeQueryData(data)}`
        };

        const response = await axios(config);
        return res
            .status(200)
            .json({ results: response.data, message: "", success: true });
    } catch (error) {
        return res.status(200).json({ results: error, message: "", success: false });
    }

}

export default authenticateJWT(AddressValidation)
