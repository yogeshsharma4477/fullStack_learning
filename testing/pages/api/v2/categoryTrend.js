
// http://192.168.8.67:8000/leads/category-search-trend?fromdate=2023-06-01&todate=2023-11-30&ncatid=10152976&data_city=Kozhikode&call_src=hotleads_campaign
import axios from 'axios'

const categoryTrend = async (req, res) => {
    const { fromdate, todate, ncatid, city, area } = req.body
    let url = `http://192.168.8.67:8000/leads/category-search-trend?fromdate=${fromdate}&todate=${todate}&ncatid=${ncatid}&data_city=${encodeURIComponent(city)}&call_src=hotleads_campaign&area=${encodeURIComponent(area)}`
    try {
        const response = await axios.get(url)
        const responseData = await response.data
        res.status(200).json({ data: responseData });
    } catch (e) {
        console.log(e.message, "error");
        res.status(500).send(e.message)
    }
}
export default categoryTrend