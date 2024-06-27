import { curry, get } from "lodash";
import { Android_CODE_ARR, IOS_CODE_ARR, generateHotLead, getCookieValue, sanitizeParamValue, setCookie } from "./commonFunc";

if (typeof window != 'undefined') {
    //window.getLoginData = (logjson) => logjson;
    window.globalLogin = nativeLogin.bind(this)
    //window.skipLogin = nativeSkipLogin.bind(this);
}

export function setUserData(userInfo) {
    let userProfile = {}
    setCookie('sid', userInfo.sid, false);
    setCookie('JDSID', userInfo.sid, false);
    userProfile.mobile = userInfo.mobile;
    userProfile = encodeURIComponent(JSON.stringify(userProfile))
    console.log(userProfile)
    // userProfile = encodeURI(userProfile);
    setCookie('userProfile', userProfile, false);

}

const iOSLogin = curry( async (usersource, logjson) => {
    let source  = usersource || "3";
    let userInfo = {}
    console.log('logjson :>> ', logjson);
    var logresponse =  {};
    try{
        logresponse = JSON.parse(logjson);
    } catch(e){
        console.log(e)
    } 
    console.log("logresponse", logresponse)
    const isProduction = window?.location?.href?.includes('www.justdial.com');
    var baseURL = `https://${window.location.host}`; 

    var url = baseURL
    // alert(JSON.stringify(logresponse))
    // window.location.href = url
    if(logresponse?.sid && logresponse?.mobile){
        userInfo = {
            sid:logresponse?.sid,
            mobile:logresponse?.mobile,
            version :logresponse?.devicebuildversion,
            deviceId:logresponse?.device_details?.deviceid,
        } 
        console.log("userInfo", userInfo)
        
        setUserData(userInfo);
        const queryStr = window?.location?.search || '?';
        let queryObj = queryStr.split('?');
        if(queryObj.length>1){
            queryObj = queryObj[1].split('&');
            let tempObj = {};
            queryObj.map((key_val)=>{
                let tempKeyVal = key_val.split('=');
                tempObj[tempKeyVal[0]] = tempKeyVal[1] || ''
            })
            queryObj = {...tempObj}
        } else {
            queryObj = {}
        }
        const sesionId = getCookieValue('sesionId') || '';
        const {source, city, usercity, message_template='', jdlite, communication_channel='',chl ="", customer_segment=''} = queryObj || {};
        let payload = {
            number: logresponse?.mobile,
            g_queue: '1',
            data_city:  decodeURI(city) || decodeURI(usercity) || "",
            session: sesionId,
            platform: getSoruceNamefunction(sanitizeParamValue(source), jdlite),
            campaign_name: chl == 1 ? "campaign_freelisting_hot" :'new_free_listing_hot',
            data_source: chl == 1 ? 'campaign_freelisting_hot' : "Joinfree",
            link_location: 'new_fl_mobile_number_submitted',
            message_template: message_template,
            communication_channel: communication_channel,
            customer_segment: customer_segment,
        };
        console.log('url', url)
        const response = await generateHotLead(payload)
        var url = baseURL + '/free-listing/bussinesslist' + window.location.search
        window.location.assign(url)

    }
    else{
        handleInvalidUser(usersource)
    }
    return;
})



export function fetchUserData(sourceCode,PhoneNumber = "") {
    console.log(sourceCode, IOS_CODE_ARR, Android_CODE_ARR)
    if( IOS_CODE_ARR.includes(sourceCode) || Android_CODE_ARR.includes(sourceCode)) {
        let userInfo = {}
        const urlSearchParams = new URLSearchParams(window.location.search);
        const urlParams = Object.fromEntries(urlSearchParams.entries());
        console.log(urlParams)
        const sid = encodeURIComponent(get(urlParams,"sid"));
        const mobile = get(urlParams,"mobile");
        if((sid && mobile)){
            if(sid && mobile){
                userInfo = {
                    sid:sid,
                    mobile:mobile,
                    deviceId: "",
                    version: "",
                    sourceCode
                }
            }

            setUserData(userInfo);
        }
        else{
            console.log("here")
            if((Android_CODE_ARR.includes(sourceCode)) && window?.JdLiteInterface){ 
                var logjson = JdLiteInterface.getLoginData();
                var logresponse = {};
                try{
                    logresponse = JSON.parse(logjson);
                } catch (error) {console.log(error)}
                if(logresponse?.sid?.length && logresponse?.mobile?.length){
                    userInfo = {
                        sid:logresponse?.sid,
                        mobile:logresponse?.mobile,
                        version :logresponse?.devicebuildversion,
                    } 
                    console.log('logresponse fetch data', logresponse)
                    setUserData(userInfo);

                }
                else{
                    handleInvalidUser(sourceCode ,PhoneNumber)
                }
                return logresponse?.mobile
            }else if(IOS_CODE_ARR.includes(sourceCode,)){
                console.log('Inside source : 3')
                if(typeof window != "undefined"){
                    window.getLoginData = iOSLogin(sourceCode);
                }
                const logjsons = JSON.stringify({'type':'verticalLogin','fn':'getLoginData',"mobile":PhoneNumber});
                window.webkit.messageHandlers.callbackHandler.postMessage(logjsons);
                
            }
        }
    }
}

export const handleInvalidUser = (source,PhoneNumber="") => {
    console.log('handleInvalidUser soruce', source,PhoneNumber);
    if(Android_CODE_ARR.includes(source)){
        if (window.JdLiteInterface) {
            const logjson = JSON.stringify({ fn: 'globalLogin', directotp: 1, name: "", email: "", number: PhoneNumber })
            console.log("handleInvalidUser logjson", logjson)
            JdLiteInterface.verticalLogin(logjson)
        }
    }
    
    if(IOS_CODE_ARR.includes(source)){
            var logjson = JSON.stringify({'type':'verticalLogin','fn':'getLoginData' ,"mobile": PhoneNumber});
            window.webkit.messageHandlers.callbackHandler.postMessage(logjson);
    }
}

function getSoruceNamefunction (sourceCode, jdlite) {
    let platformName = ''
    if (jdlite == 1 && sourceCode == 2) {
        return "jdlite";
    } else {
        switch(sourceCode){
            case '7':
            case '77':
                platformName = 'web';
                break;
            case '2':
                platformName = 'touch';
                break;    
            case '22':
                platformName = 'jdmart touch';
                break;
            case '1':
                platformName = 'android';
                break;
            case '3':
                platformName = 'ios';
                break;    
            case '22':
                platformName = 'jdmart touch';
                break;
            case '27':
                platformName = 'jdmart web';
                break;
            case '21':
                platformName = 'jdmart android';
                break;
            case '23':
                platformName = 'jdmart ios';
                break;
        }
    }
    return platformName
}

export function nativeLogin(logjson) {
    
    var logresponse = {};
    try{
        logresponse = JSON.parse(logjson);
    } catch (error) {console.log(error)}
    if(logresponse?.sid?.length && logresponse?.mobile?.length){
        let userInfo = {};
        userInfo = {
            sid: logresponse.sid,
            mobile: logresponse.mobile,
            deviceId: "",
            version: "",
        }

        setUserData(userInfo);
          
        if(logresponse?.sid && logresponse?.mobile){
            const queryStr = window?.location?.search || '?';
            let queryObj = queryStr.split('?');
            if(queryObj.length>1){
                queryObj = queryObj[1].split('&');
                let tempObj = {};
                queryObj.map((key_val)=>{
                     let tempKeyVal = key_val.split('=');
                     tempObj[tempKeyVal[0]] = tempKeyVal[1] || ''
                })
                queryObj = {...tempObj}
            } else {
                queryObj = {}
            }

            const sesionId = getCookieValue('sesionId') || '';
            const {source, city, usercity, message_template='', jdlite, communication_channel='',chl= '', customer_segment=''} = queryObj || {};
            
            let payload = {
                number: logresponse?.mobile,
                g_queue: '1',
                data_city:  decodeURI(city) || decodeURI(usercity) || "",
                session: sesionId,
                platform: getSoruceNamefunction(sanitizeParamValue(source), jdlite),
                campaign_name: chl ==1 ? "campaign_freelisting_hot" :'new_free_listing_hot',
                data_source:chl == 1? "campaign_freelisting_hot": "Joinfree",
                link_location: 'new_fl_mobile_number_submitted',
                message_template: message_template,
                communication_channel: communication_channel,
                customer_segment: customer_segment,
            };
            generateHotLead(payload,false).then((response)=>{
                var url = '/free-listing/bussinesslist' + window.location.search
                window.location.assign(url)
            }).catch((error)=>{
                var url = '/free-listing/bussinesslist' + window.location.search
                window.location.assign(url)
            })
        }
    }
}

export function appRedirection(url, sourceCode){
    if(Android_CODE_ARR.includes(sourceCode)){
        var data = {}; 
        data["ürl"] = url;
        data["header"] = ''; 
        data["confirmationheader"] = ''; 
        data["hide_header"] = 1; 
        data["webviewhistory"] = 0; 
        data["transaction"] = 0; 
        JdLiteInterface?.openUrlInWindow(JSON.stringify(data));
    }
    if(IOS_CODE_ARR.includes(sourceCode)){
        var params_ios = { 'type': 'deeplinkJD', 'shareUrl': url };
        window?.webkit?.messageHandlers?.callbackHandler?.postMessage(JSON.stringify(params_ios));
    }
    return
}   
