import axios from 'axios'

const AreaCity = async (req, res) => {
    const { search } = req.body
    let url = ``
    try {
        const response = await axios.get(url)
        const responseData = await response.data
        res.status(200).json({ data : responseData });
    } catch (e) {
        console.log(e.message,"error");
        res.status(500).send(e.message)
    }
}
export default AreaCity