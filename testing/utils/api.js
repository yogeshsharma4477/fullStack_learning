import qs from 'qs'
import CryptoJS from 'crypto-js'
import axios from 'axios'
const uuid = require('uuid')
const { getApiCall, postApiCall } = require('./apiCallFunc')
const {
    isLegalBusinessNameCallBackFunc,
    isBadWordCallBackFunc,
    sendOTPCallBackFunc,
    verifyOTPCallBackFunc,
    bussinessListCallBackFunc,
    sendOTPWebCallBackFunc,
    verifyOTPWebCallBackFunc,
    hotleadCallBackFunc,
    isValidPincodeCallBackFunc,
    isValidOrderIdCheck,
    sendOrderPlanCB,
} = require('./apiCallbackFunc')

import { generateRandomToken } from '@/utils/commonFunc';

//------------------------------------------------------

export const isLegalBusinessName = async (value) => {
    const url = 'api/v1/legalbussinessname'
    return await getApiCall(url, isLegalBusinessNameCallBackFunc, {
        params: { name: value },
    })
}

export const isBadWord = async (value, city) => {
    const url = 'api/v1/badword'
    return await getApiCall(url, isBadWordCallBackFunc, {
        params: { word: value, city: city },
    })
}

export const sendOTP = async (value, source) => {
    let url = 'api/v1/sendotp'
    if (source == 7 || source == 27 || source == 77) {
        let baseurl =
            location.host && location.host.match(/\.jdsoftware\.jd/)
                ? 'http://project01.anilkumar.jdsoftware.jd'
                : '' // need to done
        url = baseurl + `/functions/whatsappverification.php?fl=1&wap=${'77'}`
        return await postApiCall(url, sendOTPWebCallBackFunc, {
            payload: qs.stringify({
                name: '',
                mob: value,
                mdl: 'Freelisting'
            }),
        })
    }
    return await getApiCall(url, sendOTPCallBackFunc, {
        params: { number: value },
    })
}

export const verifyOTPApiCall = async (value, otp, source) => {
    const salt = process.env.SALT
    console.log
    let decryptOTP = CryptoJS.AES.decrypt(otp, salt).toString()
    console.log(decryptOTP)
    let url = 'api/v1/verifyotp'
    if (source == 7 || source == 27 || source == 77) {
        let baseurl =
            location.host && location.host.match(/\.jdsoftware\.jd/)
                ? 'http://project01.anilkumar.jdsoftware.jd'
                : ''
        url = baseurl + `/functions/whatsappverification.php?fl=1&wap=${'77'}`
        return await postApiCall(url, verifyOTPWebCallBackFunc, {
            payload: qs.stringify({
                name: '',
                mob: value,
                vcode: otp,
                mdl: 'Freelisting'
            }),
            withCredentials: true,
        })
    }
    return await getApiCall(url, verifyOTPCallBackFunc, {
        params: { number: value, otp: otp },
    })
}

export const bussinessListApiCall = async (value) => {
    const url = 'api/v1/bussinesslist'
    return await getApiCall(url, bussinessListCallBackFunc, {
        params: { number: value },
    })
}

export const editListingApiCall = ({ city, compname, docid, source }) => {
    let url = 'https://wap.justdial.com/edit_list/index.php'
    let queryParams = '?'
    queryParams += `&city=${city}`
    queryParams += `&cont=${encodeURIComponent(compname)}`
    queryParams += `&docid=${docid}`
    queryParams += `&owner=1`
    queryParams += `&wap=${source}`
    queryParams += `&hide_header=1`
    queryParams += `&vBackUrl=${encodeURIComponent(window.location.href)}`
    return url + queryParams
}

export const isValidPincode = async (pincode) => {
    const url = '/api/v1/GetPincodeLocation'
    return await postApiCall(url, isValidPincodeCallBackFunc, {
        payload: {
            pincode: pincode,
        },
    })
}

export const hotleadApiCall = async (data, sessionID) => {
    let url = 'api/v1/hotlead'
    return await postApiCall(url, hotleadCallBackFunc, {
        payload: { data: data, sessionID: sessionID },
    })
}

function getCookie(cName) {
    const name = cName + '='
    const cDecoded = decodeURIComponent(document.cookie) //to be careful
    const cArr = cDecoded.split('; ')
    let res
    cArr.forEach((val) => {
        if (val.indexOf(name) === 0) res = val.substring(name.length)
    })
    return res
}

function getPlatform(sourceCode) {
    switch (sourceCode) {
        case '7':
        case '77':
            return 'web'
            break
        case '2':
            return 'touch'
            break
        case '1':
            return 'android'
            break
        case '3':
            return 'ios'
            break
        case '-1':
            return 'jdlite'
            break
        default:
            return 'other'
            break
    }
}

export const logSessionDetails = async (data) => {
    try {
        const {
            mobile = null,
            referral = null,
            li = null,
            ll = null,
            sourceCode = null,
        } = data || {}
        var logDetailsSessionID = localStorage.getItem('logDetailsSessionID')
        if (!logDetailsSessionID) {
            const logDetailsSessionID = uuid.v4().toString
            localStorage.setItem('logDetailsSessionID', logDetailsSessionID)
        }

        let device_id = getCookie('_ctok') || ''
        let platform = getPlatform(sourceCode)
        let payload = {
            session_id: logDetailsSessionID,
            mobile: mobile,
            device_id: device_id,
            referral: referral,
            li: li,
            ll: ll,
            platform: platform,
        }
        let url = 'api/v2/hotlead'
        axios
            .post(url, payload)
            .then(() => { })
            .catch((err) => {
                console.error(err)
            })
    } catch (error) {
        console.error(error)
    }
}

export const getValidOrderId = async (orderid) => {
    const url = '/api/v1/checkorderid'
    console.log('orr', orderid)
    return await postApiCall(url, isValidOrderIdCheck, { payload: { orderid } })
}

export const postPlanOrder = async (obj) => {
    const url = '/api/v1/postpricing'

    return await postApiCall(url, sendOrderPlanCB, { payload: obj })
}

export async function trackingDashboardAPI(data, referrer) {
    // if (data.module == "dc") {
    //     globalObject = self
    //     referer = self.location.referrer
    //     url = `/Free-Listing/api/v2/trackingdashboard/logdata`
    // } else {
    //     globalObject = window
    //     referer = document?.referrer
    //     url = `/api/v2/trackingdashboard/logdata`
    // }
    let globalObject;
    let referer;
    let url;
    globalObject = window
    referer = document?.referrer
    url = `/api/v2/trackingdashboard/logdata`

    if (!globalObject?.userToken) {
        globalObject.userToken = generateRandomToken()
    }
    const urlParams = new URLSearchParams(globalObject.location.search);
    let referrerModule = urlParams.get('cta_from') || urlParams.get('module') || referrer || "";
    data = {
        ...data,
        "referrerModule": referrerModule,
        token: globalObject?.userToken || ""
    }

    try {
        const response = await axios.post(url, data, {
            timeout: 3000,
            headers: { "Content-Type": "application/json", "referrer": referrer },
        });

        return response
    } catch (error) {
        return error.message
    }
}