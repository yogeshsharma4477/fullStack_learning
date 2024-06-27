import authenticateJWT from "@/utils/middleware";
import axios from "axios";

async function hotlead(req, res) {
  try {
    const { data, sessionID, long, lat } = req.body;

    let url = process.env.HOTLEAD_API;
    let payload = {
      ...data,
      ...{
        lead_session_id: sessionID,
        filler1:{
          latitude:"",
          longitude:""
        },
        should_hold: 1,
        data_source: "adprogrograms",
        campaign_name: "adprogrograms",
        g_queue: 0,
      },
    };

    if(long) payload.filler1.longitude = long;
    if(lat) payload.filler1.latitude = lat;
    
    const response = await axios.post(url, payload);
    
    return res.status(200).json({ success: true, data: response.data });
  } 
  catch (error) {
    return res.status(500).json({ success: false });
  }
}


export default authenticateJWT(hotlead)
