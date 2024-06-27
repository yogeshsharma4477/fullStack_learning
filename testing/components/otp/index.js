import React, { useEffect, useRef, useState } from "react";
import styles from "./otp.module.scss";
import { common, otp } from "@/utils/string";
import Timer from "../common/Timer";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP, verifyOTPApiCall } from "@/utils/api";
// import { useRouter } from "next/router";
import { useRouter } from "next/router";
import Limitreached from "../limitreached";
import clickTracker from "@/utils/clickTracker";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import Image from 'next/image'

const getDisplayLabels = () => {
  const title = otp?.title || "OTP Verification";
  const retry_action = otp?.retry_action || "Retry in";
  const otp_not_recieved_info = otp?.info || "Not received your OTP? ";
  const enter_otp_placeholder =
    otp?.placeholder_enter_otp || "Enter the code sent to";
  const resend_OTP_button_txt = otp?.resend_OTP || "RESEND OTP";
  const error_invalid_otp =
    common?.errMsg?.invalidOTP || "Please Enter a Valid OTP";

  return {
    title,
    retry_action,
    otp_not_recieved_info,
    enter_otp_placeholder,
    resend_OTP_button_txt,
    error_invalid_otp,
  };
};

export default function Otp() {
  const router = useRouter();
  const mobileNumber = useSelector(
    (state) => state.CommonValues?.mobileNumber || ""
  );
  const source = useSelector((state) => state.CommonValues.source);
  const [isResendOtpDone, setIsResendOtpDone] = useState(false);

  const dispatch = useDispatch();

  const OTPInput1 = useRef(null);
  const OTPInput2 = useRef(null);
  const OTPInput3 = useRef(null);
  const OTPInput4 = useRef(null);
  const OTPInput5 = useRef(null);
  const OTPInput6 = useRef(null);
  const resendOTPButtonRef = useRef(null);
  let isAllField = useRef(0);
  let [resendCount, setResendCount] = useState(1);
  const [isError, setIsError] = useState(false);
  const [buttonError, setButtonError] = useState('');
  const [islimit, setIslimit] = useState(false);
  const [showResendOTP, setShowResendOTP] = useState(false);
  const isCheckTImerVal = useRef(false);
  const attemptCount = useRef(3);
  const [loader, setIsLoader] = useState(false)

  const verifyOTP = async () => {
    setIsLoader(true)
    attemptCount.current -= 1;
    let OTP = "";
    OTP += OTPInput1.current.value;
    OTP += OTPInput2.current.value;
    OTP += OTPInput3.current.value;
    OTP += OTPInput4.current.value;
    OTP += OTPInput5.current.value;
    OTP += OTPInput6.current.value;
    let isVerified = await verifyOTPApiCall(mobileNumber, OTP, source);
    document.cookie = "isFlow= true";
    if (isVerified.match) {
      //click tracker implementaion
      const sourceCode = router?.query?.source;
      clickTracker({
        sourceCode: sourceCode,
        li: "FL_Pageload",
        ll: "FL_PageLoad",
      });

      let query = window?.location?.search || ''

      dispatch(updateCommonValues({ key: "isDirectLand", value: false }));

      let deviceId = new Date()
      deviceId = +deviceId;
      deviceId = Math.floor(deviceId / 10000)

      document.cookie = `deviceId=${deviceId}`;

      router.push({
        pathname: '/bussinesslist',
        query: router.query || {}
    })

    } else {
      setIslimit(isVerified.islimit);
      setIsError(true);
      setIsLoader(false);
      setButtonError(`Invalid OTP. You have ${attemptCount.current} attempt(s) left.`)
    }
  };

  const goOneInputTabBack = (id) => {
    if (id === "1") return;
    if (id === "2") {
      OTPInput2.current.blur();
      OTPInput1.current.focus();
      return;
    }
    if (id === "3") {
      OTPInput3.current.blur();
      OTPInput2.current.focus();
      return;
    }
    if (id === "4") {
      OTPInput4.current.blur();
      OTPInput3.current.focus();
      return;
    }
    if (id === "5") {
      OTPInput5.current.blur();
      OTPInput4.current.focus();
      return;
    }
    if (id === "6") {
      OTPInput6.current.blur();
      OTPInput5.current.focus();
      return;
    }
  };

  const goOneInputTabNext = (id) => {
    if (id === "1") {
      OTPInput1.current.blur();
      OTPInput2.current.focus();
      return;
    }
    if (id === "2") {
      OTPInput2.current.blur();
      OTPInput3.current.focus();
      return;
    }
    if (id === "3") {
      OTPInput3.current.blur();
      OTPInput4.current.focus();
      return;
    }
    if (id === "4") {
      OTPInput4.current.blur();
      OTPInput5.current.focus();
      return;
    }
    if (id === "5") {
      OTPInput5.current.blur();
      OTPInput6.current.focus();
      return;
    }
    if (id === "6") return;
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e?.target?.value?.length == 6) {
      let value = e.target.value;
      OTPInput1.current.value = value[0];
      OTPInput2.current.value = value[1];
      OTPInput3.current.value = value[2];
      OTPInput4.current.value = value[3];
      OTPInput5.current.value = value[4];
      OTPInput6.current.value = value[5];
      verifyOTP();
      return;
    }

    let Oto9Regex = /[0-9]/;
    let keyCodeBackspace = 8;
    let keyCodeEnter = 13;
    let keyCodeTab = 9;
    let elementRef = e.target;
    let pressed_key = e.which;

    if (typeof pressed_key === "undefined") return;

    if (pressed_key === keyCodeBackspace) {
      console.log("prathmesh once", isError)
      setIsError(false);
      elementRef.value = "";
      if (isAllField.current > 0) isAllField.current -= 1;
      setTimeout(() => {
        goOneInputTabBack(elementRef.id);
      }, 100);
    }
    if (keyCodeEnter === pressed_key || keyCodeTab === pressed_key) {
      goOneInputTabNext(elementRef.id);
    }
    if (Oto9Regex.test(e.key)) {
      console.log("prathmesh once", isError)
      elementRef.value = e.key;
      setIsError(false);
      if (isAllField.current < 6) isAllField.current += 1;
      setTimeout(() => {
        console.log(isError, "fdsf")
        // if(isError) setIsError(false);
        // if(buttonError?.length==0) setButtonError('')
        goOneInputTabNext(elementRef.id);
      }, 100);
    }
    let OTP = "";
    OTP += OTPInput1.current.value;
    OTP += OTPInput2.current.value;
    OTP += OTPInput3.current.value;
    OTP += OTPInput4.current.value;
    OTP += OTPInput5.current.value;
    OTP += OTPInput6.current.value;
    if (OTP.length == 6) {
      verifyOTP();
      return;
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    let OTP = "";
    OTP += OTPInput1.current.value;
    OTP += OTPInput2.current.value;
    OTP += OTPInput3.current.value;
    OTP += OTPInput4.current.value;
    OTP += OTPInput5.current.value;
    OTP += OTPInput6.current.value;
    if (OTP?.length == 0) {
      setIsError(true);
      setButtonError('Please Enter OTP');
    } else {
      verifyOTP();
    }
  }

  useEffect(() => {
    OTPInput1.current.focus();
  }, []);

  const resendAPICall = async () => {
    await sendOTP(mobileNumber, source);
  };

  const resendOPTFunc = () => {
    console.log("apple")
    attemptCount.current = 3;
    if (resendCount < 4) {
      setResendCount((resendCount += 1));
      resendAPICall();
    }
    console.log("here", resendCount)
    setShowResendOTP(false)
    isCheckTImerVal.current = false
    setIsResendOtpDone(true)
  };

  useEffect(() => {
    if (!mobileNumber) {
      router.replace("/");
    }
    if ("OTPCredential" in window) {
      window.addEventListener("DOMContentLoaded", (e) => {
        const input = document.querySelector(
          'input[autocomplete="one-time-code"]'
        );
        if (!input) return;
        const ac = new AbortController();
        const form = input.closest("form");
        if (form) {
          form.addEventListener("submit", (e) => {
            ac.abort();
          });
        }
        navigator.credentials
          .get({
            otp: { transport: ["sms"] },
            signal: ac.signal,
          })
          .then((otp) => {
            alert("helloe", otp);
            //   input.value = otp.code;
            //   if (form) form.submit();
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  }, []);

  const subscribe = () => {
    OTPInput1.current.addEventListener("keydown", handleChange);
    OTPInput2.current.addEventListener("keydown", handleChange);
    OTPInput3.current.addEventListener("keydown", handleChange);
    OTPInput4.current.addEventListener("keydown", handleChange);
    OTPInput5.current.addEventListener("keydown", handleChange);
    OTPInput6.current.addEventListener("keydown", handleChange);
  };

  const unSubscribe = () => {
    if (OTPInput1.current) {
      OTPInput1.current.removeEventListener("keydown", handleChange);
    }
    if (OTPInput2.current) {
      OTPInput2.current.removeEventListener("keydown", handleChange);
    }
    if (OTPInput3.current) {
      OTPInput3.current.removeEventListener("keydown", handleChange);
    }
    if (OTPInput4.current) {
      OTPInput4.current.removeEventListener("keydown", handleChange);
    }
    if (OTPInput5.current) {
      OTPInput5.current.removeEventListener("keydown", handleChange);
    }
    if (OTPInput6.current) {
      OTPInput6.current.removeEventListener("keydown", handleChange);
    }
  };

  useEffect(() => {
    subscribe();

    return unSubscribe;
  }, []);

  const {
    title,
    retry_action,
    otp_not_recieved_info,
    enter_otp_placeholder,
    resend_OTP_button_txt,
    error_invalid_otp,
  } = getDisplayLabels(); //  fetch label to show

  let inputWrapperClassList = !isError
    ? "inputwrap"
    : "inputwrap inputwrap__error";

  return (
    <div className={`${styles.opt} container__center`}>
      {/* <span
        className={`${styles.closeicon__popup} iconwrap closeicon ripple`}
        onClick={() => router.back()}
      /> */}
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
          <div className={`${styles.overlay}`} />
        </div>
        <div className={`${styles.box__right} box__right`}>
          <div className={`${styles.signup__title} color111`}>
            <span
              className={`iconwrap closeicon ripple`}
              onClick={() => router.back()}
            />
            {title}
            <span className={`${styles.loadborder__wrap}`}>
              <span className={`${styles.loadborder}`} />
            </span>
          </div>
          <div className={`${styles.popupbody}`}>
            <div className={`${styles.codesent} color111`}>
              {enter_otp_placeholder}{" "}
              <span className="fw600">{`+91 ${mobileNumber}`}</span>
            </div>
            <div className={`${styles.signup__inputwrap}`}>
              <div className={inputWrapperClassList}>
                <input
                  id="1"
                  className="input"
                  type="tel"
                  required
                  ref={OTPInput1}
                  autocomplete="one-time-code"
                  onChange={handleChange}
                />
                <input
                  id="2"
                  className="input"
                  type="tel"
                  required
                  ref={OTPInput2}
                  autoComplete="off"
                  onChange={handleChange}
                />
                <input
                  id="3"
                  className="input"
                  type="tel"
                  required
                  ref={OTPInput3}
                  autoComplete="off"
                  onChange={handleChange}
                />
                <input
                  id="4"
                  className="input"
                  type="tel"
                  required
                  ref={OTPInput4}
                  autoComplete="off"
                  onChange={handleChange}
                />
                <input
                  id="5"
                  className="input"
                  type="tel"
                  required
                  ref={OTPInput5}
                  autoComplete="off"
                  onChange={handleChange}
                />
                <input
                  id="6"
                  className="input"
                  type="tel"
                  required
                  ref={OTPInput6}
                  autoComplete="off"
                  onChange={handleChange}
                />
                {console.log(isError, "isError")}
                {isError ? (
                  <div className="error__message mt-5 ml-20">{buttonError || error_invalid_otp}</div>
                ) : null}
              </div>
            </div>

            {<div
              className={`mb-10 ${styles.success__errormsg} ${isResendOtpDone && !showResendOTP ? '' : 'visibility__hidden'}`}
            >
              <Image
                className={`${styles.success__icon}`}
                priority={true}
                src="//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/greentick.svg"
                width={21} height={21}
              />
              <span className="color111 font14">{`OTP has been resent.`}</span>
            </div>}
            {
              <div className={`${styles.optlabel}`}>
                <div className={`${styles.otpnotrecieve} color777`}>
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
                </div>
                {showResendOTP && resendCount <= 2 ? <button
                  onClick={resendOPTFunc}
                  className={`${styles.resendotp}`}
                  ref={resendOTPButtonRef}
                >
                  {resend_OTP_button_txt}
                </button> : null}
              </div>
            }
            {!loader ? (
              <button
                className="mt-20 primarybutton fw500 ripple"
                onClick={handleSubmit}
              >
                <span />
                {'Submit'}
                <span />
              </button>
            ) : (
              <button className={`mt-20 primarybutton`}>
                <span className="btn-loader" />
              </button>
            )}
          </div>
        </div>
      </div>
      {islimit ? <Limitreached /> : null}
    </div>
  );
}

//-----------
// space - &nbsp;
//-----------

//-----------
