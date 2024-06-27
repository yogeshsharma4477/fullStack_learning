import axios from "axios";

export default async function checkGlobal(req, res) {
    try {
        let body = req.body ? req.body : ''
        let queryParam = {
            data_city: body?.city || 'mumbai',
            module: 'Freelisting-Website',
            source: 'JD App Data Collection',
            source_id: '1121'
        }
        if (body?.building_name) queryParam.building_name = body?.building_name;
        if (body?.data_city) queryParam.data_city = body?.data_city;
        if (body?.street) queryParam.street = body?.street;
        if (body?.landmark) queryParam.landmark = body?.landmark;
        if (body?.mobile_display) queryParam.mobile = body?.mobile_display.replace(/,/g, '|~|');
        if (body?.landline) queryParam.landline = body?.landline.replace(/,/g, '|~|');
        if (body?.email) queryParam.email = body?.email.replace(/,/g, '|~|');
        if (body?.wnumber) queryParam.whats_app = body?.wnumber.replace(/,/g, '|~|');
        let gcompurl = `http://${process.env.V2.GLOBAL_COMPANY_API}`
        const gres = await axios.get(gcompurl, { params: queryParam });
        if (gres?.data?.error?.code == 1) {
            return res
                .status(200)
                .json({ data: gres?.data?.error, message: 'Please Enter Valid Data', success: false, statuscode: 1 })
        } else {
            return res
                .status(200)
                .json({ data: [], message: 'Valid Data', success: true, statuscode: 1 })
        }

    } catch (error) {
        return res.status(500).json({ data: [], message: error.message || "Something went wrong.", success: false });
    }
}