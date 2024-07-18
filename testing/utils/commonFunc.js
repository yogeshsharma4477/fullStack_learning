import store from '@/store/store'
import axios from 'axios'
import { appRedirection } from './appFunctions';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const WEB_CODE_ARR = ['7', '77'];
export const TOUCH_CODE_ARR = ['2', '22'];
export const IOS_CODE_ARR = ['3', '23'];
export const Android_CODE_ARR = ['1', '21'];
export const MOBILE_NUMBER_REGEX = new RegExp(/^[6-9]\d{9}$/)




export const isNull = (value) => {
    if (Object.is(value, null)) return true
    return false
}

export const isEmptyString = (value) => {
    if (typeof value === 'string') {
        return !value.length
    }
    return false
}

export function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        if (d !== "createdtime" && d !== "datesource") {
            ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        } else {
            ret.push((d) + "=" + data[d])
        }
    return ret.join("&");
}
  

export function genrateAccessToken(host){
    let issuer = host.includes('.justdial.com') ? '.justdial.com' : null;
    if(process.env.NODE_ENV === 'development'){
        issuer = '.jdsoftware.jd';
    }
    if(!issuer) return null;
    const secretKey = process.env.JWT_SECRET;
    const expiresInHours = 12;
    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + expiresInHours * 60 * 60;

    const payload = {
      iss: issuer,
      iat: Math.floor(Date.now() / 1000),
      exp: expirationTimeInSeconds
    };

    const token = jwt.sign(payload, secretKey);
    return token
}

export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && !isNaN(parseFloat(str))
}

export function InsertAPIServerValidation(obj) {
    let err = {
        error: false
    }
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            if (value.length === 0) {
                err[key] = `${key} cannot be empty`
                err.error = true
            }
            if (key === "pincode" && (value.length != 6 || !isNumeric(value))) {
                err[key] = `Please Enter Valid ${key}`
                err.error = true
            }
            // if (key === "mobile_display" && (value.length !== 10 || !isNumeric(value))) {
            //     err[key] = `Please Enter Valid ${key}`
            //     err.error = true
            // }
        }
    }
    return err
}


export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


export function set_cookie(name, value) {
    document.cookie = name + '=' + value + '; Path=/;';
}

export function delete_cookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function getCookieValue(name) {
  const regex = new RegExp(`(^| )${name}=([^;]+)`)
  const match = document.cookie.match(regex)
  if (match) {
    return match[2]
  }
}



export async function clickTracker(obj) {
    if(location.pathname.includes('dc'))return;
    if (!obj?.li || !obj?.ll) {
        return
    }

    let value = store.getState().CommonValues
    let data = {
        source: value.source,
        docid: value.docid || "",
        li: obj.li,
        ll: obj.ll
    }
    const response = await axios({
        method: "post",
        url: "/api/v1/clickTracker",
        data: data
    });
    return response
}

export const generateSessionId = async () => {
    if(location.pathname.includes('dc'))return;
    let sessionID = await axios.get('/api/v2/createhotleadsession')
    if (sessionID?.data?.status) {
        return sessionID?.data?.data?.lead_session_id
    } else {
        return ""
    }
}

export const generateHotLead = async (payload, iswarm) => {
   try {
    if(location.pathname.includes('dc'))return;
    const urlParams = new URLSearchParams(window.location.search);
    if(sanitizeParams(urlParams.get('nhl')) === '1')return ""
 
    let event_date = sanitizeParams(urlParams.get('event_date'));
    let iro = sanitizeParams(urlParams.get('iro'))
    
        payload['event_date'] = event_date
        payload['data_source'] = payload.data_source

        if(iro == '1'){
            payload['link_location'] = "iro_" + payload['link_location']?.replace("new_", "") || "";
            
            if(iswarm){
                payload['campaign_name'] = "iro_msg_free_listing_warm" 
                payload['data_source'] = "iro_msg_free_listing_warm"
            }else{
                payload['campaign_name'] = "iro_msg_free_listing_hot" 
                payload['data_source'] = "iro_msg_free_listing_hot"
            }
        }
    
    let response = await axios.post('/api/v2/genratehotlead', payload)
    if (response?.data?.status) {
        return response?.data?.data?.msg
    } else {
        return ""
    }
   } catch (error) {
        return error.message
   }
}

export const generateSMS = async (mobileNumber) =>{
    // let msg = 'Hello! thanks for adding your business details on our platform. Our business representative will get in touch with you shortly.';
    let url = '/api/v2/triggersmsoncontractcreation'
    let payload = {
        mobileNumber: mobileNumber
    }
    let response = await axios.post(url, payload)
    // await axios.get(url_sms).then(()=>{
    //     return res.status(200).json({
    //         status: 'true'
    //     })
    // }).catch(err => {
    //     return res.status(400).json({
    //         status: 'false'
    //     })
    // })
}


/**
 * The function `verifyUserSID` is an asynchronous function that takes in a SID (Session ID) and a
 * phoneNumber as parameters, and it verifies if the given SID matches the SID retrieved from a web
 * service API call using the phoneNumber.
 * @param SID - The SID parameter is a unique identifier for a user. It is used to verify the user's
 * identity.
 * @param phoneNumber - The `phoneNumber` parameter is the phone number of the user that needs to be
 * verified.
 * @returns a boolean value.
 */

const verifyUserSIDDecodeHelper = (encodedSID) => {
    let decodedSID = decodeURIComponent(encodedSID);
    if(encodedSID==decodedSID) {
        return decodedSID
    } else {
        return verifyUserSIDDecodeHelper(decodedSID);
    }
}

export async function verifyUserSID (SID, phoneNumber) {
    if(!SID) return false;
    let flag = false;
    try{
        let url = ``
        let queryParamsObj = {
            'case': 'checkprofile',
            'ownerinfo': 1,
            'mobile': phoneNumber
        }
        flag = await axios.get(url, {params: queryParamsObj})
        .then((response) =>{
            const { sid=null } = response?.data?.profile_detail || {};
            const decodedSID = verifyUserSIDDecodeHelper(SID);
            const decodedsid = verifyUserSIDDecodeHelper(sid);
            const encodedsid = encodeURIComponent(decodedsid); //hack sometimes sid is encoded multiple folds so directdecode won't work
            const encodedSID = encodeURIComponent(decodedSID); //hack sometimes sometimes SID is encoded multiple folds directdecode won't work
            return encodedSID==encodedsid;
        })
    } catch (error) {
        return flag;
    }
    return flag;
}

export function createCookie(name, value, minutes) {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

export const sanitizeParams = (params) => {
    if(!params) return '';
    else if (Array.isArray(params)) {
        return params[params.length-1]
    }
    else if (typeof params === 'string') {
        const _params =  params.split(',');
        return _params[_params.length - 1] ? _params[_params.length - 1] :  _params[0]
    } else {
        return params
    }
}


export function haveSameParams(url1, url2) {
    const getUrlParams = (url) => {
      const urlObject = new URL(url, 'http://justdial.com'); //http://justdial.com doesn't have any significance just added cus url1, url2 coming only params and with them can't resolve directly
      return Array.from(urlObject.searchParams.entries()).sort();
    };
  
    const params1 = getUrlParams(url1).toString();
    const params2 = getUrlParams(url2).toString();
  
    return params1 === params2;
  }  
  
export const sanitizeParamValue = (params) => {
    if(Array.isArray(params)) {
        return params.pop()
    } else {
        return params;
    }
}

export function removeRepetitiveQueryParams(url) {
    if(!url) return url;

    const parts = url?.split('?');
    
    if (parts?.length < 2) { return url}
  
    const baseUrl = parts.shift();
    const queryString = parts.join('?');
    const params = queryString.split('&');
    const uniqueParams = new Map();
    for (let i = params.length - 1; i >= 0; i--) {
        const param = params[i];
        const [key, value] = param.split('=');
        if (key !== undefined && key !== '') {
            if (!uniqueParams.has(key)) {
                uniqueParams.set(key, param);
            }
        }
    }
  
    const uniqueParamsArray = Array.from(uniqueParams.values());
    const newUrl = '?' + uniqueParamsArray.join('&');
  
    return newUrl;
}

export function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

export function fetchIP(req) {
    return req.headers["true-client-ip"] || req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.connection.remoteAddress;
}

export function objToQueryString(queryObj={}) {
    const queryString = Object.entries(queryObj)
    .map(([key, value]) => {
        if (Array.isArray(value)) {
        return value.map((val) => `${key}=${encodeURIComponent(val)}`).join('&');
        } else {
        return `${key}=${encodeURIComponent(value)}`;
        }
    })
    .join('&');

    return queryString;
}

export function fetchSourceCode (sourceCode, userAgent) {
    let currSourceCode = sourceCode;
    if(!currSourceCode){
      currSourceCode = '77';
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        currSourceCode = '2';
      }
    }
    return currSourceCode;
}

export function redirectToOldFlow(req, query, sourceCode) {
    const redirectionUrl = 'https://wap.justdial.com/free_listing.php?old=1&m=1';
    const queryParams = objToQueryString(query);
    return {
        redirect: {
        destination: redirectionUrl+'&'+queryParams ,
        permanent: false, 
        },
    };
}

export function checkProduction (req){
    const refererLink = req?.headers?.host || null;
    const isProduction = refererLink ? refererLink.includes('www.justdial.com') : false; 
    return isProduction;
}

export function checkBot(userAgent) {
    return /Googlebot|AdsBot-Google|Google-Adwords-Instant|bingbot/i.test(userAgent);
}

// export async function checkDCFlow(userMob) {
//     try{
//         const DCRecord = await dc_db.query(`select * from justdial.tbl_dc_number where type='dce' and mobile=${userMob}`);
//         return DCRecord?.length>0;
//     } catch(e){
//         console.log(e)
//     }
// }

export function DCRedirect(queryObj) {
    const redirectionUrl = 'https://wap.justdial.com/free_listing.php?old=1&m=1';
    const queryParams = objToQueryString(queryObj);
    return {
            redirect: {
            destination: redirectionUrl +'&'+queryParams ,
            permanent: false, 
        },
    };
}

export function setSourceCodeFromServerSide(res, currPageURL, queryObj, sourceCode) {
    queryObj = { ...queryObj, source: sourceCode }
    const currURL = '?' + objToQueryString(queryObj)
    const sanitizedURL = removeRepetitiveQueryParams(currURL)
    res.writeHead(302, {
        Location: currPageURL + sanitizedURL
    });
    res.end();
}

export function senatizeURL (res, url, queryObj={}) {
    const currURL = '?' + objToQueryString(queryObj)
    const sanitizedURL = removeRepetitiveQueryParams(currURL)
    res.writeHead(302, {
        Location: url + sanitizedURL
    });
    res.end();
}

export function setCookie (key='', value='', isServerSide=false, path='/') {
    document.cookie = `${key}=${value};path=${path}; ${isServerSide?'HttpOnly':''}`;
};
  
export function fetchUserProfileData(userProfile, keyArr) {
    try{
        var dataObj = {};
        var currUserProfile = userProfile;
        try{
            currUserProfile = JSON.parse(userProfile)
        } catch(e){}
        keyArr.map((key, index)=>{
            dataObj[key] = currUserProfile[key];
        })
        return dataObj;
    } catch(error) {
        return {};
    }
}

export function redirectFromServerSide (res, currPageURL, queryObj, sourceCode) {
    queryObj={...queryObj, source: sourceCode}
    const currURL = '?' + objToQueryString(queryObj)
    const sanitizedURL = removeRepetitiveQueryParams(currURL)
    res.writeHead(302, {
        Location: currPageURL + sanitizedURL
    });
    res.end();
}

export async function hasAnyBusiness (mobileNumber=null) {
    try{
        if(!mobileNumber) return false;
        var isHasBusiness = true;
        const businessListApiURL = ``
        const queryObj = {
            phone_nos: mobileNumber,
            lme: 1,
            limit: 1
        }
        const businessList = await axios.get(businessListApiURL, {
            params: queryObj,
        })
    
        if(!businessList?.data?.total_records_count) {
            isHasBusiness = false;
        }
        return isHasBusiness;
    } catch (error){
        return false;
    }
}


  export function generateRandomToken() {
    const randomChars = Math.random().toString(36).substring(2, 10);
    const now = new Date();
    const daytime = +new Date()
    const combinedString = `ADVT${randomChars}${daytime}`;
    return combinedString;
  }

  export function detailsRedirect( payload ,source ) {
    let { docid, city, company_name } = payload

    const dashed_docid = docid.replace(/\.+/g, '-')
    company_name = sanitize(company_name)
    city = sanitize(city)

    let url = `https://www.justdial.com/${city}/${company_name}/${dashed_docid}_BZDET`

    if(source == 1 || source == 3 || source == 21 || source == 23){
        appRedirection(url, source)
    }else{
        window.open(url, "_blank")
    }

}

export const sanitize = (catname) => {
    if (catname) {
      let categoryName = catname.trim().replace(/[^a-zA-Z0-9-\s\.]+/gi, "");
      categoryName = categoryName.replace(/\s+/gi, "-");
      categoryName = categoryName.replace(/\.+/gi, "-");
      categoryName = categoryName.replace(/\-{1,}/gi, "-");
      return categoryName;
    }
    return "";
}


export function generateDCToken(length) {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const timestamp = new Date().getTime().toString();
  
    let token = 'dc_';
    for (let i = 0; i < length; i++) {
      if (i % 2 === 0) {
        token += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
      } else {
        token += timestamp.charAt(Math.floor(Math.random() * timestamp.length));
      }
    }
  
    return token;
  }
