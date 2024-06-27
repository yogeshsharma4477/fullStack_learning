import axios from 'axios'

export default async function companySearch(req, res) {
    try {
        const { str, area, pincode } = req.body
        if(!area && !pincode){
            return res.status(200).json({ results: [], message: "Area/Pincode is required", success: false });
        }
        if(!str){
            return res.status(200).json({ results: [], message: "Business name is required", success: false });
        }

        const results = await axios(`${process.env.DC_WEB_SERVICES}/AdvanceSearch.php?start=0&end=100&inactive=0&compname_search=${str}&address_search=${area || pincode}&module=cs&wdup=1&trace=0`)
        if(results?.data?.error?.code == 1) return res.status(200).json({ results: [], message: results?.data?.error?.msg, success: false });
        else{
            return res.status(200).json({ results: results?.data, message: "Business Details Fetched", success: true });
        }

    } catch (error) {
        return res.status(500).json({ results: [], message: error.message || "Something went wrong.", success: false });
    }
}