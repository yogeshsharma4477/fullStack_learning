import axios from 'axios';

const triggersmsoncontractcreation = async (req, res) => {
        
    const {mobileNumber} = req?.body || {}
    
    if(!mobileNumber){
        return res.status(400).json({
            status: 'false'
        })
    }
    let payload = {
        "mobile": mobileNumber,
        "template": "JOIN_FREE",
        "vertical": "CLIENT", 
        "category": "ALERTS",
        "fields": {}
    }
    let url_sms = `http://192.168.131.12/communication/api/v1/send_communication`
    await axios.post(url_sms, payload).then(()=>{
        return res.status(200).json({
            status: 'true'
        })
    }).catch(err => {
        return res.status(400).json({
            status: 'false'
        })
    })
}

export default authenticateJWT(triggersmsoncontractcreation)
