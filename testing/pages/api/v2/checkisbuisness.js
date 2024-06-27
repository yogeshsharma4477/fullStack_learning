import authenticateJWT from '@/utils/middleware';
import axios from 'axios'

async function checkisbusiness(req, res) {
    const {mobile = null} = req?.query || {}
    try {
        if(!mobile) {
            return res.status(200).json({
                status: 0,
                msg: 'mobile number not found'
            })
        }
        let url = `http://${process.env.BUSSINESS_LIST_BASE_URL}/web_services/PhoneSearch.php`;
        const queryObj = {
            phone_nos: mobile,
            limit: '1',
            lme: '1'
        }
        const responce = await axios.get(url, {
            params: queryObj
        })
        return res.status(200).json({
            isBusiness: !!responce?.data?.results?.length ,
            status: 1,
        })
        
    } catch (error) {
        return res.status(500).json({
            status: 0,
            msg: error?.message || 'Something went wrong'
        })
    }
}

export default authenticateJWT(checkisbusiness)
