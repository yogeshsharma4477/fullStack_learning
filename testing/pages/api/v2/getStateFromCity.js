import authenticateJWT from '@/utils/middleware'
import axios from 'axios'

const gplaces = async (req, res) => {
    const { city } = req.body
    let static_token = 'eeecaec9-1dd4-4a51-a643-be65a0148e5c'
    let formurl = `http://192.168.20.101/api/india_api_write/20march2020/gplaces.php?token=${encodeURIComponent(
        static_token
    )}&area=${encodeURIComponent(city)}&pincode=&case=result`
    try {
        const response = await axios.post(formurl)
        const responseString = await response.data
        res.status(200).send(responseString)
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export default authenticateJWT(gplaces)
