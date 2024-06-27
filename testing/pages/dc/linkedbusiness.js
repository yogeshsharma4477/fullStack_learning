import React, { useEffect, useState } from 'react'
import Businesslinked from '@/components/DC/linkedBusiness'
import { useFetchDataFromDb } from '@/components/DC/useFetchDataFromDb'
import { Android_CODE_ARR, setSourceCodeFromServerSide, IOS_CODE_ARR, MOBILE_NUMBER_REGEX, TOUCH_CODE_ARR, WEB_CODE_ARR, checkBot, fetchIP, fetchSourceCode, fetchUserProfileData, haveSameParams, objToQueryString, removeRepetitiveQueryParams, sanitizeParamValue, verifyUserSID, sanitizeParams } from '@/utils/commonFunc';
import axios from 'axios';
import Cookies from 'cookies';
import { useRouter } from 'next/router';
import { handleDcLogData } from '@/components/DC/commonAPI';

export default function linkedbusiness(props) {
  useFetchDataFromDb()
  const { mobileNumberVal = "", sourceCode, city, IP, businessList = [] } = props

  const router = useRouter();
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""

  async function logWorker(type, docid = "") {
    let postLogValue = {
      sourceCode,
      lat,
      long,
      clickType: type,
      IP,
      mobile: mobileNumberVal,
      docid: docid,
      city: city || "",
      current_url: window.location.href,
      navigator: navigator.userAgent,
    }
    try {
      await handleDcLogData(postLogValue)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    logWorker("load").then(() => { }).catch(e => { console.log(e.message) })
  }, [])


  return (
    <Businesslinked loggedInMobile={mobileNumberVal} businessList={businessList} logWorker={logWorker} />
  )
}




export async function getServerSideProps(context) {

  const { req, res, query } = context;
  const currPageURL = '/Free-Listing/dc';
  const currentQueryStr = '?' + objToQueryString(query);
  const userAgent = req.headers['user-agent'];
  const currQuerySource = sanitizeParamValue(query?.source);
  const sanitizedURL = removeRepetitiveQueryParams(currentQueryStr)
  const isBot = checkBot(userAgent);
  let sourceCode = fetchSourceCode(currQuerySource, userAgent);
  var mobileNumber = null;
  const isQuerySanitized = haveSameParams(currentQueryStr, sanitizedURL)
  const sidFromHeader = req?.headers?.sid || null;
  var cookieObject = req?.cookies || {};
  const currJDSID = cookieObject?.JDSID || cookieObject?.sid || sidFromHeader || null;
  const dcToken = cookieObject?.dcToken || null;
  const userProfile = cookieObject["userProfile"] || {};
  const { mobile = '' } = fetchUserProfileData(userProfile, ['mobile', 'main_city']);
  const mobileNumberFromHeader = req?.headers?.mobile || null;
  const userMobileNumber = mobile || mobileNumberFromHeader;
  const city = cookieObject["main_city"] || "";
  const referer = req.headers['referer'];
  let deviceid = (sourceCode == "2" || sourceCode == "52") ? cookieObject["deviceId"] : cookieObject["_ctok"];
  deviceid = deviceid || null
  const isValidMobileNumber = MOBILE_NUMBER_REGEX.test(userMobileNumber);
  var isVerifiedUser = false;
  if (isValidMobileNumber) { isVerifiedUser = await verifyUserSID(currJDSID, userMobileNumber) };
  if ((WEB_CODE_ARR.includes(sourceCode) || TOUCH_CODE_ARR.includes(sourceCode)) && !isBot) {
    if (!currQuerySource || !isQuerySanitized) {
      setSourceCodeFromServerSide(res, currPageURL, query, sourceCode)
    }
  }
  let IP = fetchIP(req);

  console.log(dcToken, "dcTokendcTokendcTokendcTokendcTokendcToken");


  let queryObjTemp = context?.query || {};
  if (queryObjTemp.source) {
    sourceCode = queryObjTemp['source'];
  } else {
    queryObjTemp['source'] = sourceCode;
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

  if (isValidMobileNumber && isVerifiedUser) {
    if (Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) {
      const cookies = new Cookies(req, res)
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
  }


  let userMob = ""
  const refererLink = req?.headers?.host || null;
  const isProduction = refererLink ? refererLink.includes('www.justdial.com') : false;
  const isStaging = refererLink ? refererLink.includes('staging2.justdial.com') : false
  try {

    const hostUrl = `http://${process.env.HOST}:${process.env.PORT}`
    let localLink = isProduction ? `${hostUrl}${process.env.basePath}` : isStaging ? `https://development:lBYxltGQ95VAs@staging2.justdial.com/${process.env.basePath}` : `http://project01.anilkumar.jdsoftware.jd:9028/${process.env.basePath}`

    const response = await axios({
      method: "post",
      url: `${localLink}/api/v1/dc/getdcdetails`,
      data: { dcToken }
    });
    if (response?.data?.results[0]) {
      let data = response.data.results[0]
      userMob = data?.vendor_mobile_number?.split(',')[0]
    }
  } catch (error) {
    console.log(error?.message)
  }

  const url = `http://${process.env.BUSSINESS_LIST_BASE_URL}/web_services/PhoneSearch.php?phone_nos=${userMob}&lme=1&limit=2000`;
  const bussinessListData = await axios
    .get(url)
    .then((res) => {
      let bussinessListArr = res?.data?.results || [];
      return bussinessListArr
    })
    .catch((error) => {
      console.log("error", error.message)
    })

  if (!bussinessListData?.length) {
    return {
      redirect: {
        destination: '/dc/businessdetails' + queryString,
        permanent: false,
      },
    };

  }
  return {
    props: {
      businessList: bussinessListData || [],
      city: city,
      IP: IP,
      mobileNumberVal: mobileNumber || null,
      referer: referer || null,
      deviceid: deviceid,
      JDSID: currJDSID,
      sourceCode: sourceCode
    }
  }
}