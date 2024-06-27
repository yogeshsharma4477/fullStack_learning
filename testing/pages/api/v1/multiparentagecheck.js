import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function multiparentagecheck(req, res) {
  try {
    const parentageForm = req.query;
    const response = await axios.get(
      `http://192.168.8.122:811/services/multiparentage_check.php`,
      {
        params: {
          rquest: "check_multiparentage",
          parentid: parentageForm.parentid,
          ucode: "swapedit",
          uname: "wapedit",
          catid_list: parentageForm.catid_list,
          module: "webedit",
          req_data_city: parentageForm.req_data_city,
          data_city: parentageForm.data_city,
          post_data: 1,
          trace: 0,
          companyname: parentageForm?.companyName || '', 
          get_parentlineage_info_edit: 1,
          reset_flag: 1,
        },
      }
    )
    return res.json(response.data);
  } catch (error) {
    return error;
  }
}

export default authenticateJWT(multiparentagecheck)
