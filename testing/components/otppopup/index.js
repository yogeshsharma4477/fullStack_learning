import React, { useEffect, useRef, useState } from "react";
import modal from "../../styles/modal.module.scss";
import styles from "./otp.module.scss";
import Image from 'next/image'
import { useDispatch, useSelector } from "react-redux";
import { updateMultipleOTPValues, updateOTPValues } from "@/store/Slices/landingPageSlice";
import { sendOTP, trackingDashboardAPI, verifyOTPApiCall } from "@/utils/api";
import Timer from "../common/Timer";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import Limitreached from "../limitreached";
import { useRouter } from "next/router";
import { new_fl_ct_otpSuccess, new_fl_ct_otpSuccess_hasbusiness, new_fl_ct_otpSuccess_nobusiness } from "@/utils/newClickTrackerFun";
import { clickTracker } from "@/utils/commonFunc";
import axios from "axios";
import { removeRepetitiveQueryParams, sanitizeParams } from "@/utils/commonFunc";


const errorMessage = {
  emptyOTP: 'Please enter otp',
  invalidOTP: 'Please enter valid otp',
}

function ClickTrackerAPICall(sourceCode='7', popUpIndex) {
  try{
      const type  = popUpIndex?.toString()
      var curr_li = null;
      var curr_ll = null;
      if(type == '1'){
          curr_li = 'OTPV_stnow_1';
          curr_ll = 'NFL_LP';
      }
      if(type == '2'){
        curr_li = 'OTPV_stnow_2';
        curr_ll = 'NFL_LP';
      }
      if(type == '3'){
        curr_li = 'OTPV_cfa';
        curr_ll = 'NFL_LP';
      }
      if( !(curr_ll && curr_li) ) return;
      clickTracker({
          li: curr_li,
          ll: curr_ll,
          sourceCode: sourceCode,
      })
  } catch (error){
      console.error(`issue in ${popUpIndex} click tracker call pls check error logs`);
      console.error(error);
  }
}

const Otppopup = (props) => {

  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);
  const { moblieNumber = '' } = props;
  const [errMsg, setErrMsg] = useState('');
  const [showResendOTP, setShowResendOTP] = useState(false);
  const isCheckTImerVal = useRef(false);
  const [resendCount, setResendCount] = useState(1);
  const [isResendOtpDone, setIsResendOtpDone] = useState(false);
  const attemptCount = useRef(3);
  const [isLoading, setIsLoading] = useState(false);
  const index = useSelector((state) => state.CommonValues.fromIndex);
  let page = router.pathname.includes("successStories") ? "successStories" : "landing"
  const isHasBusiness = useSelector((state) => state.CommonValues?.isBussiness);
  let sourceCode = sanitizeParams(router?.query?.source) || null;
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  const isShowOTP =  useSelector((state) =>  state?.landinfPageSlice.isShowOTP)
  const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
  const IP = useSelector((state) => state.CommonValues?.ip || '')
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (autoFillOtp && autoFillOtp.length === 6) {
  //     const newOtp = autoFillOtp.split('');
  //     setOtp(newOtp);
  //   }
  // }, [autoFillOtp]);
  const newClickTrackerCall = (li, ll) => {
    if (sourceCode == null) {
      let device_userAgent = navigator.userAgent;
      if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          device_userAgent
        )
      ) {
        sourceCode = "2";
      } else {
        sourceCode = "7";
      }
    }
    clickTracker({
      sourceCode: sourceCode,
      li: li,
      ll: ll,
    });
  };

  useEffect(() => {
    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'load',
      IP: IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile: moblieNumber || "",
      docid: "",
      sessionId: sesionId || "",
      city: ""
    }
   let referrer = window.location.origin + window.location.pathname + '/otpverification'
   trackingDashboardAPI(trackingDataPayload, referrer);
    // Set focus on the first input field when the component initially renders
    otpInputRefs.current[0].focus();
  }, []);

  const popUpIndex = useSelector((state) => state.landinfPageSlice?.index);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && index >= 0 && index <= 5) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input field
      if (value !== '' && index < 5) {
        otpInputRefs.current[index + 1].focus();
      }

      // Check if all fields are filled and trigger a function
      if (newOtp.every((digit) => digit !== '')) {
        handleAllDigitsFilled(newOtp.join(''));
      }
    }
  };

  async function checkAvailableBuisness(mobileNo) {
    try{
        const url = `/api/v2/checkisbuisness?mobile=${mobileNo}`
        let flag = false;
        if(isHasBusiness!=null){
            flag = isHasBusiness;
        } else {
            const responce = await axios.get(url);
            flag = responce?.data?.isBusiness
            updateCommonValues({ key: 'isBussiness', value: flag })
        }
        if (flag) {
            CT_P = clickTracker({
                sourceCode: sourceCode,
                li: new_fl_ct_otpSuccess_hasbusiness(index, page),
                ll: page === "landing" ? "NFL_LP" : "NFL_SSpage",
            })
        } else {
            CT_P = clickTracker({
                sourceCode: sourceCode,
                li: new_fl_ct_otpSuccess_nobusiness(index, page),
                ll: page === "landing" ? "NFL_LP" : "NFL_SSpage",
            })
        }
        return null;
    } catch(error) {
        console.log(error)
        return null
    }
}



  const handleAllDigitsFilled = async (otpCombinedVal) => {
    // Implement the function you want to trigger when all digits are filled.
    if (otpCombinedVal?.length == 6) {
      ClickTrackerAPICall(sourceCode, popUpIndex)
      setIsLoading(true)
      const isVerified = await verifyOTPApiCall(moblieNumber, otpCombinedVal, 7);
      if (isVerified.match) {
        try {
          let trackingDataPayload = {
            source: sourceCode,
            clickType: 'click',
            IP: IP || "",
            trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
            mobile: moblieNumber || "",
            docid: "",
            sessionId: sesionId || "",
            city: ""
          }
         let referrer = window.location.origin + window.location.pathname + '/otpverification'
         await trackingDashboardAPI(trackingDataPayload, referrer);
        } catch (error) {
          console.log(error?.message)
        }
        newClickTrackerCall(new_fl_ct_otpSuccess(index,page),page === "landing" ? "NFL_LP" : "NFL_SSpage")
        await checkAvailableBuisness(moblieNumber)
        // click tracker implementaion
        // const sourceCode = sanitizeParams(router?.query?.source);
        // clickTracker({
        //   sourceCode: sourceCode,
        //   li: "FL_Pageload",
        //   ll: "FL_PageLoad",
        // });



        let query = window?.location?.search || ''

        dispatch(updateCommonValues({ key: "isDirectLand", value: false }));

        let deviceId = new Date()
        deviceId = +deviceId;
        deviceId = Math.floor(deviceId / 10000)

        document.cookie = `deviceId=${deviceId}`;
        // router.
        document.body.classList.remove('bodyfixed')
        // query = removeRepetitiveQueryParams(query)
        router.push({
          pathname: '/bussinesslist',
          query: router.query || {}
      })

      } else {
        setIsLoading(false)
        if (attemptCount.current > 0) {
          attemptCount.current -= 1;
        }
        setErrMsg(`Invalid OTP. You have ${attemptCount.current} attempt(s) left.`)

        // setIsLoader(false);
        // setButtonError(`Invalid OTP. You have ${attemptCount.current} attempt(s) left.`)
      }
    }
  };

  function ClosePopup() {
    document.body.classList.remove('bodyfixed')
    dispatch(updateMultipleOTPValues({
      isShowOTP: false,
      moblieNumber: '',
    }))
  }

  const resendAPICall = async () => {
    await sendOTP(moblieNumber, 7);
  };

  const resendOPTFunc = () => {
    attemptCount.current = 3;
    if (resendCount < 4) {
      setResendCount((resendCount + 1));
      resendAPICall();
    }
    // console.log("here", resendCount)
    setShowResendOTP(false)
    isCheckTImerVal.current = false
    setIsResendOtpDone(true)
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpInputRefs.current[index - 1].focus();
      if (attemptCount.current > 0) {
        setErrMsg('')
      }
    }
  };

  function OTPErrMsg() {
    if (errMsg?.length == 0) {
      return null;
    } else {
      return (<span className={`${styles.error__text}`}>{errMsg}</span>)
    }
  }

  return (
    <div className={`${modal.modal__overlay}`}>
      {/* <div className={`${modal.modal} ${styles.otp} ${styles.login}`}> */}
      <div className={`${modal.modal} ${styles.otp}`}>
        <div className={`${modal.modal__header} ${styles.modal__header}`}>
          <Image width={93} height={24} src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg" alt="justdial logo" />
          <div className={`${styles.modal__header__right} color111`}>
            <b>OTP Verification</b>
            <p className={`m-0`}>India’s # 1 Local Search Engine</p>
          </div>
          <button className={`iconwrap closeicon`} onClick={ClosePopup} />
        </div>
        <span className={`${styles.loadborder__wrap}`}>
          <span className={`${styles.loadborder}`} />
        </span>
        {/* <div className={`${modal.modal__body} ${styles.modal__body} flex flex__col`}>
          <div className={`${styles.login__inner} color111 fw500`}>
            <span>+91</span>
            <input aria-label="Mobile Number" type="number" placeholder="Mobile Number" />
          </div>
          <button aria-label="Login" disabled className={`${styles.primarybutton} primarybutton fw500 ripple`}>Login with OTP</button>
          <div className={`${styles.or} color777 transparentButton`}>
            <span className={`${styles.or__inner}`}>Or Login Using</span>
          </div>
          <div className={`${styles.sociallogin}`}>
            <button aria-label="google" tabIndex="0" className={`${styles.login_go} mr-10`}>
              <span className={`iconwrap ${styles.googleicon} mr-10`} />
              <span className={`font16 fw400 color777`}>Google</span>
            </button>
            <button aria-label="google" tabIndex="0" className={`${styles.login_fb} ml-10`}>
              <span className={`iconwrap ${styles.fbicon} mr-10`} />
              <span className={`font16 fw400 color777`}>Facebook</span>
            </button>
          </div>
        </div> */}
        <div className={`${modal.modal__body} ${styles.modal__body} flex flex__col`}>
          <p className={`color111 m-0`}>Enter the code sent to <b>{`+91 - ${moblieNumber}`}</b> <button className={`iconwrap ${styles.editicon}`} /></p>
          <div className={`${styles.inputwrap} ${errMsg.length ? styles.inputwrap__error : ''}`}>
            {otp.map((digit, index) => (
              <input
                type="text"
                key={index}
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyUp={(e) => handleBackspace(e, index)}
                ref={(input) => (otpInputRefs.current[index] = input)}
                maxLength="1"
                name={`otp${index + 1}`}
                autoComplete={`one-time-code otp${index + 1}`}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
          {OTPErrMsg()}
          {<div
            className={`mt-10 ${styles.success__errormsg} ${isResendOtpDone && !showResendOTP ? '' : 'visibility__hidden'}`}
          >
            <Image
              className={`${styles.success__icon}`}
              priority={true}
              src="//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/greentick.svg"
              width={21} height={21}
            />
            <span className="color111 font14">{`OTP has been resent.`}</span>
          </div>}
          <p className={`color777 flex m-0 ${styles.retry}`}>
            {!(resendCount > 0 && !showResendOTP) && resendCount <= 2 ? <span>{'Not received your OTP?'}&nbsp;</span> : null}
            <span>
              {resendCount > 0 && !showResendOTP && resendCount <= 2 ? 'Resend OTP in' : ""}&nbsp;
              {!showResendOTP && resendCount <= 2 ? <Timer
                count={resendCount}
                delayResend={"20"}
                setShowResendOTP={(val) => { setShowResendOTP(val) }}
                isCheckTImerVal={isCheckTImerVal}
                setIsCheckTImerVal={(val) => isCheckTImerVal.current = val}
              /> : null}
            </span>
            {showResendOTP && resendCount <= 2 ?
              <button className={`${styles.resendopt}`} onClick={resendOPTFunc}>Resend OTP</button>
              :
              null
            }
          </p>
        </div>
        <div className={`${modal.modal__footer} ${styles.modal__footer}`}>
          {!isLoading ? <button disabled={!(otp.join('')?.length == 6)} className="primarybutton fw500 ripple">Continue</button>
            : (<button className={`primarybutton fw500`}>
              <span className="btn-loader" />
            </button>)}
        </div>

      </div>
      {/* <Limitreached /> */}
    </div>
  );
};

export default Otppopup;
