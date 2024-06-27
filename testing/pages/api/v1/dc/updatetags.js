import excuteQuery from '../../lib/db'
import axios from 'axios'

export default async function updatetags(req, res) {
    try {
        const { docid, tag } = req.body;
        const { dcToken } = req.cookies;

        if(!dcToken){
            return res.status(200).json({ results: [], message: "Token not found", success: false });
        }

        if (!docid) {
            return res.status(200).json({ results: [], message: "Docid is required", success: false });
        }
        if (!tag) {
            return res.status(200).json({ results: [], message: "Tag is required", success: false });
        }

        let compDetails = await axios(`http://192.168.20.24:9001/web_services/CompanyDetails.php?docid=${docid}&json=1`) 
        if(compDetails.data?.error?.code === 1){
            return res.status(200).json({ results: [], message: compDetails.data?.error?.msg, success: false });
        }
        compDetails = compDetails?.data;
        compDetails = compDetails[docid];
        const { companyname, city, area, pincode, mobile, paidstatus } = compDetails;

        const selectQuery = `SELECT dc_mobile_number FROM tbl_dc_logs WHERE token = ? ORDER BY created_at DESC LIMIT 1;`
        const selectValues = [dcToken];
        const selectResult = await excuteQuery({ query: selectQuery, values: selectValues });
        if(!selectResult.length){
            return res.status(200).json({ results: [], message: "Mobile Number not found", success: false });
        }else{
            let insQuery = `
            INSERT INTO tbl_dc_tags (
                dc_mobile, docid, comp_name, tag, city, mobile, area, 
                pincode, paid_status, module_type
            ) 
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            ) 
            ON DUPLICATE KEY UPDATE
                comp_name = VALUES(comp_name), 
                tag = VALUES(tag), 
                city = VALUES(city),
                mobile = VALUES(mobile), 
                area = VALUES(area), 
                pincode = VALUES(pincode), 
                paid_status = VALUES(paid_status),
                module_type = VALUES(module_type)
            `
            let insertValues = [selectResult[0].dc_mobile_number, docid, companyname, parseInt(tag), city, mobile, area, pincode,  parseInt(paidstatus), 'Free-Listing']
            let updatedValues = [companyname, parseInt(tag), city, mobile, area, pincode, parseInt(paidstatus), 'Free-Listing']
            let concatedValues = insertValues.concat(updatedValues);
            const result = await excuteQuery({ query: insQuery, values: concatedValues });
            return res.status(200).json({ results: result, message: "Details updated successfully!", success: true });
        }

    } catch (error) {
        return res.status(500).json({ results: [], message: error.message || "Something went wrong.", success: false });
    }
}