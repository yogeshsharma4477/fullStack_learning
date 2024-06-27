import React, { useEffect, useReducer, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { error_msg } from '@/utils/formValidation/ErrorMsg'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { isEmptyString, clickTracker, getCookie, set_cookie, removeRepetitiveQueryParams, sanitizeParams, setCookie, delete_cookie } from '@/utils/commonFunc'
import { isOnlyNumber, isFieldEmpty } from '@/utils/validations'
import { updateMultipleAddressValues } from '@/store/Slices/AddressSlice'
import { updateCommonValues } from '@/store/Slices/commonDataSlice'
import { PostAddressAPI, ValidateAddressAPI, GenerateParentId } from '../../address/APICalls'
import { generateYears } from '../commonAPI'
import { isEmpty } from 'lodash'
import moment from 'moment'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default function Businessdetails({ loggedInMobile, IP, logWorker = () => { } }) {
  const { city = "", area = "", pincode = "", businessName = "", state = "", mobile_number = [], landline_number = [], contactPerson = "", stdcode = "" } = useSelector(state => state?.dcLandingSlice)
  const StoreCommonValueInfo = useSelector((state) => state.CommonValues)
  const router = useRouter()
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false)
  const [addressInfo, setAddressInfo] = useState({
    yearOfEstablishment: {
      month: {
        value: "",
        isFocused: false
      }, year: {
        value: "",
        isFocused: false
      }

    },
    block_num: '',
    street: '',
    landmark: '',
    newlyOpened: false,
  })
  const [responceMsg, setResponceMsg] = useState('')

  const [errorMsg, setErrorMsg] = useState({
    block_num: 'Please Enter Block Number / Building Name',
    street: 'Please Enter Street / Colony Name',
    landmark: 'Please Enter Landmark',
    year: "Please Select Year",
    month: "Please Select Month"
  })

  let [isError, setIsError] = useState({
    block_num: false,
    street: false,
    landmark: false,
    year: false,
    month: false
  })

  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false)
  function UpdateYearOfEstablished(name, node, value) {
    setIsFocused(value)
    setAddressInfo((prev) => {
      return { ...prev, yearOfEstablishment: { ...prev.yearOfEstablishment, [name]: { ...prev.yearOfEstablishment[name], [node]: value } } };
    });
  }

  const updateAddressInfo = (e) => {
    if (loader) return
    setAddressInfo((state) => ({
      ...state,
      [e.target.name]: [e.target.type] == "checkbox" ? e.target.checked : e.target.value,
    }))
    setIsError((prev) => {
      return { ...prev, [e.target.name]: false }
    })

  }
  const handleReadOnly = () => { }

  function getMonthNumber(monthName) {
    const monthIndex = moment().month(monthName)
    if (monthIndex.isValid()) {
      return parseInt(monthIndex.format('M')) - 1
    } else {
      throw new Error(`Invalid month name: ${monthName}`)
    }
  }

  function validateYearsOfEstablishment(month, year) {
    if (isEmpty(month) && isEmpty(year)) {
      return false
    }
    const currentMonthNumber = moment().month();
    const currentYear = moment().format('YYYY');
    const selectedMonthNumber = getMonthNumber(month)
    if (year == currentYear && currentMonthNumber < selectedMonthNumber) {
      setIsError({ ...isError, month: true })
      setErrorMsg({ ...errorMsg, month: "Select Valid Month" })
      return true;
    }

    if (isEmpty(month)) {
      setIsError({ ...isError, month: true })
      setErrorMsg({ ...errorMsg, month: "Please Select Month" })
      return true
    }

    if (isEmpty(year)) {
      setIsError({ ...isError, year: true })
      return true
    }
    return false
  }

  async function checkIsError() {
    let isErrors = false
    isErrors = validateYearsOfEstablishment(addressInfo.yearOfEstablishment.month.value, addressInfo.yearOfEstablishment.year.value)
    let ValidateAddressAPIResponse = await ValidateAddressAPI({
      building_name: addressInfo.block_num,
      street: addressInfo.street,
      landmark: addressInfo.landmark,
      data_city: city,
      state: state
    })

    let isAnyValidationError = ValidateAddressAPIResponse.data.results?.block?.msg
    if (isAnyValidationError) {
      let error_message = Object.values(isAnyValidationError)
      setResponceMsg(error_message[0])
    }
    if (isAnyValidationError?.building_name !== undefined || isEmptyString(addressInfo.block_num)) {
      setIsError((state) => ({ ...state, block_num: true }))
      setErrorMsg((state) => ({
        ...state,
        block_num:
          'Please Enter Valid Block Number / Building Name',
      }))
      isErrors = true
    }
    if (isAnyValidationError?.landmark !== undefined || isEmptyString(addressInfo.landmark)) {
      setIsError((state) => ({ ...state, landmark: true }))
      setErrorMsg((state) => ({
        ...state,
        landmark: 'Please Valid Enter Landmark',
      }))
      isErrors = true
    }
    if (isAnyValidationError?.street !== undefined || isEmptyString(addressInfo.street)) {
      setIsError((state) => ({ ...state, street: true }))
      setErrorMsg((state) => ({
        ...state,
        street: 'Please Enter Valid Street / Colony Name',
      }))
      isErrors = true
    }
    return isErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    let checkError = await checkIsError()
    if (checkError) {
      return;
    }
    setLoader(true)
    dispatch(
      updateMultipleAddressValues({
        pincode: pincode,
        block_num: addressInfo.block_num,
        street: addressInfo.street,
        area: area,
        city: city,
        state: state,
      })
    )
    dispatch(
      updateCommonValues({
        key: 'compName',
        value: businessName,
      })
    )
    dispatch(
      updateCommonValues({
        key: 'companyName',
        value: businessName,
      })
    )

    try {
      let getParentId = await GenerateParentId({ datacity: city, req_data_city: city })
      let parentInfo = getParentId?.data?.results
      dispatch(
        updateCommonValues({
          key: 'parentid',
          value: parentInfo.parentid ? parentInfo.parentid : '',
        })
      )
      dispatch(
        updateCommonValues({
          key: 'docid',
          value: parentInfo.docid ? parentInfo.docid : '',
        })
      )
      dispatch(
        updateCommonValues({
          key: 'shorturl',
          value: parentInfo.shorturl ? parentInfo.shorturl : '',
        })
      )
      dispatch(
        updateCommonValues({
          key: 'sphinx_id',
          value: parentInfo.sphinx_id ? parentInfo.sphinx_id : '',
        })
      )
      await logWorker("click", parentInfo.docid || '')

      const { docid = null, parentid = null, sphinx_id = null, } = StoreCommonValueInfo
      const tempSourceVal = sanitizeParams(router.query.source) || '2'
      if (!docid || !parentid || !businessName || !sphinx_id, !tempSourceVal || !pincode || !city) return
      try {
      } catch (error) {
        console.log(error.message)
      }
      let postAddressObject = {
        docid: parentInfo.docid,
        parentid: parentInfo.parentid,
        pincode: pincode,
        building_name: addressInfo.block_num,
        street: addressInfo.street,
        area: area,
        city: city,
        data_city: city,
        display_city: city,
        state: state,
        companyname: businessName,
        sphinx_id: parentInfo.sphinx_id,
        source: tempSourceVal,
        mobile_display: mobile_number.toString(),
        mobile: mobile_number.toString(),
        mobile_feedback: mobile_number.toString(),
        contact_person: contactPerson,
        contact_person_addinfo: contactPerson,
        stdcode: stdcode,
        landline: landline_number.toString(),
        landline_display: landline_number.toString(),
        IP: IP ? IP : '',
        landmark: addressInfo.landmark,
        page: 'Address',
      }

      PostAddressAPI(postAddressObject).then(async (res) => {
        if (res?.data?.success) {
          set_cookie('isFlow', true);
          set_cookie("docid", parentInfo.docid);
          let checkForLegal = getCookie('legalWord') || false;
          if (checkForLegal == 1) {
            dispatch(updateCommonValues({ key: 'isCopyright_infringement', value: true }))
          }
          delete_cookie('dcToken')
          router.push({
            pathname: "/dc/addtiming",
            query: router?.query || {},
          });
        } else {
          setLoader(false)
          setResponceMsg('Something went wrong')
        }
      })
    } catch (error) {
      setLoader(false)
      console.log(error.message, "error");
    }
  }

  const setResponceToDefault = () => {
    setResponceMsg('')
  }

  const showToast = () => {
    if (!responceMsg?.length) return
    setTimeout(() => {
      setResponceToDefault()
    }, 3000)
    return (
      <div className={`toastmessage font11 colorfff`}>
        <span className={`toastmessage__text`}>{responceMsg}</span>
        <span
          onClick={setResponceToDefault}
          className={`iconwrap closeiconwhite ripple`}
        />
      </div>
    )
  }

  function handle_click_outside(e) {
    if (e.target.tagName !== 'LI' && e.target.id !== 'month' && e.target.id !== 'year') {
      UpdateYearOfEstablished("year", "isFocused", false)
      UpdateYearOfEstablished("month", "isFocused", false)
    }
  }

  useEffect(() => {
    window.addEventListener('click', handle_click_outside)
    return () => window.removeEventListener('click', handle_click_outside)
  }, [])

  const handleDropDownArrow = (e, type) => {
    e.preventDefault()
    let typeCoversion = type == "month" ? monthRef : yearRef
    if (isFocused) {
      UpdateYearOfEstablished(type, "isFocused", false)
      typeCoversion.current.blur()
      setIsFocused(false)
    } else {
      UpdateYearOfEstablished(type, "isFocused", true)
      typeCoversion.current.focus()
      setIsFocused(true)
    }
    e.stopPropagation()
  }

  return (
    <div className={`container__inner`}>
      <form className={`form input_height`}>
        <div className={`mb-20 font14 fw600 color111`}>Enter Your Business Details</div>
        <div className={`inputwrap mb-20`}>
          <input
            className="input"
            name="businessName"
            value={businessName}
            onChange={handleReadOnly}
            type="text"
            disabled
            required
          />
          <label className={`input__label`}>Business Name</label>
          {/* <button className={`button iconwrap closeicon__grey`}></button> */}
        </div>
        <div className={`font14 color777 mb-10`}>Year Of Establishment</div>
        <div className={`flex`}>
          <div className={`inputwrap flex__inputwrap mb-20 ${isError.month ? 'inputwrap__error' : ''} mr-5`}>
            <input
              type="text"
              id='month'
              ref={monthRef}
              className={`input`}
              onChange={handleReadOnly}
              onFocus={() => UpdateYearOfEstablished("month", "isFocused", true)}
              value={addressInfo.yearOfEstablishment.month.value}
              required />
            <label className={`input__label`}>Month</label>
            <ul id="month"
              onClick={(e) => {
                UpdateYearOfEstablished("month", "value", e.target.innerHTML)
                UpdateYearOfEstablished("month", "isFocused", false)
                setIsError({ ...isError, year: false, month: false })
              }}
              className={`dropdown customscroll ${addressInfo.yearOfEstablishment.month.isFocused ? '' : 'dn'}`}>
              {isFocused && months.map(month => {
                return <li key={month}>{month}</li>
              })}
            </ul>
            <button className={`button iconwrap selectarrow`} onClick={(e) => handleDropDownArrow(e, "month", addressInfo.yearOfEstablishment.month.isFocused)}></button>
            <div className={`error__message mt-5 ${isError.month ? '' : 'dn'}`}>{errorMsg.month}</div>
          </div>
          <div className={`inputwrap flex__inputwrap mb-20 ${isError.year ? 'inputwrap__error' : ''}`}>
            <input
              type="text"
              id='year'
              ref={yearRef}
              className={`input`}
              onChange={handleReadOnly}
              onFocus={() => UpdateYearOfEstablished("year", "isFocused", true)}
              value={addressInfo.yearOfEstablishment.year.value}
              required />
            <label className={`input__label`}>Year</label>
            <ul id="year" onClick={(e) => {
              UpdateYearOfEstablished("year", "value", e.target.innerHTML)
              UpdateYearOfEstablished("year", "isFocused", false)
              setIsError({ ...isError, year: false, month: false })
            }} className={`dropdown customscroll ${addressInfo.yearOfEstablishment.year.isFocused ? '' : 'dn'}`}>
              {isFocused && generateYears(1911).map(year => {
                return <li key={year}>{year}</li>
              })}
            </ul>
            <button className={`button iconwrap selectarrow`} onClick={(e) => handleDropDownArrow(e, "year", addressInfo.yearOfEstablishment.year.isFocused)}></button>
            <div className={`error__message mt-5 ${isError.year ? '' : 'dn'}`}>{errorMsg.year}</div>
          </div>
        </div>
        <div className={`inputwrap mb-20`}>
          <input
            className="input"
            type="text"
            name="pincode"
            autoComplete="off"
            value={pincode}
            disabled
            onChange={handleReadOnly}
            required
          />
          <label className={`input__label`}>Select Pincode</label>
          {/* <button className={`button iconwrap selectarrow`}></button> */}
        </div>
        <div className={`inputwrap mb-20 ${isError.block_num ? 'inputwrap__error' : ''}`}>
          <input
            className="input"
            type="text"
            name="block_num"
            autoComplete="off"
            value={addressInfo.block_num}
            onChange={updateAddressInfo}
            required
            maxLength="250"
            onBlur={() => {
              let regex = /(?:([a-zA-Z])\1{3,}|(\d)\2{5})(?=(?:.*\d){0,6}$)/;
              if (addressInfo.block_num?.length) {
                let flag = regex.test(addressInfo.block_num)
                if (flag) {
                  setErrorMsg((prev) => {
                    return {
                      ...prev,
                      block_num: error_msg.MSG_BUILDING_REPCHAR

                    }
                  })
                  setIsError((prev) => {
                    return {
                      ...prev,
                      block_num: flag

                    }
                  })
                }
              } else {
                setErrorMsg((prev) => {
                  return {
                    ...prev,
                    block_num: ''

                  }
                })
                setIsError((prev) => {
                  return {
                    ...prev,
                    block_num: false

                  }
                })
              }
            }}
          />
          <label className={`input__label`}>Block Number / Building Name</label>
          <div className={`error__message mt-5  ${isError.block_num ? '' : 'dn'}`}>{errorMsg.block_num}</div>
        </div>
        <div className={`inputwrap mb-20 ${isError.street ? 'inputwrap__error' : ''}`}>
          <input
            className="input"
            type="text"
            name="street"
            autoComplete="off"
            value={addressInfo.street}
            onChange={updateAddressInfo}
            required
            maxLength="250"
            onBlur={() => {
              let regex = /(?:([a-zA-Z])\1{3,}|(\d)\2{5})(?=(?:.*\d){0,6}$)/;
              if (addressInfo.street?.length) {
                let flag = regex.test(addressInfo.street)
                if (flag) {
                  setErrorMsg((prev) => {
                    return {
                      ...prev,
                      street: error_msg.MSG_STREET_REPNUM

                    }
                  })
                  setIsError((prev) => {
                    return {
                      ...prev,
                      street: flag

                    }
                  })
                }
              } else {
                setErrorMsg((prev) => {
                  return {
                    ...prev,
                    street: ''

                  }
                })
                setIsError((prev) => {
                  return {
                    ...prev,
                    street: false

                  }
                })
              }
            }}
          />
          <label className={`input__label`}>Street / Colony Name</label>
          <div className={`error__message mt-5  ${isError.street ? '' : 'dn'}`}>{errorMsg.street}</div>
        </div>
        <div className={`inputwrap mb-20`}>
          <input
            className="input"
            type="text"
            name="area"
            value={area}
            disabled
            onChange={handleReadOnly}
            required
          />
          <label className={`input__label`}>Area</label>
        </div>
        <div className={`inputwrap mb-20  ${isError.landmark ? 'inputwrap__error' : ''}`}>
          <input
            className="input"
            type="text"
            onBlur={() => {
              let regex = /(?:([a-zA-Z])\1{3,}|(\d)\2{5})(?=(?:.*\d){0,6}$)/;
              if (addressInfo.landmark?.length) {
                let flag = regex.test(addressInfo.landmark)
                if (flag) {
                  setErrorMsg((prev) => {
                    return {
                      ...prev,
                      landmark: error_msg.MSG_LANDMARK_REPCHAR

                    }
                  })
                  setIsError((prev) => {
                    return {
                      ...prev,
                      landmark: flag

                    }
                  })
                }
              } else {
                setErrorMsg((prev) => {
                  return {
                    ...prev,
                    landmark: ''

                  }
                })
                setIsError((prev) => {
                  return {
                    ...prev,
                    landmark: false

                  }
                })
              }
            }}
            name="landmark"
            autoComplete="off"
            value={addressInfo.landmark}
            onChange={updateAddressInfo}
            required
            maxLength="250"
          />
          <label className={`input__label`}>Landmark</label>
          <div className={`error__message mt-5  ${isError.landmark ? '' : 'dn'}`}>{errorMsg.landmark}</div>
        </div>
        <div className={`flex`}>
          <div className={`inputwrap flex__inputwrap mb-20 mr-5`}>
            <input className="input"
              type="text"
              name="city"
              value={city}
              onChange={handleReadOnly}
              disabled
              autoComplete="off"
              required />
            <label className={`input__label`}>City</label>
            <div className={`error__message mt-5 dn`}>Please Select City</div>
          </div>
          <div className={`inputwrap flex__inputwrap mb-20`}>
            <input
              className="input"
              type="text"
              name="state"
              value={state}
              disabled
              onChange={handleReadOnly}
              required
            />
            <label className={`input__label`}>State</label>
            <div className={`error__message mt-5  ${!isError.state || addressInfo.state.length > 1 ? 'dn' : ''}`}>
              {errorMsg.state}
            </div>
          </div>
        </div>
        <label className={`font13 mb-10 color007 fw500 ${styles.samefield}`}>
          <input type="checkbox" name="newlyOpened" onChange={updateAddressInfo} checked={addressInfo.newlyOpened} />
          <span className={styles.uncheck} />
          <span className={`fw500 color111 font15`}>Newly Opened</span>
        </label>
        {showToast()}

        {!loader ? (
          <button className={`primarybutton fw500 ripple mt-10`} onClick={handleSubmit}>Save and Continue</button>) : (
          <button disabled className={`primarybutton mt-10`}><span className="btn-loader" /></button>)}
      </form>
    </div>
  )
}
