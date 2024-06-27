import React, { useEffect, useState } from 'react'
import Businessdetails from '@/components/DC/businessDetails'
import { useFetchDataFromDb } from '@/components/DC/useFetchDataFromDb'
import { Android_CODE_ARR, setSourceCodeFromServerSide, IOS_CODE_ARR, MOBILE_NUMBER_REGEX, TOUCH_CODE_ARR, WEB_CODE_ARR, checkBot, fetchIP, fetchSourceCode, fetchUserProfileData, haveSameParams, objToQueryString, removeRepetitiveQueryParams, sanitizeParamValue, verifyUserSID, sanitizeParams } from '@/utils/commonFunc';
import Cookies from 'cookies';
import { useRouter } from 'next/router';
import { handleDcLogData } from '@/components/DC/commonAPI';

export default function businessdetails(props) {
  useFetchDataFromDb()

  const { mobileNumberVal, sourceCode, city, IP } = props

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
    <Businessdetails loggedInMobile={mobileNumberVal} IP={IP} logWorker={logWorker} />
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
  const sourceCode = fetchSourceCode(currQuerySource, userAgent);
  var mobileNumber = null;
  const isQuerySanitized = haveSameParams(currentQueryStr, sanitizedURL)
  const sidFromHeader = req?.headers?.sid || null;
  var cookieObject = req?.cookies || {};
  const currJDSID = cookieObject?.JDSID || cookieObject?.sid || sidFromHeader || null;
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

  return {
    props: {
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