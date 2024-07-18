import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from "../styles/landing.module.scss"
import Breadcrum from '../components/Breadcrum'
import Businesslistfree from '../components/businesslistfree'
import Successstories from '../components/successstories'
import Businessliststep from '../components/businessliststep'
import Growbusiness from '../components/growbusiness'
import Gotquestion from '../components/gotquestion'
import Businessprofessional from '../components/businessprofessional'
import Createfreeaccount from '../components/createfreeaccount'
import Otppopup from '../components/otppopup'
import Landingfooter from '../components/landingFooter'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from "next/router";
import { parse } from 'cookie';
import axios from 'axios';
import FormData from 'form-data'
import Otp from '@/components/otp'
import { Android_CODE_ARR, IOS_CODE_ARR, MOBILE_NUMBER_REGEX, TOUCH_CODE_ARR, WEB_CODE_ARR, checkBot, checkProduction, clickTracker, fetchIP, fetchSourceCode, fetchUserProfileData, generateHotLead, generateRandomToken, generateSessionId, genrateAccessToken, getCookieValue, haveSameParams, objToQueryString, redirectToOldFlow, removeRepetitiveQueryParams, sanitizeParamValue, sanitizeParams, setCookie, setSourceCodeFromServerSide, set_cookie, verifyUserSID } from '@/utils/commonFunc';
import { updateCommonValues } from '@/store/Slices/commonDataSlice'
import { fetchUserData } from '@/utils/appFunctions'
import Cookies from 'cookies'
import { trackingDashboardAPI } from '@/utils/api'
import Seo from '@/components/seo'
import categories from '@/store/Slices/categories'
import Head from "next/head";
import excuteQuery from './api/lib/db_success_stories'

function Landingpage({ videoSchema, videos, JDSID, sinceDate, city, mobileNumberVal = null, referer, deviceid, isBussiness, IP ,categories}) {
  const router = useRouter()
  const [mobileNumber, setMobileNumber] = useState(mobileNumberVal)
  let cityParams = sanitizeParamValue(router?.query?.city);
  let jdlite = sanitizeParamValue(router?.query?.jdlite);
  let sourceVal = sanitizeParams(router?.query?.source) || null;
  const dispatch = useDispatch()
  let sourceCode = sanitizeParams(router?.query?.source) || null;
  const getSource = useSelector((state) => state.CommonValues?.getSource || "");
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  let chl = sanitizeParams(router?.query?.chl ) || ""
  let iro = sanitizeParams(router?.query?.iro ) || ""
  let meParams = router?.query?.me;
	meParams = sanitizeParams(meParams)
  
  const setSourceQuery = () => {
    let userAgent = navigator?.userAgent;
    const isBot = userAgent.match(/Googlebot/g) || userAgent.match(/AdsBot\-Google/g) || userAgent.match(/Google\-Adwords\-Instant/g) || userAgent.match(/bingbot/g);
    if(isBot) return;
    let sourceVal = sanitizeParams(router?.query?.source) || null;
    if(!sourceVal){
      sourceVal = '77'
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
          sourceVal = '2';
      }
      let queryObj = { ...router.query };
  
      queryObj.source = sourceVal;
      router.replace({
        pathname: router.pathname,
        query: queryObj,
      });
    }
  }

  const callLogSessionAction = async (sesionId) => {
    let url = '/api/v2/logsessionaction';
    let payload = {
      session_id: sesionId,
      device_id: deviceid,
      mobile: mobileNumber,
      referral: referer,
      li: 'NFL_LP',
      ll: 'New_FL_LP',
      sourceCode: sourceCode
    }
    await axios.post(url, {
      payload
    })
  }




  var sesionId = useSelector((state) => state.CommonValues?.sesionId || null);
  
  // let sourceCode = sanitizeParamValue(sanitizeParams(router?.query?.source)) || null;
  const ClickTrackerCall = (li, ll) => {
    if (sourceCode == null) {
      let device_userAgent = navigator.userAgent;
      if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          device_userAgent
          )
          ) {
            sourceCode = "2";
          } else {
            sourceCode = "77";
          }
    }
    clickTracker({
      sourceCode: sourceCode,
      li: li,
      ll: 'NFL_LP',
    });
  };
  
  function getSoruceNamefunction() {
    if (jdlite == 1 && sourceCode == 2) {
      return "jdlite"
    } else {
      return getSource[sourceCode]
    }
}

  useEffect(() => {
    dispatch(updateCommonValues({ key: "ip", value: IP || "" }));
      if(!window?.userToken){
        window.userToken = generateRandomToken()
      }
      checkLoggedTracker(mobileNumberVal,isBussiness)
      dispatch(updateCommonValues({ key: "ip", value: IP ? IP : "" }));
  }, [])




  useEffect(( ) => {
    if (typeof window !== 'undefined' && window.navigator) {
      navigator?.permissions?.query({ name: "geolocation" }).then((permissionStatus) => {
        console.log(`geolocation permission state is ${permissionStatus.state}`,permissionStatus);
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          console.log("coords",latitude,longitude)
        })
        permissionStatus.onchange = () => {
          console.log("changing permission")
        };
      });
    }
  },[])

  useEffect(() => {
    let trackingDataPayload = {
      source : sourceCode,
      clickType : 'load',
      IP :  IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile : mobileNumberVal || "",
      docid : "", 
      sessionId : sesionId || "" ,
      city : city || cityParams || ""
      }
    var tempSessionID = getCookieValue('sesionId');
    if(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)){
      if(!sesionId && tempSessionID) {
        dispatch(updateCommonValues({ key: "sesionId", value: tempSessionID || "" }));
        sesionId = tempSessionID
        // setCookie('sesionId', null)
      }
    }
    setSourceQuery();
    let localStorageCity = Array.isArray(JSON.parse(window?.localStorage?.getItem("recentLocation"))) ? JSON.parse(window?.localStorage?.getItem("recentLocation"))[0]?.city : null
    ClickTrackerCall('New_FL_LP', 'NFL_LP')
    let decodeNo = atob(meParams) || ""
    try {

      if (!sesionId) {
        generateSessionId().then((data) => {
          let payload = {
            number: mobileNumber || "",
            g_queue: "0",
            data_city: city ? city : cityParams ? cityParams : localStorageCity ? localStorageCity : "",
            session: data,
            platform: getSoruceNamefunction(),
            campaign_name: chl == 1 ? "campaign_freelisting_warm" :"new_free_listing_warm",
            data_source: chl == 1 ? 'campaign_freelisting_warm' : "Joinfree",
            link_location: "new_fl_pageload",
            message_template: sanitizeParamValue(router?.query?.message_template) || "",
            communication_channel: sanitizeParamValue(router?.query?.communication_channel) || "",
            customer_segment: sanitizeParamValue(router?.query?.customer_segment) || "",
          }
          if (mobileNumber) {
            generateHotLead(payload, true).then(resp => {
              // document.cookie = "isThroughLandingPage=true"
            })
          }else if(iro == '1' && decodeNo != ""){
            payload['number'] = decodeNo
            generateHotLead(payload, true).then(resp => {
              // document.cookie = "isThroughLandingPage=true"
            })
          }
          setCookie ('sesionId', data) 
          dispatch(updateCommonValues({ key: "sesionId", value: data ? data : "" }));
          trackingDataPayload = {...trackingDataPayload, sessionId : data}
          trackingDashboardAPI(trackingDataPayload,window.location.href || "");
          callLogSessionAction(data)
          return data;
        });
      } else {
        trackingDashboardAPI(trackingDataPayload,window.location.href || "");
        callLogSessionAction(sesionId)
      }
    } catch (e) {
      console.log(e, "error");
    }
    
    dispatch(updateCommonValues({ key: 'isThroughLandingPage', value: true })
    )

    dispatch(updateCommonValues({ key: "isBussiness", value: isBussiness }));
    dispatch(updateCommonValues({ key: "isVerified", value: mobileNumber }));

  }, []);

  const checkLoggedTracker =(mobileNumber,isBussiness) =>{
    if (mobileNumber ) {
        ClickTrackerCall("nfl_lp_loggedin","nfl_lp")
    }else{
        ClickTrackerCall("nfl_lp_nonloggedin","nfl_lp")
    }
  }

  const landingPageReduxData = useSelector((state) => {
    const { isShowOTP = false, moblieNumber = "" } = state?.landinfPageSlice || {};
    return {
      isShowOTP, moblieNumber
    }
  })

  const { isShowOTP, moblieNumber } = landingPageReduxData;

  return (
    <>
     <Head>
     {
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html:`${JSON.stringify(videoSchema)}`}}/>
      }
     </Head>
      <div className={`${styles.landing}`} id="mainContent">
        {!IOS_CODE_ARR?.includes(sourceVal) && !Android_CODE_ARR?.includes(sourceVal) ? <Breadcrum /> : null}
        <Businesslistfree
          city={city}
          LoggedInMobileNumber={mobileNumber}
          isBussiness={isBussiness}
        />
        <Successstories
          videoSchema={videoSchema}
          videos={videos}
          sinceDate={sinceDate}
          isBussiness={isBussiness}
          categories={categories}
        />
        <Businessliststep />
        <Growbusiness
          city={city}
          LoggedInMobileNumber={mobileNumber}
          isBussiness={isBussiness}
        />
        <Gotquestion />
        <Businessprofessional />
        <Createfreeaccount
          city={city}
          LoggedInMobileNumber={mobileNumber}
          isBussiness={isBussiness}
        />
        {isShowOTP ? 
          <Otppopup
            moblieNumber={moblieNumber}
            isBussiness={isBussiness}
            city={city}
          />
          : null}
        <Seo />
      </div>
      {!IOS_CODE_ARR?.includes(sourceVal) && !Android_CODE_ARR?.includes(sourceVal) ? <Landingfooter /> : null}
    </>
  )
}


function getRandomVideo(array = []){
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function getServerSideProps(context) {
  
  const {req, res, query} = context;
  const host = req.headers.host;
  const JWTToken = genrateAccessToken(host)
  const currPageURL = '/Free-Listing';
  const currentQueryStr = '?' + objToQueryString(query);
  const userAgent = req.headers['user-agent'];
  const currQuerySource = sanitizeParamValue(query?.source);
  const sanitizedURL = removeRepetitiveQueryParams(currentQueryStr)
  const isBot = checkBot(userAgent);
  const sourceCode = fetchSourceCode(currQuerySource, userAgent);  
  const isProduction = checkProduction(req);
  var isBussiness = false;
  var mobileNumber = null;
  const isQuerySanitized = haveSameParams(currentQueryStr, sanitizedURL)
  const sidFromHeader = req?.headers?.sid || null;
  var cookieObject = req?.cookies || {};
  const currJDSID = cookieObject?.JDSID || cookieObject?.sid || sidFromHeader || null;
  const userProfile = cookieObject["userProfile"] || {};
  const isFlowCheck = cookieObject['isFlow'] || 'false';
  const {mobile='', main_city=''} = fetchUserProfileData(userProfile, ['mobile', 'main_city']);
  const mobileNumberFromHeader = req?.headers?.mobile || null;
  const userMobileNumber = mobile || mobileNumberFromHeader;
  const city = cookieObject["main_city"] || "";
  let appVersion = sanitizeParamValue(query?.version) || ''
  let isStagingURL = req?.headers?.host?.includes('staging2.justdial.com');
  
  if((appVersion>=15.1 && appVersion <=15.6)  && sanitizeParamValue(sourceCode)=='3' && isStagingURL) {
      let queryString = objToQueryString(query);
      let formRedirectUrl = `https://www.justdial.com/free-listing?${queryString}`
      res.setHeader('Location', formRedirectUrl);
      res.statusCode = 302;
      res.end();
      return { props: {} };
  }


  function getCategory(obj) {
    let cat =[]
    for (const [key, value] of Object.entries(obj)) {
        let category = value?.hot_cat_info?.name ?? ""
        cat.push(category)
    }
    return cat
}


  let Videos = []
  let SinceDate = []
  let categories = []
  const referer = req.headers['referer'];
  let deviceid = (sourceCode == "2" || sourceCode == "52")  ? cookieObject["deviceId"]  : cookieObject["_ctok"];
  deviceid = deviceid || null
  var bussinessListArr = [];
  const isValidMobileNumber = MOBILE_NUMBER_REGEX.test(userMobileNumber);
  var isVerifiedUser = false;
  if(isValidMobileNumber) { isVerifiedUser = await verifyUserSID(currJDSID, userMobileNumber) };
  
  if((Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) && isProduction){
    return redirectToOldFlow(req, query, sourceCode)    
  }
  if((WEB_CODE_ARR.includes(sourceCode) || TOUCH_CODE_ARR.includes(sourceCode)) && !isBot) {
    if(!currQuerySource || !isQuerySanitized){
      setSourceCodeFromServerSide(res, currPageURL, query, sourceCode)
    }    
  }
  let IP = fetchIP(req);

  if(JWTToken){
    let cookies = new Cookies(req, res)
    cookies.set("apitoken", JWTToken, {
      path: "/",
      domain: process.env.NODE_ENV=='development'?'.jdsoftware.jd':'.justdial.com',
      httpOnly: true,
    });
  }

  if (isValidMobileNumber && isVerifiedUser) {
    if (Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) {
      let cookies = new Cookies(req, res)
      let currUserProfile = {}
      currUserProfile.mobile = userMobileNumber;
      currUserProfile = encodeURIComponent(JSON.stringify(currUserProfile))
      cookies.set("sid", currJDSID, {
        path: "/",
        httpOnly: false,
      });
      cookies.set("JDSID", currJDSID, {
        path: "/",
        httpOnly: true,
      });
      cookies.set("userProfile", currUserProfile, {
        path: "/",
        httpOnly: false,
      });
    }
    mobileNumber = userMobileNumber;
    const businessListApiURL = `http://${process.env.BUSSINESS_LIST_BASE_URL}/web_services/PhoneSearch.php`;
    const queryObj = {
      phone_nos: userMobileNumber,
      lme: 1, 
      limit: 2000,
    }
    try {
      const buisnessListRecord = await axios.get(businessListApiURL, {
        params: queryObj
      })
      if(buisnessListRecord?.data?.results?.length>0){
        bussinessListArr = buisnessListRecord;
        isBussiness = true;
      }
      if (buisnessListRecord?.data?.results?.length == 0 || buisnessListRecord?.data?.error?.msg == 'No Data Found') {
        isBussiness = false
      }
    } catch (error) {}
  }
  let data = new FormData();
  const refererLink = context?.req?.headers?.host || null;
  const isDevelopment = refererLink ? refererLink.includes("project01.anilkumar.jdsoftware.jd") : false;
let cityUrl = sanitizeParamValue(query?.city)
let videoCity = cookieObject?.main_city || cookieObject?.scity || cookieObject?.MP_city ||  cityUrl || "Mumbai"
const languageQuery = await excuteQuery({query:`SELECT * from tbl_success_stories_language where data_city= ?`,values:[videoCity]} )

const value = languageQuery[0]
let languages =[value?.priority_lng_1,value?.priority_lng_2,value?.priority_lng_3] // || ["English","Hindi","Bangali"]
languages = languages.join()

    data.append('hname', 'Success Videos');
    data.append('limit', 'all');
    data.append('debug', '0');
    data.append('city',videoCity)
    data.append('priority_flag', '1')
    data.append('language', `${languages}`)

const videoUrl = `http://snehamalvankar.jdsoftware.jd/cms_api/cms/cms/successStories`
        

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${videoUrl}`,
    headers: {
      ...data.getHeaders()
    },
    data: data
  };

  let response = await axios.request(config)
  Videos = response?.data?.results?.data;
  let randomVideo = priorityVideos(Videos,videoCity)



  let videoSchema =   {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "VideoObject",
        "name": `${randomVideo[0]?.company_name}`,
        "description": "A brief description of the first video",
        "thumbnailUrl": `${randomVideo[0]?.thumbnail}`,
        "uploadDate": "2023-11-25T12:00:00Z",
        "contentUrl": `${randomVideo[0]?.youtube_link}`
      },
      {
        "@type": "VideoObject",
        "name": `${randomVideo[1]?.company_name}`,
        "description": "A brief description of the second video",
        "thumbnailUrl": `${randomVideo[1]?.thumbnail}`,
        "uploadDate": "2023-11-26T12:00:00Z",
        "contentUrl": `${randomVideo[1]?.youtube_link}`
      },
      {
        "@type": "VideoObject",
        "name": `${randomVideo[2]?.company_name}`,
        "description": "A brief description of the second video",
        "thumbnailUrl": `${randomVideo[2]?.thumbnail}`,
        "uploadDate": "2023-11-26T12:00:00Z",
        "contentUrl": `${randomVideo[2]?.youtube_link}`
      }
    ]
  }
  

  function priorityVideos(videos = [],videoCity = "Mumbai"){
    let array = []
    const prioritized = [];
  const nonPrioritized = [];

  for (const obj of videos) {
    console.log("videos11",obj.priority,obj.city)
    if (obj.city === videoCity && obj.priority == 1) {
      prioritized.push(obj);
    } else {
      nonPrioritized.push(obj);
    }
  }

  array = getRandomVideo(prioritized)

  return array.concat(nonPrioritized);

  }


  function getCategory(obj) {
    let cat =[]
    for (const [key, value] of Object.entries(obj)) {
        let category = value?.hot_cat_info?.name ?? value?.new_catidlineage?.val[0][1] ?? ""
        cat.push(category)
    }
    return cat
}

  const docid_list = randomVideo.slice(0, 3).map(obj => obj?.docid);
  
  let cd = await axios.get(``)



  SinceDate = [...getDate(cd.data)]
  categories = [...getCategory(cd.data)]

  console.log("carrrrrr",categories)

  function getDate(obj) {
    let Since = [];
    for (const [key, value] of Object.entries(obj)) {
      const date1 = new Date(value.original_date);
      const date2 = new Date();
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const year = Math.floor(diffDays / 365);
      const month = Math.floor(Math.floor(diffDays % 365) / 30);
      if (year !== 0) {
        Since.push(year + 'y')
      } else if (month !== 0) {
        Since.push(month + 'm')
      } else {
        Since.push(diffDays + 'd') 
      }
    }
    return Since
  }

  return {
    props: {
      videoSchema: videoSchema,
      videos: randomVideo,
      sinceDate: SinceDate,
      city: city,
      IP: IP,
      mobileNumberVal: mobileNumber || null,
      referer: referer || null,
      deviceid: deviceid,
      JDSID: currJDSID,
      isBussiness : isBussiness,
      categories : categories
    }
  }
}

export default Landingpage;
