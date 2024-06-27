import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from 'next/image'
import modalStyles from '../../styles/modal.module.scss'
import styles from "./Loginpopup.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateMultipleOTPValues } from "@/store/Slices/landingPageSlice"
import { isOnlyNumber, isValidMobileNumber } from "@/utils/validations";
import axios from "axios";
import { sendOTP } from "@/utils/api";

const LOGIN_BUTTON_TXT = 'Login with OTP';
const GOOGLE = 'Google';
const FACEBOOK = 'Facebook';
const COUNTRY_CODE = '+91';


function LoginPopup(props) {
  const { } = props;

  const [phoneNumber, setPhoneNumber] = useState({
    val: '',
    errMsg: '',
    isError: false
  });
  const [isLoading, setisLoading] = useState(false);
  const blockNumberMap = useRef({})
  const isShowLoginPopup = useSelector((state) => state?.landinfPageSlice?.isLoginPopupShow || false)
  useEffect(() => {

    if (isShowLoginPopup) {
      document.body.classList.add("bodyfixed");

    }
  }, [isShowLoginPopup])

  const dispatch = useDispatch();


  if (!isShowLoginPopup) {
    return null; //LoginPopup is closed
  }

  function ClosePopup() {
    try {
      setPhoneNumber({
        val: '',
        errMsg: '',
        isError: false
      })
      setisLoading(false)
      document.body.classList.remove("bodyfixed");
    } catch (e) {

    }
    dispatch(updateMultipleOTPValues({
      isLoginPopupShow: false
    }))
  }

  function handleMobileInputField(e) {
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
          errMsg: "",
          isError: false
        }));
      }
    }
  }

  async function TriggerOTP(mobileNumber) {
    try {
      const OTPAPIStatus = await sendOTP(mobileNumber, 7);
      if (OTPAPIStatus) {
        document.body.classList.add("bodyfixed");
        dispatch(
          updateMultipleOTPValues({
            isShowOTP: true,
            moblieNumber: mobileNumber,
            index: null
          })
        );
        ClosePopup()
      } else {
        setPhoneNumber((prev) => ({
          ...prev,
          errorMsg: "Reached Daily SMS Limit.",
          isError: true
        }));
      }
    } catch (err) {
      console.error('Login Popup, otp trigger error', err);
      setisLoading(false);
    }
  }

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

  async function ValidateNumber(mobileNumber) {
    try {
      let validNumberFlag = true;
      if (mobileNumber?.length != 10) return false;
      validNumberFlag = isValidMobileNumber(mobileNumber);

      if (validNumberFlag) {
        if (!blockNumberMap.hasOwnProperty(mobileNumber)) {
          blockNumberMap[mobileNumber] = await checkBlockedNumber(mobileNumber);
        }
        validNumberFlag = blockNumberMap[mobileNumber];
      }
      return validNumberFlag;
    } catch (err) {
      console.error('Login Popup, mobile number validation error', err);
      setisLoading(false);
    }
  }

  async function SubmitButtonFn(e) {
    if (e) e.preventDefault();
    const mobileNumber = phoneNumber.val;
    setisLoading(true);
    try {
      const isValidPhoneNumber = await ValidateNumber(mobileNumber);
      if (isValidPhoneNumber) {
        TriggerOTP(mobileNumber);
      } else {
        let errMsg = !phoneNumber?.val?.length ? 'Please Enter a Mobile Number' : 'Please Enter a Valid Mobile Number'
        setPhoneNumber((prev) => ({
          ...prev,
          val: mobileNumber,
          errMsg: errMsg,
          isError: true
        }));
        setisLoading(false);
      }
    } catch (err) {
      console.error("Login Popup, submit button error", err);
      setisLoading(false);
    }
  }

  function MobileInputError() {
    let errorMsg = phoneNumber?.errMsg || "";
    if (!phoneNumber?.isError) return null;
    return <span className={`${styles.error__text} ${styles.error__text}`}>{errorMsg}</span>;
  }

  return (
    <div className={`${modalStyles.modal__overlay}`}>
      <div className={`${modalStyles.modal} ${styles.login}`}>
        <div className={`${modalStyles.modal__header} ${styles.modal__header}`}>
          <Image width={93} height={24} src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg" alt="justdial logo" />
          <div className={`${styles.modal__header__right} color111`}>
            <b>Welcome</b>
            <p className={`m-0`}>India’s # 1 Local Search Engine</p>
          </div>
          <button className={`iconwrap closeicon`} onClick={ClosePopup} />
        </div>
        <span className={`${styles.loadborder__wrap}`}>
          <span className={`${styles.loadborder}`} />
        </span>
        <div className={`${modalStyles.modal__body} ${styles.modal__body} flex flex__col`}>
          <div className={`${styles.login__inner} color111 fw500`}>
            <span>{COUNTRY_CODE}</span>
            <input
              aria-label="Mobile Number"
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Mobile Number"
              autoComplete="off"
              maxLength="10"
              onChange={handleMobileInputField}
              value={phoneNumber?.val || ''}
            />
          </div>
          {MobileInputError()}
          <button
            aria-label="Login"
            disabled={isLoading}
            className={`${styles.primarybutton} primarybutton fw500 ripple`}
            onClick={async () => { await SubmitButtonFn() }}>
            {LOGIN_BUTTON_TXT}
          </button>
          {/* <div className={`${styles.or} color777 transparentButton`}>
                <span className={`${styles.or__inner}`}>Or Login Using</span>
              </div>
              <div className={`${styles.sociallogin}`}>
                <button aria-label="google" tabIndex="0" className={`${styles.login_go} mr-10`}>
                  <span className={`iconwrap ${styles.googleicon} mr-10`} />
                  <span className={`font16 fw400 color777`}>{GOOGLE}</span>
                </button>
                <button aria-label="google" tabIndex="0" className={`${styles.login_fb} ml-10`}>
                  <span className={`iconwrap ${styles.fbicon} mr-10`} />
                  <span className={`font16 fw400 color777`}>{FACEBOOK}</span>
                </button>
              </div> */}
        </div>

      </div>
    </div>
  );
}


export default LoginPopup;