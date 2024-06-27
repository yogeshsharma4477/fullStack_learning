import React, { useEffect, useState } from "react";
import Addphoto from "@/components/addphoto";
import { useRouter } from "next/router";
import { sanitizeParams } from "@/utils/commonFunc";
import { useSelector } from "react-redux";
import { handleDcLogData } from "@/components/DC/commonAPI";

const AddphotoPage = (props) => {

  const { IP, mobileNumberVal } = props
  const router = useRouter();

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

  useEffect(() => {
    document.cookie = "isFlow = false";
    document.cookie = "fromPhoto = true";
  }, [])

  return (
    <Addphoto
      sid={props.sid}
      userProfile={props}
      city={props?.city}
      logWorker={logWorker}
    />
  );
};

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  function isDirectLoad(request) {
    return !request.headers.referer;
  }
  function redirectTo(location) {
    res.setHeader('Location', location);
    res.statusCode = 302;
    res.end();
  }

  /* This code is checking the user agent string of the incoming request and setting the `sourceVal`
  variable to either `'7'` or `'2'` based on whether the user agent string matches a regular
  expression pattern that identifies mobile devices. If the user agent string matches the pattern,
  `sourceVal` is set to `'2'`, otherwise it is set to `'7'`. */
  let userAgent = ctx.req.headers['user-agent']
  let sourceVal = '77'
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    sourceVal = '2';
  }

  /* This code is creating a query string based on the `ctx.query` object. It first initializes an
  empty object `queryObjTemp` if `ctx.query` is undefined or null. Then it initializes an empty
  string `queryString`. It then loops through each key in `queryObjTemp` and checks if the key is
  equal to `'source'`. If it is, it adds the key-value pair to the `queryString`. If the value of
  `'source'` is not defined, it uses the `sourceVal` variable instead. The resulting `queryString`
  will be used in a redirect later in the code. */
  let queryObjTemp = ctx?.query || {};
  let queryString = ''
  let count = 0;
  for (let key in queryObjTemp) {
    if (count == 0) {
      queryString += `?`
    } else if (count > 0) {
      queryString += `&`
    }
    if (key === 'source') {
      if (queryObjTemp[key]) {
        queryString += `${key}=${queryObjTemp[key]}`
      } else {
        queryString += `${key}=${sourceVal}`
      }
    }
    count += 1;
  }

  /* This code is handling server-side rendering and setting up cookies for the page. */
  const cookieObject = ctx.req?.cookies || {};
  let sid = cookieObject["sid"] || cookieObject['JDSID'] || '';
  let isFlowCheck = cookieObject['isFlow'] || 'false'

  /* This code is checking if the `userProfile` cookie is present in the request object (`ctx.req`) and
  if it is not present, it redirects the user to the `/Free-Listing` page. */
  if (!ctx.req?.cookies?.userProfile) {
    ctx.res.writeHead(302, {
      Location: '/Free-Listing' + queryString
    });
    ctx.res.end()
  }

  if (isDirectLoad(req)) {
    redirectTo('/Free-Listing/dc' + queryString);
  }

  let mobileNumber = ""
  let city = ""
  try {
    const cookieObject = ctx.req?.cookies || {};
    let userprofile = cookieObject["userProfile"];
    if (userprofile) userprofile = JSON.parse(userprofile)
    mobileNumber = userprofile?.mobile || ""
    city = cookieObject["main_city"] ? cookieObject["main_city"] : "";
    return ({ props: { mobileNumber: mobileNumber, userprofile: userprofile, sid: sid, city: city } })
  }
  catch (err) {
    console.error("error=>", err)
    return ({ props: { mobileNumberVal: mobileNumber, sid: sid } })
  }
}
export default AddphotoPage;
