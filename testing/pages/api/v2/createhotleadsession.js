import authenticateJWT from '@/utils/middleware'
import axios from 'axios'

async function CreateHotLeadSession(req, res) {
    try {
        let url = process.env.V2.SESSION_GENRATE_API

        axios
            .post(url)
            .then(function (response) {
                if (response?.data?.error == 0) {
                    return res.status(200).json({
                        data: response?.data.data,
                        status: !response?.data?.error,
                    })
                } else {
                    return res.status(200).json({
                        data: { lead_session_id: '' },
                        status: 0,
                    })
                }
            })
            .catch(function (error) {
                return res.status(200).json({
                    data: { lead_session_id: '', errMsg: error },
                    status: 0,
                })
            })
    } catch (error) {
        return res.status(200).json({
            data: { lead_session_id: '', errMsg: error },
            status: 0,
        })
    }
}

export default authenticateJWT(CreateHotLeadSession)

