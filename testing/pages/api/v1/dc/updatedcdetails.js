import excuteQuery from '../../lib/db'

export default async function updateDcDetails(req, res) {
    try {
        const { city, area, state, pincode, business_name, dc_mobile_number, vendor_title, vendor_contact_name, vendor_mobile_number, vendor_email_id, vendor_landline, vendor_std_code } = req.body
        const { dcToken : token } = req.cookies;
        if (!token) {
            return res.status(200).json({ results: [], message: "Token is required", success: false });
        }
        if (!dc_mobile_number) {
            return res.status(200).json({ results: [], message: "Mobile Number is required", success: false });
        }

        let insQuery = `
        INSERT INTO tbl_dc_logs (
            token, city, area, state, pincode, business_name, dc_mobile_number, 
            vendor_title, vendor_contact_name, vendor_mobile_number, 
            vendor_email_id, vendor_landline, vendor_std_code
        ) 
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        ) 
        ON DUPLICATE KEY UPDATE
            city = VALUES(city), 
            area = VALUES(area), 
            state = VALUES(state), 
            pincode = VALUES(pincode), 
            business_name = VALUES(business_name), 
            dc_mobile_number = VALUES(dc_mobile_number), 
            vendor_title = VALUES(vendor_title), 
            vendor_contact_name = VALUES(vendor_contact_name), 
            vendor_mobile_number = VALUES(vendor_mobile_number), 
            vendor_email_id = VALUES(vendor_email_id), 
            vendor_landline = VALUES(vendor_landline),
            vendor_std_code = VALUES(vendor_std_code)
        `
        let insertValues = [token, city, area, state, pincode, business_name, dc_mobile_number, vendor_title, vendor_contact_name, vendor_mobile_number, vendor_email_id, vendor_landline, vendor_std_code]
        let updatedValues = [city, area, state, pincode, business_name, dc_mobile_number, vendor_title, vendor_contact_name, vendor_mobile_number, vendor_email_id, vendor_landline, vendor_std_code]
        let concatedValues = insertValues.concat(updatedValues);
        const result = await excuteQuery({ query: insQuery, values: concatedValues });
        return res.status(200).json({ results: result, message: "Details updated successfully!", success: true });

    } catch (error) {
        return res.status(500).json({ results: [], message: error.message || "Something went wrong.", success: false });
    }
}