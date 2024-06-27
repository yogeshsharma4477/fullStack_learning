import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./signup.module.scss";
import { common, signUp } from "@/utils/string";
import { hotleadApiCall } from "@/utils/api";
import { isFieldEmpty, isValidMobileNumber } from "../../utils/validations";
import clickTracker from "@/utils/clickTracker";
import { generateSessionId, isEmptyString, generateHotLead, sanitizeParams } from "@/utils/commonFunc";
import { useDispatch, useSelector } from "react-redux";
import { currentPage } from "@/store/Slices/CurrentCompoentSlice";
// import legalbussinessname from "@/pages/api/v1/sendotp";
import { sendOTP } from "@/utils/api";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import axios from 'axios'


const redirectToPrivacyAndPolicy = (source) => {
  switch (source) {
    case '7':
      window.open(
        'https://www.justdial.com/Terms-of-Use', 
        '_blank'
      );
      break;
    case '2':
      window.open(
        "https://www.justdial.com/mobileTC?wap=2&source=2&nh=1&nd=1&ln=en&ver=1.0&hide_header=1", 
        '_blank'
      );
      break;
    case '1':
      var data = {};
      data["ürl"] = "https://www.justdial.com/mobileTC?wap=2&source=2&nh=1&nd=1&ln=en&ver=1.0&hide_header=1";
      data["header"] = 'justdial';
      data["confirmationheader"] = '';
      data["hideheader"] = 1;
      data["webviewhistory"] = 0;
      data["transaction"] = 0;
      console.log('data :>> ', data);
      JdLiteInterface?.openUrlInWindow(JSON.stringify(data));
      break;
    case '3':
      var url = "https://www.justdial.com/mobileTC?wap=2&source=2&nh=1&nd=1&ln=en&ver=1.0&hide_header=1";
      var params_ios = { 'type': 'deeplinkJD', 'shareUrl': url };
      window?.webkit?.messageHandlers?.callbackHandler?.postMessage(JSON.stringify(params_ios));
      break;
  }
}
const getDisplayLabels = () => {
  const title =
    signUp?.title ||
    "List Your Business for FREE with India’s #1 Local Search Engine";
  const mobile_lable = common?.labels?.mobileNumber || "Mobile Number";
  const err_msg_empty =
    common?.errMsg?.emptyMobileNumber || "Please Enter a Mobile Number";
  const err_msg_Invalid =
    common?.errMsg?.InvalidMobileNumber || "Please Enter a Valid Mobile Number";
  const button_txt = signUp?.createAccount || "Create FREE Account";
  const sign_up_info =
    signUp?.createAccountInformationMsg ||
    "By creating account you agree to Justdial’s";
  const terms_of_service =
    common?.commonterms?.termsOfService || "Terms of Service";
  const privacy_Policy = common?.commonterms?.privacyPolicy || "Privacy Policy";
  const country_code = common?.countryCode?.India;
  return {
    title,
    country_code,
    mobile_lable,
    err_msg_empty,
    err_msg_Invalid,
    button_txt,
    sign_up_info,
    terms_of_service,
    privacy_Policy,
  };
};
export default function Signup(props) {

  const { IP, city, userInfo } = props

  let b = process.env.a
  // JSON.parse(window.localStorage.getItem("recentLocation"))[0].city

  const router = useRouter();
  const cityParams = router?.query?.city;
  let chl = sanitizeParams(router?.query?.chl)
  const signUpPhoneInputFieldRef = useRef(null);
  const createAccButtonRef = useRef(null);
  const [errMsg, setErrMsg] = useState("");
  const [loader, setLoader] = useState(false);
  const source = useSelector((state) => state.CommonValues.source);
  const mobileNumber = useSelector(
    (state) => state.CommonValues?.mobileNumber || ""
  );
  const sesionId = useSelector((state) => state.CommonValues?.sesionId || "");
  const dispatch = useDispatch();
  const [lastPhoneNumber, setLastPhoneNumber] = useState("")
  const sourceCode = router?.query?.source
  const jdlite = router?.query?.jdlite
  const getSource = useSelector((state) => state.CommonValues?.getSource || "");
  const [responceMsg, setResponceMsg] = useState('');

  const {
    title,
    country_code,
    mobile_lable,
    err_msg_empty,
    err_msg_Invalid,
    button_txt,
    sign_up_info,
    terms_of_service,
    privacy_Policy,
  } = getDisplayLabels(); //  fetch label to show

  const handleClick = async (e) => {
    if(!window?.navigator?.onLine) return
    setLoader(true)
    //click tarcker call
    clickTracker({
      sourceCode: sourceCode,
      li: "FL_CFA",
      ll: "FL_Page",
    });

    //  create acc button action
    e.preventDefault();
    let mobilePlaceholderValue = signUpPhoneInputFieldRef.current.value;
    let isMobileFieldEmpty = isFieldEmpty(mobilePlaceholderValue);
    if (isMobileFieldEmpty) {
      setLoader(false);
      setErrMsg(err_msg_empty);
    }
    else {
      let isValidMobileField = isValidMobileNumber(mobilePlaceholderValue);
      if (!isValidMobileField) {
        setLoader(false);
        setErrMsg(err_msg_Invalid);
      } else {
        let mobileNumber = signUpPhoneInputFieldRef.current.value;
        let isNotBlocked = await checkBlockedNumber(mobileNumber)
        if (!isNotBlocked) {
          setLoader(false);
          setResponceMsg(`Mobile number ${mobileNumber} is restricted to create contract.`)
          return
        }
        dispatch(
          updateCommonValues({ key: "mobileNumber", value: mobileNumber })
        );
        let otpSendStatus = await sendOTP(mobileNumber, source);

        if (otpSendStatus) {
          let query = new URLSearchParams(router?.query || {}).toString()
          router.push({
            pathname: '/otp',
            query: router.query || {}
        })
        } else {
          setLoader(false)
          setResponceMsg("Reached Daily SMS Limit.");
        }
      }
    }
  };

  const preventDefaultEvents = (e) => {
    e.preventDefault();
  };

  const handleMobileInput = (e) => {
    //-------------------------------//
    let value = e.target.value;
    if (e.key == "Backspace") return;
    if (e.key == "ArrowRight") return;
    if (e.key == "ArrowLeft") return;
    if (e.key == "Enter") handleClick(e);
    if (signUpPhoneInputFieldRef.current.value.length == 10) {
      e.preventDefault();
      return;
    }
    let regex = new RegExp("[^0-9]");
    if (regex.test(e.key)) {
      e.preventDefault();
      return;
    }
    if (!regex.test(e.key)) {
      let mobValue = signUpPhoneInputFieldRef.current.value + e.key;
      if (mobValue.length > 0) {
        setErrMsg("");
      } else if (isValidMobileNumber(mobValue)) {
        setErrMsg("");
      }
    }
    if (e.key == "E" || e.key == "e") {
      e.preventDefault();
      return;
    }
  }; //-------------------------------//

  function getSoruceNamefunction() {
    if (jdlite == 1 && sourceCode == 2) {
      return "jdlite"
    } else {
      return getSource[sourceCode]
    }
  }

  const handleHotLeadApiCall = (iswarm = false) => {
    let val = signUpPhoneInputFieldRef.current.value;
    if (!isValidMobileNumber(val)) return;
    let localStorageCity = Array.isArray(JSON.parse(window?.localStorage?.getItem("recentLocation"))) ? JSON.parse(window?.localStorage?.getItem("recentLocation"))[0]?.city : null
    let payload = {
      number: val,
      data_city: city ? city : cityParams ? cityParams : localStorageCity ? localStorageCity : "",
      session: sesionId,
      platform: getSoruceNamefunction(),
      campaign_name:chl == 1 ? "campaign_freelisting_warm" : "new_free_listing_warm",
      data_source: chl == 1 ? 'campaign_freelisting_warm' : "Joinfree",
      link_location: "NewFL_mobile_number_blur"
    }
    if (lastPhoneNumber !== val) {
      setLastPhoneNumber(val)
      generateHotLead(payload, iswarm)
    }
  };

  const checkBlockedNumber = async (mobileNumber) => {
    let tempMobileNumber = mobileNumber || null
    let flag = false;
    if (tempMobileNumber) {
      let url = `/api/v2/checkblockednumber`
      flag = await axios.post(url, { mobile: tempMobileNumber })
        .then((res) => {
          return res?.data.status || false;
          // if(!res?.data.status) return false;
          // else true;
        })
        .catch((err) => {
          return true
        })
    }
    return flag
  }

  const unsubscribeEvents = () => {
    //unsubscribe func
    if (createAccButtonRef.current)
      createAccButtonRef.current.removeEventListener("click", handleClick);
  };

  useEffect(() => {
    if (createAccButtonRef.current)
      createAccButtonRef.current.addEventListener("click", handleClick); //attaching event listner on create acc button
    if (signUpPhoneInputFieldRef.current) {
      // value={mobileNumber}
      signUpPhoneInputFieldRef.current.value = mobileNumber;
      signUpPhoneInputFieldRef.current.addEventListener(
        "keydown",
        handleMobileInput
      );
      signUpPhoneInputFieldRef.current.addEventListener(
        "wheel",
        preventDefaultEvents
      );
      signUpPhoneInputFieldRef.current.focus();
    }
    return unsubscribeEvents;
  }, []);



  useEffect(() => {
    try {
      if (!sesionId) {
        generateSessionId().then(data => {
          dispatch(updateCommonValues({ key: "sesionId", value: data ? data : "" }));
        })
      }
    } catch (e) {
      console.log(e, "error")
    }
    document.cookie = "isSignUpLoaded=true"
  }, [])


  const errorMsgPopup = () => {
    if (isEmptyString(errMsg)) return null;
    return <div className="error__message mt-5">{errMsg}</div>;
  };

  let inputWrapClassName = "inputwrap";
  if (!isEmptyString(errMsg)) inputWrapClassName += " inputwrap__error";

  const setResponceToDefault = () => {
    setResponceMsg("");
  };

  const showToast = () => {
    if (!responceMsg?.length) return;
    setTimeout(() => {
      setResponceToDefault();
    }, 3000);
    return (
      <div className={`toastmessage font11 colorfff`}>
        <span className={`toastmessage__text`}>{responceMsg}</span>
        <span
          onClick={setResponceToDefault}
          className={`iconwrap closeiconwhite ripple`}
        />
      </div>
    );
  };
  return (
    <>
      <div className={`${styles.signup} container__center`}>
        {/* <a href="https://www.justdial.com/">
          <span
            className={`${styles.closeicon__popup} iconwrap closeicon ripple`}
          />
        </a> */}
        <div className={`box`}>
          <div className={`box__left`}>
            <div className="logo">
              <a href="#">
                <img
                  src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg"
                  alt="justdial logo"
                />
              </a>
            </div>
          </div>
          <div className={`box__right`}>
            <div className={`${styles.signup__title} color111 fw700`}>
              {title}
            </div>
            <div className={`${styles.signup__inputwrap} mb-30 pb-5`}>
              <span className={`${styles.countrycode} color111 font15`}>
                <span className={`${styles.countryflag} mr-5`}>
                  <img
                    src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/india.svg"
                    alt="country flag"
                  />
                </span>
                {country_code}
              </span>
              <div className={inputWrapClassName}>
                <input
                  className="input"
                  autoComplete="off"
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  required
                  onBlur={() => handleHotLeadApiCall(true)}
                  ref={signUpPhoneInputFieldRef}
                />
                <label className="input__label">{mobile_lable}</label>
                {errorMsgPopup()}
              </div>
            </div>
            {!loader ? (
              <button
                className="primarybutton fw500 ripple"
                ref={createAccButtonRef}
              >
                <span />
                {button_txt}
                <span />
              </button>
            ) : (
              <button className={`primarybutton`}>
                <span className="btn-loader" />
              </button>
            )}
            <div className={`${styles.agree} color999`}>
              {sign_up_info}&nbsp;
              <a
                className="color999"
                onClick={() => redirectToPrivacyAndPolicy(sourceCode)}
              // href={sourceCode == 7 ? "https://www.justdial.com/Terms-of-Use" : "https://www.justdial.com/mobileTC?wap=2&source=2&nh=1&nd=1&ln=en&ver=1.0"}
              >
                {terms_of_service}
              </a>
              &nbsp;&#38;&nbsp;
              <a
                className="color999"
                onClick={() => redirectToPrivacyAndPolicy(sourceCode)}
              // href={sourceCode == 7 ? "https://www.justdial.com/Terms-of-Use" : "https://www.justdial.com/mobileTC?wap=2&source=2&nh=1&nd=1&ln=en&ver=1.0"}
              >
                {privacy_Policy}
              </a>
            </div>
          </div>
        </div>
      </div>
      {showToast()}
    </>
  );
}

//-----------
// space - &nbsp;
// & - &#38;
//-----------

//-----------
