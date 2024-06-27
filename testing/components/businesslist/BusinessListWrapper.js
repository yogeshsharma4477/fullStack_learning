import React, { useEffect } from "react";
import BusinessTile from "./BusinessTile";
import styles from "./businesslist.module.scss"
import { common } from "@/utils/string"
import { editListingApiCall, trackingDashboardAPI } from "@/utils/api";
import { useRouter } from "next/router";
import clickTracker from "@/utils/clickTracker";
import { useDispatch, useSelector } from "react-redux";
import { Android_CODE_ARR, IOS_CODE_ARR, delete_cookie, generateHotLead, generateSessionId, sanitizeParams } from "@/utils/commonFunc";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import axios from 'axios'
import { appRedirection } from "@/utils/appFunctions";

const getDisplayLabels = () => {
  const or = common?.or || 'OR'

  return { or, }
}


const editListingFunctionCall = async (e, dispatch, data, sourceCode = null, router, mobileNumber, JDSID, sesionId, getSoruceNamefunction, message_template, communication_channel, customer_segment, IP="", lat, long,chl= "") => {
  
  e.preventDefault();
  let tempSesionId = sesionId;
  if (!tempSesionId) {
    console.log(tempSesionId, "inside1");
    await generateSessionId().then(data => {
      tempSesionId = data || ''
      console.log(tempSesionId, data, "inside2");
      dispatch(updateCommonValues({ key: "sesionId", value: tempSesionId}));
    })
  }
  let url = '';
  if (window.location.host.includes('www.justdial.com')) {
    url = 'https://www.justdial.com/jd-business';
  } else {
    url = 'https://development:lBYxltGQ95VAs@staging2.justdial.com/jd-business';
  }
  let queryParams = `?source=${sourceCode}&wap=${sourceCode}&docid=${data.docid}&module=free_listing`
  url += queryParams;
  
  let hotleadPayload = {
    number: mobileNumber,
    docid: data.docid,
    session: tempSesionId,
    data_city: data.city ? data.city : "",
    platform: getSoruceNamefunction(),
    campaign_name: chl == 1 ? "campaign_freelisting_hot" : "new_free_listing_hot",
    data_source: chl == 1 ? 'campaign_freelisting_hot' : "Joinfree",
    link_location: "new_fl_existing_business_selection",
    message_template: message_template,
    communication_channel: communication_channel,
    customer_segment: customer_segment
  }
  
  console.log(hotleadPayload, "inside3");


  clickTracker({
    sourceCode: sourceCode,
    li: 'FL_EBL',
    ll: 'FL_Business_List'
  })

  try {
    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'click',
      IP: IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile: mobileNumber || "",
      docid: data.docid,
      sessionId: tempSesionId || "",
      city: data.city,
      li : "existing_business"
    }
    await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
  } catch (error) {
    console.log(error?.message)
  }

  await generateHotLead(hotleadPayload,false).then(() => { 
    if(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) {
      delete_cookie("sesionId")
      dispatch(updateCommonValues({ key: "sesionId", value: null }));
      appRedirection(url+'&hide_header=1', sourceCode)
    } else {
      window.location.assign(url) 
    }
  }).catch((err) => {
    console.log(err)
    if(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) {
      delete_cookie("sesionId")
      dispatch(updateCommonValues({ key: "sesionId", value: null }));
      appRedirection(url+'&hide_header=1', sourceCode)
    }  else {
      window.location.assign(url) 
    }
  })

  //click tarcker call 

  // window.location.assign(url)
}

const BusinessListWrapper = ({ data, JDSID, getSoruceNamefunction, deviceid, referral, IP }) => {
  const dispatch = useDispatch()
  const router = useRouter();
  let message_template = router?.query?.message_template || ""
  let communication_channel = router?.query?.communication_channel || ""
  let customer_segment = router?.query?.customer_segment || ""
  const sourceCode = sanitizeParams(router?.query?.source)
  let chl = sanitizeParams(router?.query?.chl) || ""
  let BusinessList = data;
  const mobileNumber = useSelector(
    (state) => state.CommonValues?.mobileNumber || ""
  );
  const sesionId = useSelector((state) => state?.CommonValues?.sesionId || "");

  const { or } = getDisplayLabels()


  function addSpaceAfterComma(s) {
    return s.replace(",", ", ")
  }

  const callLogSessionAction = async () => {
    let url = '/api/v2/logsessionaction';
    let payload = {
      session_id: sesionId,
      device_id: deviceid,
      mobile: mobileNumber,
      referral: referral,
      li: 'FL_EBL',
      ll: 'FL_Business_List',
      sourceCode: sourceCode
    }
    await axios.post(url, {
      payload
    })
  }
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""

  return (
    <>
      <div id="el_form"></div>
      <ul className={`${styles.business__list}`}>
        {
          BusinessList.map((business, index) => {
            return (
              <li aria-label={business.name} tabIndex="0" className={'ripple pl-10'} key={index} onClick={async (e) => {
                await callLogSessionAction()
                editListingFunctionCall(e, dispatch, business, sourceCode, router, mobileNumber, JDSID, sesionId, getSoruceNamefunction, message_template, communication_channel, customer_segment, IP, lat, long,chl)
              }}>
                <BusinessTile
                  id={`${business.name}_${index}`}
                  iconURL={business.iconURL}
                  businessName={business.name}
                  businessAddress={addSpaceAfterComma(business.address)}
                  isVerified={business.isVerified}
                  docid={business.docid}
                />
              </li>
            )
          })
        }
      </ul>
      {BusinessList.length ? <div className={`${styles.or} color1a1 font15 mt-25 mb-25`}>{or}</div> : null}
    </>
  )
}

export default BusinessListWrapper;