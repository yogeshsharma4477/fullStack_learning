import axios from "axios";
import excuteQuery from "../lib/db_hotlead_log";
import authenticateJWT from "@/utils/middleware";

async function LogHotleadCall (payload, isProduction){
    try{
        if(!isProduction){
            return;
        }
        let url = !isProduction ? process.env.V2.HOTLEAD_API : process.env.HOTLEAD_API

        const moduleName = 'Free Lisiting New';
        const logValues = [
            payload.docid || '', 
            url, 
            'POST', 
            payload?.resData || '', 
            payload?.reqData || '', 
            payload?.dataSource || 'Free Listing',
            payload?.platformName || 'web', 
            moduleName, 
            payload?.mobile,
            payload?.sessionID,
            payload?.responseTime || ''
        ];
        const queryStatement = 'INSERT INTO tbl_hotleads_log (docid, url, method, params, response, source, platform, module, mobile, sessionid, response_time) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        const res = await excuteQuery({
                query: queryStatement, 
                values: logValues
            })
    }
    catch(err){
        const currTime = new Date();
        console.error("=================================");
        console.error('hotlead log query error');
        console.error('Time => ', currTime);
        console.error("Error => ", err);
        console.error("=================================");
    }
}

async function GetPincodeLocation(req, res) {
    const { communication_channel = '', customer_segment = '', message_template = '', data_source = 'Joinfree', campaign_name = null, city = null, g_queue = '1', company_name = null, docid = null, number = null, link_location = null, platform = null, data_city = '', session = '',event_date ="" } = req?.body || {}
    let payload = new Object();
    try {
        const startTime = new Date();
        const isProduction  = req?.headers?.referer?.includes('www.justdial.com') || false;
        const url = !isProduction ? process.env.V2.HOTLEAD_API : process.env.HOTLEAD_API

        console.log("payload",payload)

        payload['g_queue'] = g_queue;
        payload['lead_session_id'] = session;
        payload['campaign_name'] = campaign_name;
        payload['data_city'] = data_city;
        payload['data_source'] = data_source;
        payload['communication_channel'] = communication_channel;
        payload['customer_segment'] = customer_segment;
        payload['message_template'] = message_template;
        payload['event_date']=event_date;
        if (number) payload['mobile1'] = number;
        if (link_location) payload['link_location'] = link_location;
        if (platform) payload['platform'] = platform;
        if (city) payload['city'] = city;
        if (docid) payload['docid'] = docid;
        if (company_name) payload['company_name'] = company_name;

        axios.post(url, payload).then(async function (response) {
            if (response?.data?.error == 0) {
                const endTime = new Date();
                let apiResponceTime = ''
                try{
                    apiResponceTime = (endTime - startTime)
                } catch(e){
                    console.error("=================================");
                    console.error('hotlead log query error');
                    console.error('Time => ', currTime);
                    console.error("Error => ", e);
                    console.error("=================================");
                }
                let LogHotleadCallPayload = {
                    docid: docid,
                    resData: JSON.stringify(payload || {}),
                    reqData: JSON.stringify(response?.data || {}),
                    dataSource: campaign_name, 
                    platformName: platform?.toString().replace(/ /g, '_'),
                    mobile: number,
                    sessionID: session,
                    responseTime: apiResponceTime
                }
                await LogHotleadCall(LogHotleadCallPayload, isProduction);
                return res.status(200).send({
                    data: { msg: response.data.message },
                    detail: response.data,
                    status: 1
                })
            }
            else {
                return res.status(400).send({
                    data: { msg: 'hotlead is not genrated genrated.' },
                    detail: response.data,
                    status: 0
                })
            }
        })
            .catch(function (err) {
           
                return res.status(400).send({
                    data: { msg: 'hotlead is not genrated genrated.' },
                    detail: err.message,
                    status: 0
                })
            })

    } catch (error) {
        
        console.log("hotlead genration api error", error)
        return res.status(500).send({
            data: { msg: 'Something went wrong' },
            status: 0
        })
    }
}

export default authenticateJWT(GetPincodeLocation)

