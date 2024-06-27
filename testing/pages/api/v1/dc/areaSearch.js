import axios from 'axios'

export default async function areaSearch(req, res) {
    try {
        const { str, city } = req.body
        if(!city){
            return res.status(200).json({ results: [], message: "City name is required", success: false });
        }
        if(!str){
            return res.status(200).json({ results: [], message: "Area name is required", success: false });
        }

        const results = await axios(`${process.env.DC_WEB_SERVICES}/AreaSearch.php?str=${str}&city=${city}&exact=1&limit=10&json=1`)
        if(results?.data?.error?.code == 1) return res.status(200).json({ results: [], message: results?.data?.error?.msg, success: false });
        else{
            return res.status(200).json({ results: results?.data, message: "Area Details Fetched", success: true });
        }

    } catch (error) {
        return res.status(500).json({ results: [], message: error.message || "Something went wrong.", success: false });
    }
}