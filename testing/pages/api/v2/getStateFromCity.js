import authenticateJWT from '@/utils/middleware'
import axios from 'axios'

const gplaces = async (req, res) => {
    const { city } = req.body
    let static_token = 'eeecaec9-1dd4-4a51-a643-be65a0148e5c'
    let formurl = ``
    try {
        const response = await axios.post(formurl)
        const responseString = await response.data
        res.status(200).send(responseString)
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export default authenticateJWT(gplaces)
