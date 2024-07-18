import { encodeQueryData } from "@/utils/commonFunc";
import authenticateJWT from "@/utils/middleware";
import axios from "axios";


async function GetPincodeLocation(req, res) {
  try {
    const pincode = req?.body?.pincode || null;
    
    if(pincode==null) return res.status(500).json({ results: [], message: "Pincode not found.", success: false });
    if(pincode?.length !== 6) return res.status(500).json({ results: [], message: "Pincode is wrong.", success: false });
    
    let data = {
      rquest: "get_area",
      pincode: pincode,
      type: "1"
    }
    
    let config = {
      method: "get",
      url: ``
    };

    const response = await axios(config);
    return res
      .status(200)
      .json({ results: response.data, message: "", success: true });
  } catch (error) {
    return res.status(500).json({ results: error, message: "", success: false });
  }

}

export default authenticateJWT(GetPincodeLocation)

