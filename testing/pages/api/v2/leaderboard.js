// http://192.168.14.101:3006/leads/company-search-count?case=service&sections=competitor_trending_nc&fromdate=2024-01-02&todate=2024-01-08&national_catid=10302729&city=mumbai
import axios from 'axios'

const LeaderBoard = async (req, res) => {
    const {fromdate, todate, ncatid, city,area } = req.body
    let url = `http://192.168.40.173:8000/leads/company-search-count?case=service&sections=competitor_trending_nc&fromdate=${fromdate}&todate=${todate}&national_catid=${ncatid}&city=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}`
    try {
        const response = await axios.get(url)
        const responseData = await response.data
        res.status(200).json({ data : responseData });
    } catch (e) {
        console.log(e.message,"error");
        res.status(500).send(e.message)
    }
}
export default LeaderBoard
