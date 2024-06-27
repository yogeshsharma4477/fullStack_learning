import authenticateJWT from '@/utils/middleware';
import axios from 'axios'

const fetchprofilescore = async (req, res) => {
    try{
        const { docid } = req?.body || {};
        const url = 'http://192.168.20.59:4000/api/comp/getScore';
    
        
        const responce = await axios.get(url, {
            params: {
                docid: docid
            }
        })

       return res.send(responce.data)

    } catch(error){
        console.log(error )
        return res.status(500).json({
            data: {},
            status: 'failed'
        })
    }
}

export default authenticateJWT(fetchprofilescore)

