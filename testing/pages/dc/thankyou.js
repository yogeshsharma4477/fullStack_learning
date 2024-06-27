import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../../styles/dcthankyou.module.scss'
import { Android_CODE_ARR, setSourceCodeFromServerSide, IOS_CODE_ARR, MOBILE_NUMBER_REGEX, TOUCH_CODE_ARR, WEB_CODE_ARR, checkBot, fetchIP, fetchSourceCode, fetchUserProfileData, haveSameParams, objToQueryString, removeRepetitiveQueryParams, sanitizeParamValue, verifyUserSID, sanitizeParams } from '@/utils/commonFunc';
import { useRouter } from 'next/router'
import Cookies from 'cookies';
import { useSelector } from 'react-redux';
import { handleDcLogData } from '@/components/DC/commonAPI';

export default function businessdetails(props) {
  const { mobileNumberVal, IP } = props
  const router = useRouter()

  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  let sourceCode = sanitizeParams(router?.query?.source) || ""
  const docid = useSelector((state) => state.CommonValues?.docid || '')
  const city = useSelector(state => state?.dcLandingSlice?.city || '')
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
    logWorker("load", docid || "").then(() => { }).catch(e => { console.log(e.message) })
  }, [])

  async function handleRedirect() {
    try {
      await logWorker("click", docid || "")
    } catch (error) {
      console.log(error.message)
    }
    window.location.href = '/Free-Listing/dc' + window.location.search
  }
  return (
    <div className={`p-20 ${styles.thankyou}`} onClick={handleRedirect}>
      <header>
        <button className={`transparentButton iconwrap closeicon`} />
      </header>
      <section>
        <Image width={45} height={45} alt="Thank You" src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/Successful.svg" />
        <h3 className={`font18 fw500 mt-26 mb-16 ${styles.title}`}>Thank You Page</h3>
        <p className={`color1a1 font14`}>We have received your information. This will appear on our platform in the next 24-48 hours</p>
        <button className={`primarybutton mt-20`} onClick={handleRedirect}>Continue</button>
      </section>
    </div>
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
    }
  }
}