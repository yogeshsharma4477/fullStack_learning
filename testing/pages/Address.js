import React, { useEffect } from 'react'
import Address from '../components/address/index' 
import axios from 'axios'
import { useRouter } from "next/router";
import { updateMultipleCommonValues } from "@/store/Slices/commonDataSlice";
import { useDispatch } from "react-redux";
import { updateCommonValues } from '@/store/Slices/commonDataSlice'
import { Android_CODE_ARR, DCRedirect, IOS_CODE_ARR, MOBILE_NUMBER_REGEX, TOUCH_CODE_ARR, WEB_CODE_ARR, checkBot, checkProduction, fetchIP, fetchSourceCode, fetchUserProfileData, genrateAccessToken, hasAnyBusiness, haveSameParams, redirectFromServerSide, redirectToOldFlow, removeRepetitiveQueryParams, sanitizeParamValue, sanitizeParams, senatizeURL, setSourceCodeFromServerSide, verifyUserSID } from '@/utils/commonFunc';
import { updateMultipleOTPValues } from '@/store/Slices/landingPageSlice';
import clickTracker from '@/utils/clickTracker';
import { dc_db } from './api/lib/dc_db';
import Cookies from 'cookies';
import { parse } from 'cookie';


function ClickTrackerAPICall(sourceCode, type) {
    try{
        var curr_li = null;
        var curr_ll = null;
        if(type == 'PageLoad'){
            curr_li = 'Business_Detail_PL';
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

function AddressPage(props) {
    const router = useRouter()
    const dispatch = useDispatch();
    let {mobileNumber, JDSID, IP, isHasBusiness } = props
    var sourceCode = sanitizeParams(router?.query?.source) || '77';


    const handlePopState = () => {
        dispatch(updateMultipleOTPValues({ isShowOTP: false, }))
    }
    
    

    useEffect(() => {
        ClickTrackerAPICall(sourceCode, 'PageLoad');
        dispatch(updateCommonValues({ key: 'isCopyright_infringement', value: false }))
        dispatch(updateCommonValues({ key: 'ip', value: IP }))
        try{
            document.body.classList.remove("bodyfixed");
            document.getElementsByTagName('html')[0].className = ""
        } catch (err) {
            console.error("error=>", err)
        }
        window.addEventListener("popstate", handlePopState);
    
        return () => {
          window.removeEventListener('popstate', handlePopState)
        }
      }, [])

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
            let queryObj = router.query;
            queryObj.source = sourceVal;
            router.replace({
                pathname: '/Address',
                query: queryObj
            })
        }

    }

    useEffect(() => {
        let isSourcePresent = sanitizeParams(router?.query?.source)?.length || false
        setSourceQuery();
        dispatch(
            updateMultipleCommonValues({
                mobileNumber: mobileNumber
            })
        )
        document.cookie = `sid=${JDSID}`
    }, []);
    return (
        <Address
            userProfile={props}
            isHasBusiness={isHasBusiness}
            city={props.city}
        />
    )
}

export async function getServerSideProps(ctx) {
    const {req, res, query} = ctx;
    const host = req.headers.host;
    const JWTToken = genrateAccessToken(host);
    if(JWTToken){
        let cookies = new Cookies(req, res)
        cookies.set("apitoken", JWTToken, {
        path: "/",
        domain: process.env.NODE_ENV=='development'?'.jdsoftware.jd':'.justdial.com',
        httpOnly: true,
        });
    }
    const currPageURL = '/Free-Listing/Address';
    const mainHomePageURL = '/Free-Listing/';
    const businessListPageURL = '/Free-Listing/bussinesslist'
    const userAgent = req.headers['user-agent'];
    let IP = fetchIP(req);
    const currQuerySource = sanitizeParamValue(query?.source);
    const sourceCode = fetchSourceCode(currQuerySource, userAgent);  
    const isProduction = checkProduction(req);
    const isBot = checkBot(userAgent);
    
    var cookieObject = req?.cookies || {};
    const sidFromHeader = req?.headers?.sid || null;
    const currJDSID = cookieObject?.JDSID || cookieObject?.sid || sidFromHeader || null;
    const userProfile = cookieObject["userProfile"] || {};
    const isFlowCheck = cookieObject['isFlow'] || 'false';
    const {mobile='', main_city=''} = fetchUserProfileData(userProfile, ['mobile', 'main_city']);
    const mobileNumberFromHeader = req?.headers?.mobile || null;
    const userMobileNumber = mobile || mobileNumberFromHeader;
    const city = cookieObject["main_city"] || "";
    const isValidMobileNumber = MOBILE_NUMBER_REGEX.test(userMobileNumber);
    var isVerifiedUser = false;
    if(isValidMobileNumber) { isVerifiedUser = await verifyUserSID(currJDSID, userMobileNumber) };
    // if(isFlowCheck){
    //     redirectFromServerSide(res, businessListPageURL, query, sourceCode)
    // }
    if(!isValidMobileNumber || !isVerifiedUser) {
        setSourceCodeFromServerSide(res, mainHomePageURL, query, sourceCode)
    }
    const isHasBusiness = await hasAnyBusiness(userMobileNumber);        

    if((Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) && isProduction){
        return redirectToOldFlow(req, query, sourceCode)    
    }

    if(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)){
        var DCRecord=['null'];
        try{
            DCRecord = await dc_db.query(`select * from justdial.tbl_dc_number where type='dce' and mobile=${userMobileNumber}`);
        } catch(e){
            console.log(e)
        }
        const isDCFlow = DCRecord?.length>1
        if(isDCFlow) {
            // return DCRedirect(query)
        }
    }
    // if(!currQuerySource && !isBot && !(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode))){
    //     setSourceCodeFromServerSide(res, currPageURL, query, sourceCode)
    // }
//     let sourceVal = query?.source?query?.source?.toString():null;
//     const refererLink = ctx?.req?.headers?.host || null;
//     const isProduction = refererLink ? refererLink.includes('www.justdial.com') : false;
//   //=====================================================================================
//   const isMobileDevice = () => /iPhone|iPod|Android/i.test(userAgent);
//   const IsMobile = sourceVal ? false : isMobileDevice();
//   //=====================================================================================
  
// if((sourceVal == '3' || sourceVal == '23' || sourceVal == '21' || sourceVal == '1' || sourceVal == '2' || sourceVal == '22' || IsMobile) && isProduction){
//     let redirectionUrl = 'https://wap.justdial.com/free_listing.php?old=1&m=1';
//     let queryParams = new URLSearchParams(query || {}).toString()
//     // return {
//     //   redirect: {
//     //     destination: redirectionUrl+'&'+queryParams ,
//     //     permanent: false, 
//     //   },
//     // };
//   } else{
//     if(!sourceVal){
//       sourceVal = '77';
//       if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
//         sourceVal = '2';
//       }
//     }
//   }
//     let queryObjTemp = ctx?.query || {};
//     if (queryObjTemp.source) { 
//         sourceVal = queryObjTemp['source'];
//     } else {
//         queryObjTemp['source'] = sourceVal;
//     };
//     let queryString = ''
//     let count = 0;

//     for (let key in queryObjTemp) {
//         if (count == 0) {
//             queryString += `?`
//         } else if (count > 0) {
//             queryString += `&`
//         }
//         queryString += `${key}=${queryObjTemp[key]}`
//         count += 1;
//     }

//     try {
//         ctx.req.headers["x-forwarded-for"] ||
//             ctx.req.headers["x-true-client-ip"] ||
//             ctx.req.headers["x-real-ip"] ||
//             ctx.req.connection.remoteAddress;
//         const cookieObject = ctx.req?.cookies || {};
//         const Curr_JDSID = cookieObject?.JDSID || cookieObject?.sid || null;
//         let userprofile = cookieObject["userProfile"];
//         let isFlowCheck = cookieObject['isFlow'] || 'false';
//         let userprofileObj = {}
//         try {
//             userprofileObj = JSON.parse(userprofile)
//         } catch (error) {
//             console.log("error: " + error)
//             userprofileObj = {}
//         }

//         let userMob = userprofileObj?.mobile || '';
//         let mobileNumberRegex = new RegExp(/^[6-9]\d{9}$/);
//         let isValid = mobileNumberRegex.test(userMob)
//         let JDSIDVal = cookieObject["JDSID"];
//         let city = cookieObject["main_city"] ? cookieObject["main_city"] : "";

//       const isVerified = await verifyUserSID(Curr_JDSID, userMob);

//         if (!isValid) {
//             ctx.res.writeHead(302, {
//                 Location: "/Free-Listing" + queryString,
//             });
//             ctx.res.end();
//         }
//         else if(!isVerified) {
//             ctx.res.writeHead(302, {
//                 Location: "/Free-Listing" + queryString,
//             });
//             ctx.res.end();
//         }
//         // if (ctx?.req?.headers?.referer?.contains('congratulation')) {
//         //     ctx.res.writeHead(302, {
//         //         Location: '/Free-Listing/bussinesslist' + queryString,
//         //     });
//         //     ctx.res.end()

//         // }

//         let ip_url = `https://geolocation-db.com/json/`
//         if (!IP) {
//             IP = await axios.get(ip_url)
//                 .then(res => {
//                     return res?.data?.IPv4 || ""
//                 })
//                 .catch(err => {
//                     return ""
//                 })
//         }

//         let isHasBusiness = true
//         if (userMob) {
//             let businesslist_api = `http://192.168.8.12:9001/web_services/PhoneSearch.php?phone_nos=${userMob}&lme=1&limit=1`
//             await axios.get(businesslist_api)
//                 .then(res => {
//                     if (!res?.data?.total_records_count) {
//                         isHasBusiness = false
//                     }
//                 })
//                 .catch(err => {
//                     isHasBusiness = false
//                 })
//         }



//         if (sourceVal == '1' || sourceVal == '3') {
//             dc_db.query(`select * from justdial.tbl_dc_number where type='dce' and mobile=${userMob}`).then((result) => {
//                 if (result?.length) {
//                     ctx.res.writeHead(302, {
//                         Location: "https://wap.justdial.com/free_listing.php?old=1&m=1" + queryString,
//                     });
//                     ctx.res.end();
//                 }
//             }).catch((err) => {
//                 console.error('Error=> ', err)
//             })
//         }

        return {
            props: {
                mobileNumber: userMobileNumber,
                IP: IP,
                JDSID: currJDSID || null,
                city: city,
                isHasBusiness: isHasBusiness
            },
        };
    // } catch {
    //     return ({ props: { mobileNumber: '', IP: '' } })
    // }
}


export default AddressPage