
import axios from 'axios'

const categoryTrend = async (req, res) => {
    const { fromdate, todate, ncatid, city, area } = req.body
    let url = ``
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