import React, { useEffect, useRef, useState } from "react";
import style from "./entermobilenumber.module.scss";
import { isOnlyNumber, isValidMobileNumber } from "@/utils/validations";
import { updateMultipleOTPValues } from "@/store/Slices/landingPageSlice";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP, trackingDashboardAPI } from "@/utils/api";
import axios from "axios";
import {
  Android_CODE_ARR,
  IOS_CODE_ARR,
  clickTracker,
  generateHotLead,
  generateSessionId,
  getCookie,
  getCookieValue,
  removeRepetitiveQueryParams,
  sanitizeParams,
  setCookie,
  verifyUserSID,
} from "@/utils/commonFunc";
import { useRouter } from "next/router";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import { 
   new_fl_alreadyLoggedin_ct_login,
   new_fl_ct_always_otpLoad,
   new_fl_ct_login_hasBusiness, 
   new_fl_ct_login_noBusiness, 
   new_fl_ct_login_otpLoad_diffNumber, 
   new_fl_ct_nonlogin_otpLoad
  } from "@/utils/newClickTrackerFun";
import { fetchUserData ,nativeLogin,setUserData  } from "@/utils/appFunctions";



const ErrorMsgMap = {
  emptyMob: "Please Enter a Mobile Number",
  invalidMob: "Please Enter a Valid Mobile Number",
};


if (typeof window != 'undefined') {
  //window.getLoginData = (logjson) => logjson;
  window.globalLogin = nativeLogin.bind(this)
  //window.skipLogin = nativeSkipLogin.bind(this);
}


function doNothing(e, functionName) {
  e.preventDefault();
  console.error(`${functionName} not found`);
}
export default function EnterMobileNumber(props) {
  const {
    styles = {},
    buttnTxt = "Start Now",
    isFlag = false,
    city,
    page,
    index,
    LoggedInMobileNumber = null,
    headerClass,
  } = props;
  
  const router = useRouter();
  const dispatch = useDispatch();
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  const {getSource, sesionId, isVerified, ip } = useSelector((state) => state.CommonValues || {});
  const {jdlite, message_template=null, communication_channel=null, customer_segment=null } = router?.query || {}
  let chl = sanitizeParams(router?.query?.chl ) || ""
  let isMobile = false;
  let sourceCode = sanitizeParams(router?.query?.source) || null
  if (sourceCode == '7' || sourceCode == '77') {
      isMobile = false
  } else {
      isMobile = true;
  }
  const cityParams = router?.query?.city;
  const isSubmitClicked = useRef(false);
  const blockedNumberStatusMap = useRef({});
  const isLoggedIn = useSelector((state) => state.CommonValues.isVerified)
  const [lastPhoneNumber, setLastPhoneNumber] = useState("");
  const [isButtonCalled, setIsButtonCalled] = useState(false);
  const isHasBusiness = useSelector((state) => state.CommonValues?.isBussiness);
  let meParams = router?.query?.me;
	meParams = sanitizeParams(meParams)


  const [PhoneNumber, setPhoneNumber] = useState({
    val: "",
    errorMsg: "",
  });
  const [isBlur, setIsBlur] = useState(true);
  
  function fetch_li_blur(index) {
    let li = "";
    switch (index) {
      case 1:
        li = "mn_blur_1_LP";
        break;
      case 2:
        li = "mn_blur_2_LP";
        break;
      case 3:
        li = "mn_blur_cfa";
        break;
      case 4:
      li = "mn_blur_sticky_lp"
      break;
    }
    return li;
  }

  
  function fetch_li_click(index) {
    let li = "";
    switch (index) {
      case 1:
        li = "nfl_stnow_1";
        break;
      case 2:
        li = "nfl_stnow_2";
        break;
      case 3:
        li = "nfl_cfa";
        break;
      case 4:
        li = "sticky_CTA_SN"
        break
    }
    return li;
  }

  
  const ClickTrackerCall = (li, ll) => {
    let tempSourceCode = sourceCode;
    if (tempSourceCode == null) {
      let device_userAgent = navigator.userAgent;
      if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          device_userAgent
        )
      ) {
        tempSourceCode = "2";
      } else {
        tempSourceCode = "7";
      }
    }
    clickTracker({
      sourceCode: tempSourceCode,
      li: li,
      ll: ll,
    });
  };

  function getSoruceNamefunction() {
    if (jdlite == 1 && sourceCode == 2) {
      return "jdlite";
    } else {
      return getSource[sourceCode];
    }
  }

  useEffect(() => {
    let el = document.getElementById('1')
    if(el && index!=4) {
      el.focus()
    }

    if (LoggedInMobileNumber) {
      setPhoneNumber((prevValue) => ({
        ...prevValue,
        val: LoggedInMobileNumber
      }))
    } else if(meParams) {
			try {
				let decodeNo = atob(meParams) || ""
				setPhoneNumber((prevValue) => ({
					...prevValue,
					val: isOnlyNumber(decodeNo) ? decodeNo : ""
				}))	
			} catch (error) {
				console.log(error)
			}
		}


  }, [])

  useEffect(() => {
    if (isVerified) {
      setLastPhoneNumber(isVerified)
    }
  }, [isVerified])

  useEffect(() => {
    // try {
    //  if (!sesionId) {
    //   generateSessionId().then((data) => {
    //    dispatch(updateCommonValues({ key: "sesionId", value: data ? data : "" }));
    //   });
    //  }
    // } catch (e) {
    //  console.log(e, "error");
    // }
    document.cookie = "isSignUpLoaded=true";
  }, []);

  const handleHotLeadApiCall = (campaign_name_param, link_location_param, iswarm) => {
    let val = PhoneNumber?.val || "";
    if (!isValidMobileNumber(val)) return;
    let localStorageCity = Array.isArray(
      JSON.parse(window?.localStorage?.getItem("recentLocation"))
    )
      ? JSON.parse(window?.localStorage?.getItem("recentLocation"))[0]?.city
      : null;

    let payload = {
      number: val,
      g_queue:
        link_location_param === "new_fl_mobile_number_submitted" ? "1" : "0",
      data_city: city || cityParams || localStorageCity || "",
      session: sesionId,
      platform: getSoruceNamefunction(),
      message_template: message_template || "",
      communication_channel: communication_channel || "",
      customer_segment: customer_segment || "",
      campaign_name: campaign_name_param,
      link_location: link_location_param,
      data_source: chl == 1 ? 'campaign_freelisting_hot' : "Joinfree",
    };

    if (campaign_name_param == "new_free_listing_hot" || campaign_name_param == "campaign_freelisting_hot") {
      generateHotLead(payload, iswarm);
    } else if (lastPhoneNumber !== val) {
      setLastPhoneNumber(val);
      generateHotLead(payload, iswarm);
    }
  };

  const checkBlockedNumber = async (mobileNumber) => {
    let tempMobileNumber = mobileNumber || null;
    let flag = false;
    if (tempMobileNumber) {
      let url = `/api/v2/checkblockednumber`;
      flag = await axios
        .post(url, { mobile: tempMobileNumber })
        .then((res) => {
          return res?.data.status || false;
        })
        .catch((err) => {
          return true;
        });
    }
    return flag;
  };

  // function handleMobileOntouchStart(e) {
  //   debugger
  //   const currSID = getCookieValue('sid') || getCookieValue('JDSID') || '';
  //   if((Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) & !currSID?.length){ 
  //     fetchUserData(sourceCode)
  //     return;
  //   }
   
  //   if(Android_CODE_ARR.includes(sourceCode)){
  //     const userProfile = JSON.parse(decodeURIComponent(getCookieValue("userProfile")))
  //     const name = userProfile.name
  //     const mobile = userProfile.mobile
  //     const email = userProfile.email
  //    const logjson = JSON.stringify({ fn: 'globalLogin', directotp: 1, name: name, email: email, mobile: mobile })
  //    JdLiteInterface.verticalLogin(logjson)    
  //   }
  // }

  // function handleMobileInputKeyDown(e) {
  //   if (e && e.code && String(e.code).toLowerCase() === "enter") {
  //     setIsButtonCalled((s) => !s);
  //   }
  // }

  async function handleMobileInputSubmit(e, sourceCode, PhoneNumber) {
    let error = ""
    const phoneNum = PhoneNumber;
    console.log("Phone Number", phoneNum);
    
    isSubmitClicked.current = true;

    
    setTimeout(() => {
      isSubmitClicked.current = false
    }, 250)
    e.preventDefault();

    isButtonCalled ? setIsButtonCalled((s) => !s) : null;
    try {
      if (PhoneNumber?.val?.length == 0) {
        setPhoneNumber((prev) => ({
          ...prev,
          errorMsg: ErrorMsgMap.emptyMob,
        }));
        error = ErrorMsgMap.emptyMob
        return; 
      }
      const flag = isValidMobileNumber(PhoneNumber.val);


      let trackingDataPayload = {
        source: sourceCode,
        clickType: 'click',
        IP: ip || "",
        trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
        mobile: LoggedInMobileNumber || PhoneNumber.val || "",
        docid: "",
        sessionId: sesionId || "",
        city: city || cityParams || ""
      }

      if (flag) {
        trackingDashboardAPI(trackingDataPayload, window.location.href || "");
        let isNotBlocked;        
        if(blockedNumberStatusMap.hasOwnProperty(PhoneNumber?.val)){
          isNotBlocked = blockedNumberStatusMap[PhoneNumber?.val];
        } else {
          isNotBlocked = await checkBlockedNumber(PhoneNumber.val);
          blockedNumberStatusMap[PhoneNumber?.val] = isNotBlocked;
        }
        if (isNotBlocked) {
          ClickTrackerCall(fetch_li_click(index), "NFL_LP");
          handleHotLeadApiCall( chl == 1 ? "campaign_freelisting_hot" :
            "new_free_listing_hot",
            "new_fl_mobile_number_submitted",
            false
          );
          if (PhoneNumber.val === LoggedInMobileNumber) {
            ClickTrackerCall(new_fl_alreadyLoggedin_ct_login(index,page),page === "landing" ? "NFL_LP" : "NFL_SSpage")
            if(isHasBusiness){
              ClickTrackerCall(new_fl_ct_login_hasBusiness(index,page),page === "landing" ? "NFL_LP" : "NFL_SSpage")
            }else{
              ClickTrackerCall(new_fl_ct_login_noBusiness(index,page),page === "landing" ? "NFL_LP" : "NFL_SSpage")
            }
            router.push({
              pathname: '/bussinesslist',
              query: router.query || {}
            }
            )
          } else {

            if(![...IOS_CODE_ARR,...Android_CODE_ARR].includes(sourceCode)){
              
            dispatch(updateCommonValues({ key: 'fromIndex', value: index }))
            ClickTrackerCall(new_fl_ct_always_otpLoad(index,page),page === "landing" ? "NFL_LP" : "NFL_SSpage")
            if(isLoggedIn){
              ClickTrackerCall(new_fl_ct_login_otpLoad_diffNumber(index,page),page === "landing" ? "NFL_LP" : "NFL_SSpage")
            }else{
              ClickTrackerCall(new_fl_ct_nonlogin_otpLoad(index,page),page === "landing" ? "NFL_LP" : "NFL_SSpage")
            }

            const responce = await sendOTP(PhoneNumber.val, 7);
            if (responce) {
              document.body.classList.add("bodyfixed");
              dispatch(
                updateMultipleOTPValues({
                  isShowOTP: true,
                  moblieNumber: PhoneNumber.val,
                  index: index
                })
              );
            } else {
              setPhoneNumber((prev) => ({
                ...prev,
                errorMsg: "Reached Daily SMS Limit. ",
              }));
              error = "Reached Daily SMS Limit."
            }
          }
        }
        } else {
          setPhoneNumber((prev) => ({
            ...prev,
            errorMsg: `This Number has been Blocked for Signing Up`,
          }));
          error = `This Number has been Blocked for Signing Up`
        }
      } else {
        setPhoneNumber((prev) => ({
          ...prev,
          errorMsg: ErrorMsgMap.invalidMob,
        }));
        error = ErrorMsgMap.invalidMob
      }

      if( error.length == 0 && Android_CODE_ARR.includes(sourceCode) || error.length == 0 && IOS_CODE_ARR.includes(sourceCode)){
        e.preventDefault()
        const currSid = getCookieValue('sid') || getCookieValue('JDSID');
  
        if(currSid && PhoneNumber?.val !== lastPhoneNumber){
          const logjson = JSON.stringify({ fn: 'globalLogin', directotp: 1, name: "", email: "", number: PhoneNumber.val })
          console.log('logjson', logjson)
          JdLiteInterface.verticalLogin(logjson) 
  
        }
        if(currSid?.length) {
          const redirecrtionURL = '/Free-Listing/bussinesslist' + window?.location?.search || '';
          handleHotLeadApiCall( chl == 1 ? "campaign_freelisting_hot" :
            "new_free_listing_hot",
            "new_fl_mobile_number_submitted",
            false
          );
            router.push({
              pathname: '/bussinesslist',
              query: router.query 
            }) 
          
        } else {
          fetchUserData(sourceCode,PhoneNumber?.val)
        }
        return; 
      }


    } catch (err) {
      console.error(err);
    }
  }

  function handleMobileOntouchStart(e) {
    const currSID = getCookieValue('sid') || getCookieValue('JDSID') || '';
  
    if((IOS_CODE_ARR.includes(sourceCode)) & !currSID?.length){
      fetchUserData(sourceCode)
      return;
    }
    
  }

  function handleMobileInputKeyDown(e,index) {
    if (e && e.code && String(e.code).toLowerCase() === "enter") {
      setIsButtonCalled((s) => !s);
    }

    if((Android_CODE_ARR.includes(sourceCode) && e.keyCode == 13) || (Android_CODE_ARR.includes(sourceCode) && e.code == 13)){
			setTimeout(() =>{
				let input = document.getElementById(index)
				input.blur()
			},500)
		}

  }

  function handleMobileInputField(e) {
    if(IOS_CODE_ARR.includes(sourceCode) && LoggedInMobileNumber){
      return
    }


    if(Android_CODE_ARR.includes(sourceCode) && LoggedInMobileNumber){ 
      return
    }

    let mobileNumber = e?.target?.value || "";
    if (mobileNumber?.length == 0) {
      setPhoneNumber((prev) => ({
        ...prev,
        val: "",
      }));
    }
    if (isOnlyNumber(mobileNumber)) {
      if (mobileNumber?.length > 0 && mobileNumber?.length <= 10) {
        setPhoneNumber((prev) => ({
          ...prev,
          val: mobileNumber,
          errorMsg: "",
        }));
      }
    }
  }

  function MobileInputError() {
    let errorMsg = PhoneNumber?.errorMsg || "";
    if (errorMsg?.length == 0) return null;
    return <span className={`${styles.error__text} ${style.error__text}`}>{errorMsg}</span>;
  }

  async function checkValidMobileNumber(number=''){
    var flag = isValidMobileNumber(number);
    if (flag) {
      let isNotBlocked;        
      if(blockedNumberStatusMap.hasOwnProperty(number)){
        isNotBlocked = blockedNumberStatusMap[number];
      } else {
        isNotBlocked = await checkBlockedNumber(number);
        blockedNumberStatusMap[number] = isNotBlocked;
      }
      flag = isNotBlocked;
    }
    return flag;
  }


  async function CT_HotleadTrigger() {
    let isValidMobileNumber = await checkValidMobileNumber(PhoneNumber?.val);
    if(!isValidMobileNumber) return;
    handleHotLeadApiCall(chl ==1 ? "campaign_freelisting_warm" :
      "new_free_listing_warm",
      "new_fl_mobile_number_blur",
      true
    );
    ClickTrackerCall(fetch_li_blur(index), "NFL_LP");
  }




  return (
    <>
		<form className={`${PhoneNumber.errorMsg ? styles.error__input : ""} ${PhoneNumber.errorMsg ? style.error__input : ""} ${style.form} ${(index==1 || index == 4) && !isBlur ?style.inactive:''} ${headerClass ? style.form__header : ''}`}>
        {/* {isFlag ? (
          <span className={`color111 fw500 ${styles.countrycode}`}>
            <span role="presentation" tabIndex="0" className={`${styles.flag} iconwrap`} />
            <span>+91</span>
          </span>
        ) : (
          <span className={`color111 fw500 ${styles.countrycode}`}>+91</span>
        )} */}
        <span className={`color111 fw500 ${style.countrycode}`}>
          <span role="presentation" tabIndex="0" className={`${style.flag} iconwrap`} />
          <span>+91</span>
        </span>
        <input
          disabled={ IOS_CODE_ARR.includes(sourceCode) && LoggedInMobileNumber || Android_CODE_ARR.includes(sourceCode) && LoggedInMobileNumber }
          aria-label="Enter Mobile Number"
          aria-required={true}
          className={`${style.input} input fw500`}
          value={PhoneNumber.val}
          inputMode="numeric"
          pattern="[0-9]*"
          name="pincode"
          autoComplete="off"
          maxLength="10" 
          // onTouchStart={handleMobileOntouchStart}
          onChange={handleMobileInputField}
          onKeyDown={(e) =>handleMobileInputKeyDown(e,index)}
          required={IOS_CODE_ARR.includes(sourceCode) ? false : true}
          onFocus={()=>{
            if(!Android_CODE_ARR.includes(sourceCode) && !IOS_CODE_ARR.includes(sourceCode)){
              setIsBlur(true)
            }
          }}
          id={index} 
          onBlur={(e) => {
            setTimeout(async() => {
              if(!isSubmitClicked.current){
                await CT_HotleadTrigger()
              }
            }, 250)
            if(!Android_CODE_ARR.includes(sourceCode) && !IOS_CODE_ARR.includes(sourceCode)){
              setIsBlur(false);
            }
          }}
        />
        <label className={`input__label ${style.input__label}`}>
          Enter Mobile No.
        </label>
        <button aria-label={buttnTxt}
          className={`primarybutton ${styles.buttonshimmer}`}
          onClick={ (e)=>handleMobileInputSubmit(e, sourceCode, PhoneNumber) }
          onMouseDownCapture={() => {
            if(!(  IOS_CODE_ARR.includes(sourceCode))) {
              setIsButtonCalled((s) => !s);
            }
          }}
        >
          {buttnTxt + " "}{" "}
          <span className={`${styles.whitearrow} iconwrap moveRIght ${headerClass ? style.whitearrow : ''}`} />
        </button>{
          !headerClass && MobileInputError()
        }
        {/* {MobileInputError()} */}
      </form>
      {
        headerClass && MobileInputError()
      }
    </>
  );
}
