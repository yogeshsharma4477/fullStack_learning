import excuteQuery from '../../lib/db'

export default async function getdcdetails(req, res) {
    try {
        const dcToken = req.body.dcToken || req.cookies.dcToken;
        if(!dcToken){
            return res.status(200).json({ results: [], message: "Token is required", success: false });
        }
        let insQuery = `SELECT * FROM tbl_dc_logs WHERE token = ? order by created_at DESC LIMIT 1;`
        let insertValues = [dcToken]
        const result = await excuteQuery({query: insQuery, values: insertValues});
        if(result.length > 0){
            return res.status(200).json({ results: result, message: "Details fetched successfully!", success: true });
        }else{
            return res.status(200).json({ results: [], message: "No Details Found", success: false });
        }

    } catch (error) {
        return res.status(500).json({ results: [], message: error.message || "Something went wrong.", success: false });
    }
}