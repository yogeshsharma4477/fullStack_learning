import BusinessList from "@/components/businesslist";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateBussinessList } from "../store/Slices/bussinessSlice";
import { useRouter } from "next/router";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import { dc_db } from "./api/lib/dc_db";
import { haveSameParams, Android_CODE_ARR, IOS_CODE_ARR, fetchIP, removeRepetitiveQueryParams, sanitizeParamValue, sanitizeParams, verifyUserSID, genrateAccessToken } from '@/utils/commonFunc';
import clickTracker from "@/utils/clickTracker";
import Cookies from 'cookies'
import { trackingDashboardAPI } from "@/utils/api";

function ClickTrackerAPICall(sourceCode, type) {
  try{
      var curr_li = null;
      var curr_ll = null;
      if(type == 'PageLoad'){
          curr_li = 'Existing_Business_PL';
          curr_ll = 'NFL_LP';
      }
      if( !(curr_ll && curr_li) ) return;
      clickTracker({
          li: curr_li,
          ll: curr_ll,
          sourceCode: sourceCode,
      })
  } catch (error){
      console.error(`issue in ${type} click tracker call pls check error logs`);
      console.error(error);
  }
}

function BusinessListPage({ businessList, mobileNumber, JDSID, city, IP, referer, deviceid }) {
  const dispatch = useDispatch();
  const isLoaded = useRef(false)
  let returnComponent = null;
  const [processedBussinessList, setProcessedBussinessList] = useState([]);
  const router = useRouter();
  var sourceCode = sanitizeParams(router?.query?.source) || '77';

  dispatch(updateCommonValues({ key: "mobileNumber", value: mobileNumber }));
  const setBussinessList = async (businessList) => {
    let manuplatedBussinessListData = [];
    if (!businessList) return;
    businessList.map((e) => {
      let imgIcon = "//images.jdmagicbox.com/checkin/";
      imgIcon += `${e.data_city.toLowerCase()}`;
      imgIcon += "/";
      imgIcon += `${e.docid.toUpperCase()}`;
      imgIcon += ".jpg?clear= " + Math.random().toString();

      let formedAreaName = e.areaname;
      if (e.areaname && e.data_city) formedAreaName += ",";
      formedAreaName += e.data_city;

      manuplatedBussinessListData.push({
        name: e.compname,
        isVerified: !!e.paidstatus,
        address: formedAreaName,
        iconURL: imgIcon,
        city: e.data_city,
        docid: e.docid,
      });
    });
    setProcessedBussinessList(manuplatedBussinessListData);
    dispatch(
      updateBussinessList({
        key: "bussinessList",
        value: manuplatedBussinessListData,
      })
    );
    isLoaded.current = true;
  };

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
      let queryObj = {...router.query};
      
      queryObj.source = sourceVal;
      router.replace({
        pathname: '/bussinesslist',
        query: router?.query || {},
      })
    }

  }


  useEffect(() => {
    ClickTrackerAPICall(sourceCode, 'PageLoad')
    setSourceQuery();
    setBussinessList(businessList);
    if(JDSID){
      document.cookie = `sid=${JDSID}; domain=.justdial.com;`;
    }
    dispatch(updateCommonValues({ key: "ip", value: IP }));
  }, []);

  if (isLoaded.current) returnComponent = (

    <BusinessList
      bussinessList={processedBussinessList}
      mobileNumber={mobileNumber}
      JDSID={JDSID}
      city={city}
      referer={referer}
      deviceid={deviceid}
    />
  )
  return returnComponent;
}


export async function getServerSideProps(ctx) {
  const {req, query} = ctx;

  // const currURL=req.url;
  // const sanitizedURl = removeRepetitiveQueryParams(currURL);
  // const isReload = !haveSameParams(sanitizedURl, currURL);
  // if(isReload) {
  //   return {
  //       redirect: {
  //           destination: '' + sanitizedURl ,
  //           permanent: false, 
  //       },
  //   }
  // }
  const host = ctx.req.headers.host;
  const JWTToken = genrateAccessToken(host);
  if(JWTToken){
    let cookies = new Cookies(ctx.req, ctx.res)
    cookies.set("apitoken", JWTToken, {
      path: "/",
      domain: process.env.NODE_ENV=='development'?'.jdsoftware.jd':'.justdial.com',
      httpOnly: true,
    });
  }
  let userAgent = ctx.req.headers['user-agent'];
  let sourceVal = query?.source?query?.source?.toString():null;
  const refererLink = ctx?.req?.headers?.host || null;
  const isProduction = refererLink ? refererLink.includes('www.justdial.com') : false;
  //=====================================================================================
  const isMobileDevice = () => /iPhone|iPod|Android/i.test(userAgent);
  const IsMobile = sourceVal ? false : isMobileDevice();
  //=====================================================================================

if((sourceVal == '3' || sourceVal == '23' || sourceVal == '21' || sourceVal == '1' || sourceVal == '2' || sourceVal == '22' || IsMobile) && isProduction){
    let redirectionUrl = 'https://wap.justdial.com/free_listing.php?old=1&m=1';
    let queryParams = new URLSearchParams(query || {}).toString()
    // return {
    //   redirect: {
    //     destination: redirectionUrl+'&'+queryParams ,
    //     permanent: false, 
    //   },
    // };
  } else{
    if(!sourceVal){
      sourceVal = '77';
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        sourceVal = '2';
      }
    }
  }

  var bussinessListData
  let queryObjTemp = ctx?.query || {};
  if (queryObjTemp.source) {
    sourceVal = queryObjTemp['source'];
  } else {
    queryObjTemp['source'] = sourceVal;
  };
  let queryString = ''
  let count = 0;

  for (let key in queryObjTemp) {
    if (count == 0) {
      queryString += `?`
    } else if (count > 0) {
      queryString += `&`
    }
    queryString += `${key}=${queryObjTemp[key]}`
    count += 1;
  }


  let IP = fetchIP(ctx.req);
  var redirectObj = null

  try {
    ctx.req.headers["true-client-ip"] ||
    ctx.req.headers["x-forwarded-for"] ||
    ctx.req.headers["x-real-ip"] ||
    ctx.req.connection.remoteAddress;
    let referer = ctx.req.headers['referer'];
    const cookieObject = ctx.req?.cookies || {};
    let deviceid =
        sourceVal == "2" || sourceVal == "52"
            ? cookieObject["deviceId"]
            : cookieObject["_ctok"];
            deviceid=deviceid||null
    let userprofile = cookieObject["userProfile"];
    let userprofileObj = {}
    const sidFromHeader = req?.headers?.sid || null;
    const Curr_JDSID = cookieObject?.JDSID || cookieObject?.sid || sidFromHeader || null;
    
    try {
      userprofileObj = JSON.parse(userprofile)
    } catch (error) {
      console.log("error: " + error)
      userprofileObj = {}
    }
    const mobileNumberFromHeader = req?.headers?.mobile || null;
    let userMob = userprofileObj?.mobile || mobileNumberFromHeader|| '';
    let mobileNumberRegex = new RegExp(/^[6-9]\d{9}$/);
    let isValid = mobileNumberRegex.test(userMob)
    const isVerified = await verifyUserSID(Curr_JDSID, userMob);

    if (!isValid) {
      redirectObj = {
        permanent: false,
        destination: "/" + queryString,
      }
    } 
    else if(!isVerified) {
      redirectObj = {
        permanent: false,
        destination: "/" + queryString,
      }
    }
    let JDSIDVal = cookieObject["JDSID"];
    let city = cookieObject["main_city"] || "";
    let isDcNumber = false;
    if (sourceVal == '1' || sourceVal == '3') {
      await dc_db.query(`select * from justdial.tbl_dc_number where type='dce' and mobile=${userMob}`).then((result) => {
        if (result?.length) {
          isDcNumber = true;
          redirectObj = {
            permanent: false,
            // destination: "https://wap.justdial.com/free_listing.php?old=1&m=1" + queryString,
            destination: "/dc" + queryString,
          }
        }
      }).catch((err) => {
        console.error('Error=> ', err)
      })
    }
    if(!isDcNumber){
    const url = `http://${process.env.BUSSINESS_LIST_BASE_URL}/web_services/PhoneSearch.php?phone_nos=${userMob}&lme=1&limit=2000`;
    var bussinessListData = await axios
      .get(url)
      .then((res) => {
        let bussinessListArr = res?.data?.results || [];
        if (!bussinessListArr.length) {
          if (queryString.length) { queryString += '&isBussiness=false' }
          else {
            queryString += '?isBussiness=false'
          }
          redirectObj = {
            permanent: false,
            destination: "/Address" + queryString,
          }
        }
        return bussinessListArr
      })
      .catch((error) => {
        if (error?.data?.results?.length == 0 || error?.data?.error?.msg == 'No Data Found') {
          if (queryString.length) { queryString += '&isBussiness=false' }
          else {
            queryString += '?isBussiness=false'
          }
          redirectObj = {
            permanent: false,
            destination: "/Address" + queryString,
          }
        }
      });
    }

    let retunObj = {
      props: {
        businessList: bussinessListData || [],
        mobileNumber: userMob || '',
        IP: IP || '',
        JDSID: Curr_JDSID || '',
        city: city,
        referer: referer || null,
        deviceid: deviceid
      },
    }
    if (redirectObj) {
      retunObj.redirect = { ...redirectObj }
    }
    return retunObj;
  } catch (err) {

    console.error("error=>", err);
    return { props: { businessList: [], mobileNumber: '', IP: IP, JDSID: '' } };
  }
}

export default BusinessListPage;
