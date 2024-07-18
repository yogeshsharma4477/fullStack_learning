import authenticateJWT from '@/utils/middleware';
import axios from 'axios'

const fetchprofilescore = async (req, res) => {
    try{
        const { docid } = req?.body || {};
        const url = '';
    
        
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

