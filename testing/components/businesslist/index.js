import React, { useEffect, useRef, useState } from "react";
import styles from "./businesslist.module.scss"
import { addNewBusiness, businessList } from "@/utils/string"
import BusinessListWrapper from "./BusinessListWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentComponent } from "@/redux/action/mainAction";
import { currentPage } from "@/store/Slices/CurrentCompoentSlice";
import { bussinessListApiCall, logSessionDetails, trackingDashboardAPI } from "@/utils/api";
import { updateBussinessList } from "@/store/Slices/bussinessSlice";
import { useRouter } from 'next/router'
import Image from "next/image";
import clickTracker from "@/utils/clickTracker";
import { hotleadApiCall } from "@/utils/api";
import { generateSessionId, generateHotLead, removeRepetitiveQueryParams, sanitizeParams, getCookieValue, Android_CODE_ARR, IOS_CODE_ARR, setCookie } from "@/utils/commonFunc";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import axios from 'axios';
import { updateMultipleOTPValues } from "@/store/Slices/landingPageSlice";
import { resetCategory } from "@/store/Slices/newCategorySlice";

const getDisplayLabels = () => {
  const title = businessList?.title || "We found the following business listings on Justdial which matches with the entered mobile number. Select one of the business to continue or create a new business listing"
  const add_new_business = businessList?.addNewBusiness || 'Add New Business'

  return { title, add_new_business }
}

const BusinessList = ({ bussinessList, mobileNumber, JDSID, city, deviceid, referral }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { title, add_new_business } = getDisplayLabels()
  const addNewBusinessButtonRef = useRef(null)
  const [loader, setLoader] = useState(false)
  var sesionId = useSelector((state) => state.CommonValues?.sesionId || "");
  const getSource = useSelector((state) => state.CommonValues?.getSource || "");
  const sourceCode = sanitizeParams(router?.query?.source)
  const cityParams = router?.query?.city;
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  let IP = useSelector((state) => state.CommonValues?.ip || "");
  let chl = sanitizeParams(router?.query?.chl) || ""

  const jdlite = router?.query?.jdlite
  const StoreCommonValueInfo = useSelector((state) => state.CommonValues);
  // const sessionID = useSelector((state) => state.CommonValues?.sesionId || "");

  useEffect(() => {
    let sourceVlaue = sanitizeParams(router?.query?.source);
    if (router?.query?.jdlite == 1) sourceVlaue = -1
    // logSessionDetails({
    //   mobile: mobileNumber,
    //   referral: 'referral',
    //   li: 'FL_Business_List',
    //   ll: 'FL_PageLoad',
    //   platform: sourceVlaue
    // })
  })



  const callLogSessionActionLoad = async () => {
    let url = '/api/v2/logsessionaction';
    let payload = {
      session_id: sesionId,
      device_id: deviceid,
      mobile: mobileNumber,
      referral: referral,
      li: 'NFL_LP',
      ll: 'FL_Business_List',
      sourceCode: sourceCode
    }
    await axios.post(url, {
      payload
    })
  }

  useEffect(() => {
    callLogSessionActionLoad()
    dispatch(resetCategory())
  }, [])

  const addNewBusinessFunc = async (e) => {
    setLoader(true)
    e.preventDefault();
    try {
      let trackingDataPayload = {
        source: sourceCode,
        clickType: 'click',
        IP: IP || "",
        trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
        mobile: mobileNumber || "",
        docid: "",
        sessionId: sesionId || "",
        city: city || cityParams || ""
      }
      await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    } catch (error) {
      console.log(error?.message)
    }


    callLogSessionAction()
    //click tracker implementaion
    clickTracker({
      sourceCode: sourceCode,
      li: 'FL_ANB',
      ll: 'FL_Business_List'
    })

    document.cookie = "isFlow= true"

    // let query = new URLSearchParams(router?.query || {}).toString()
    dispatch(updateCommonValues({ key: "isDirectLand", value: false }));
    // query = removeRepetitiveQueryParams(query)
    router.push({
      pathname: '/Address',
      query: router?.query || {},
    })
  }

  const subscribe = () => {
    addNewBusinessButtonRef.current.addEventListener('click', addNewBusinessFunc)
  }

  const ubsubscribe = () => {
    if (addNewBusinessButtonRef.current) addNewBusinessButtonRef.current.removeEventListener('click', addNewBusinessFunc)
  }

  function getSoruceNamefunction() {
    if (jdlite == 1 && sourceCode == 2) {
      return "jdlite"
    } else {
      return getSource[sourceCode]
    }
  }

  useEffect(() => {
    var tempSessionID = getCookieValue('sesionId');
    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'load',
      IP: IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile: mobileNumber || "",
      docid: "",
      sessionId: sesionId || "",
      city: city || cityParams || ""
    }
    if(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)){
      if(!sesionId && tempSessionID) {
        dispatch(updateCommonValues({ key: "sesionId", value: tempSessionID || "" }));
        sesionId = tempSessionID
      }
    }
    // if (StoreCommonValueInfo.isDirectLand) {}
    let isSessionIdCalled = false
    let localStorageCity = Array.isArray(JSON.parse(window?.localStorage?.getItem("recentLocation"))) ? JSON.parse(window?.localStorage?.getItem("recentLocation"))[0]?.city : null
    // if (getCookie("isThroughLandingPage") === undefined || JSON.parse(getCookie("isThroughLandingPage")) === false) {
    if (!StoreCommonValueInfo.isThroughLandingPage) {
      if (sesionId) {
        let payload = {
          number: mobileNumber,
          g_queue: "0",
          data_city: city ? city : cityParams ? cityParams : localStorageCity ? localStorageCity : "",
          session: sesionId,
          platform: getSoruceNamefunction(),
          campaign_name: chl==1 ? "campaign_freelisting_warm" :"new_free_listing_warm",
          link_location: "new_fl_pageload",
          message_template: router?.query?.message_template || "",
          communication_channel: router?.query?.communication_channel || "",
          customer_segment: router?.query?.customer_segment || "",
        }
        trackingDashboardAPI(trackingDataPayload, window.location.href || "");
        generateHotLead(payload, true).then(resp => {
          dispatch(updateCommonValues({ key: 'isThroughLandingPage', value: true }))
          // document.cookie = "isThroughLandingPage=true"
        })
      } else {
        isSessionIdCalled = true
        generateSessionId().then(data => { 
          dispatch(updateCommonValues({ key: "sesionId", value: data ? data : "" }));
          let payload = {
            number: mobileNumber,
            g_queue: "0",
            data_city: city ? city : cityParams ? cityParams : localStorageCity ? localStorageCity : "",
            session: data,
            platform: getSoruceNamefunction(),
            campaign_name: chl ==1 ? "campaign_freelisting_warm" : "new_free_listing_warm",
            link_location: "new_fl_pageload",
            message_template: router?.query?.message_template || "",
            communication_channel: router?.query?.communication_channel || "",
            customer_segment: router?.query?.customer_segment || "",
          }
          generateHotLead(payload, true).then(resp => {
            dispatch(updateCommonValues({ key: 'isThroughLandingPage', value: true }))
            // document.cookie = "isThroughLandingPage=true"
          })
          trackingDataPayload = {...trackingDataPayload, sessionId : data}
          trackingDashboardAPI(trackingDataPayload, window.location.href || "");
        })
      }
    }

    if (!sesionId && !isSessionIdCalled) { 
      generateSessionId().then(data => {
        trackingDataPayload = {...trackingDataPayload, sessionId : data}
        dispatch(updateCommonValues({ key: "sesionId", value: data ? data : "" }));
        trackingDashboardAPI(trackingDataPayload, window.location.href || "");
      })
    }

    if(sesionId){
      trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    }

    document.body.classList.remove("bodyfixed");
    document.getElementsByTagName('html')[0].className = ""
    subscribe()
    return ubsubscribe
  }, [])

  const handlePopState = () => {
    dispatch(updateMultipleOTPValues({ isShowOTP: false, }))
    // router.back();
    // if (sourceCode == '1' || sourceCode == '3') {
    //   window.location.href = 'https://jdext.php';
    // } else {
    //   // window.history.go(-1)
    //   router.back();
    // }
  }

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const callLogSessionAction = async () => {
    let url = '/api/v2/logsessionaction';
    let payload = {
      session_id: sesionId,
      device_id: deviceid,
      mobile: mobileNumber,
      referral: referral,
      li: 'FL_ANB',
      ll: 'FL_Business_List',
      sourceCode: sourceCode
    }
    await axios.post(url, {
      payload
    })
  }

  return (
    <div className="container__inner" id="mainContent">
      <div className={`container__inner__left`}>
        <div className={`left__img`}>
          <Image
            fill
            src={'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/business_detail_2x_new.png'}
            alt={"Business Listing Image"}
            title="Business Listing Image"
          />
        </div>
      </div>
      <div className={`container__inner__right`}>
        <div className={`form-wrapper`}>
          <p className={`${styles.title} color111 fw600 pl-10`}>{'Select your business'}</p>
          <BusinessListWrapper IP={IP} referral={referral} deviceid={deviceid} data={bussinessList} JDSID={JDSID} getSoruceNamefunction={getSoruceNamefunction} />
          {/* {!loader ? (
          <button className={`${styles.primarybutton} primarybutton`} ref={addNewBusinessButtonRef}>
            {add_new_business}
          </button>
        ) : (
          <button className={`${styles.primarybutton} primarybutton`}>
            <span className="primarybutton--loader" />
          </button>
        )} */}
        </div>
        {!loader ?
          <button aria-label={add_new_business}
            className={`primarybutton fw500 ripple mt-10 ${styles.submit_btn}`}
            ref={addNewBusinessButtonRef}
          >
            {add_new_business}
          </button>
          :
          <button aria-label="Button Loader"
            disabled
            className={`primarybutton mt-10 ${styles.submit_btn}`}
          >
            <span className='btn-loader' />
          </button>
        }
      </div>
    </div>
  )
}

export default BusinessList;
