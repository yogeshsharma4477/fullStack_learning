import authenticateJWT from "@/utils/middleware";
import { log_db } from "../lib/log_db";



function fetchPlatform(sourceCode){
    let platformName = '';
    switch(sourceCode){
        case '7': case '77':
            platformName = 'web';
            break;
        case '2':
            platformName = 'touch';
            break;
        case '1': 
            platformName = 'android';
            break;
        case '3':
            platformName = 'ios';
            break;
        default:
            platformName = 'other';
    }
    return platformName || null;
}

const logSessionAction = (req, res)=>{

    try{
        const { session_id=null, device_id=null, mobile=null, referral=null, li=null, ll=null, sourceCode=null } = req?.body || {}
        
        let platform = fetchPlatform(sourceCode);
        
        let InsertQuery = 'INSERT INTO tbl_signup_logs (session_id, mobile, device_id, referral, li, ll, platform) ';
        InsertQuery += `VALUES ('${session_id}', '${mobile}', '${device_id}', '${referral}', '${li}', '${ll}', '${platform}')`;
        

        log_db.query(InsertQuery).then((result) => {

            return res.status(201).json({
                status: 'successful',
                statusCode: '201',
                msg: 'Log genrated successfully.'
            });
        }
        ).catch((err) => {
            const currTime = new Date();

            console.error("=================================");
            console.error('logsessionaction api error');
            console.error('Time => ', currTime);
            console.error("Error => ", err);
            console.error("=================================");
            

            return res.status(400).json({
                status: 'failed',
                statusCode: '400',
                msg: 'Something went wrong, pls check logs.'
            });
        })
    } catch(error){
        const currTime = new Date();

        console.error("=================================");
        console.error('logsessionaction api error');
        console.error('Time => ', currTime);
        console.error("Error => ", error);
        console.error("=================================");

        return res.status(500).json({
            status: 'failed',
            statusCode: '500',
            msg: 'Something went wrong, pls check logs.'
        });
    }
}

export default authenticateJWT(logSessionAction)
