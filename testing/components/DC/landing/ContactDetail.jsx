import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { error_msg } from "../../../utils/formValidation/ErrorMsg"
import { isOnlyNumber, isValidMobileNumber } from '@/utils/validations'
import axios from 'axios'
import { updateLandlineNumber, updateMobileNumber, updatecontactPerson } from '@/store/Slices/AddContactSlice'
import { useRouter } from 'next/router'
import { generateDCToken, getCookie, set_cookie } from '@/utils/commonFunc'
import { checkGlobalValidationApi, updateDcDetailsApi } from '../commonAPI'
import { updateMultipleState } from '@/store/Slices/dc/landing'

function ContactDetail(props) {
    const { loggedInMobile = "", logWorker } = props
    const { title = "", contactPerson: personName = "", landline_number = [], mobile_number = [], city = "", area = "", pincode = "", businessName = "", stdcode = "" } = useSelector(state => state?.dcLandingSlice)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (!contactPerson.name && personName) {
            setContactPerson({ ...contactPerson, title: title, name: personName })
        }
        if (mobile_number?.length && !addMobileNum[0]?.mobile) {
            let temp = {
                id: uuidv4(),
                mobile: "",
                error: false,
                error_message: 'Please Enter Mobile Number',
            }
            setAddMobileNum(mobile_number.map(mobile => {
                return { ...temp, id: uuidv4(), mobile: mobile }
            }))
        }
        if (!addLandlineNum[0]?.landline && landline_number?.length) {
            let temp = {
                id: uuidv4(),
                extensionNum: stdcode,
                landline: "",
                error: false,
                error_message: "Please Enter Landline Number",
            }
            setAddLandlineNum(landline_number.map(landline => {
                return { ...temp, id: uuidv4(), landline: landline }
            }))
        }
    }, [personName, landline_number, mobile_number])
    const [contactPerson, setContactPerson] = useState({
        title: title || 'Mr',
        name: personName || "",
        title_error: false,
        name_error: false,
        title_drop: false,
        err_msg: ""
    })
    const [addMobileNum, setAddMobileNum] = useState([
        {
            id: uuidv4(),
            mobile: "",
            error: false,
            error_message: 'Please Enter Mobile Number',
        },
    ])
    let [addLandlineNum, setAddLandlineNum] = useState([
        {
            id: uuidv4(),
            extensionNum: stdcode || "",
            landline: "",
            error: false,
            error_message: "Please Enter Landline Number",
        },
    ])
    const [dropdownActiveIndex, setDropdownActiveIndex] = useState(0)
    const [loader, setLoader] = useState(false)
    const inputRef = useRef(null)
    const errData = useRef({
        mobile: [],
        landline: [],
        email: []
    })
    const blurCheckStatus = useRef({
        name: false,
        mobile: false,
        landline: false
    })
    const [responceMsg, setResponceMsg] = useState('')

    function handleAddMobileNumber(opsType = 'add', id = undefined, index) {
        if (opsType === 'remove' && index !== 0) {
            setAddMobileNum((previousState) =>
                previousState.filter((inputArray) => inputArray.id !== id)
            )
        }
        if (addMobileNum.length < 3 && opsType !== 'remove') {
            setAddMobileNum((previousState) => [
                ...previousState,
                {
                    id: uuidv4(),
                    mobile: '',
                    error: false,
                    error_message: 'Please Enter Mobile Number',
                },
            ])
        }
    }

    function handleMobileInput(e, uid) {
        let mobNum = e.target.value
        if (mobNum) mobNum = mobNum.replace(/\+91/, '').replace(/[^\d]/g, '')
        mobNum = mobNum ? mobNum.match(/(\d{1,10})/)[0] : mobNum
        if (isOnlyNumber(mobNum) && mobNum.length <= 10) {
            setAddMobileNum((prev) => {
                return prev.map((mobile) => {
                    if (mobile.id === uid) {
                        return {
                            id: uid,
                            mobile: mobNum,
                            error: false,
                            error_message: '',
                        }
                    } else {
                        return mobile
                    }
                })
            })
        }

    }

    function handleAddLandlineNumber(opsType = 'add', id = undefined) {
        if (opsType === 'remove') {
            setAddLandlineNum((previousState) =>
                previousState.filter((inputArray) => inputArray.id !== id)
            )
        } else {
            if (addLandlineNum.length < 3) {
                setAddLandlineNum((previousState) => [
                    ...previousState,
                    {
                        id: uuidv4(),
                        extensionNum: stdcode || "",
                        landline: '',
                        error: false,
                        error_message: 'Please Enter Landline Number',
                    },
                ])
            }
        }
    }

    function handleLandlineInput(uid, num, type) {
        if (isOnlyNumber(num)) {
            setAddLandlineNum((prev) => {
                return prev.map((landline) => {
                    if (landline.id === uid) {
                        return {
                            ...landline, [type]: num, error: false
                        }
                    } else {
                        return landline
                    }
                })
            })
        }
    }

    function checkIsError(fieldName, id) {
        let flag = false;
        switch (fieldName) {
            case 'contact_person_name':
                flag = contactPerson.name_error;
                break;
            case 'phone_number':
                if (addMobileNum?.length) {
                    addMobileNum.map((valObj) => {
                        if (valObj.id == id) {
                            flag = valObj?.error;
                        }
                    })
                }
                break;
            case 'landline_number':
                if (addLandlineNum?.length) {
                    addLandlineNum.map((valObj) => {
                        if (valObj.id == id) {
                            flag = valObj?.error;
                        }
                    })
                }
                break;
        }
        return flag;
    }

    const handleDropdownArrowKey = (dropdownName) => {
        let titleArr = ['Mr', 'Miss', 'Mrs']
        document.onkeydown = function (e) {
            if (dropdownName === 'title') {
                if (e.key === 'ArrowUp' && dropdownActiveIndex > 0) {
                    setDropdownActiveIndex((prev) => prev - 1)
                }
                if (e.key === 'ArrowDown') {
                    if (2 !== dropdownActiveIndex) {
                        setDropdownActiveIndex((prev) => prev + 1)
                    }
                }

                if (e.key === 'Enter') {
                    e.preventDefault()
                    setContactPerson((state) => {
                        return {
                            ...state,
                            title_drop: false,
                            title: titleArr[dropdownActiveIndex],
                            title_error: false,
                        }
                    })
                    inputRef.current.focus()
                }
            }
        }
    }

    const handleReadOnly = () => { }

    function handleFocusTitle() {
        setContactPerson((state) => {
            return { ...state, title_drop: true }
        })
    }

    function handleSelect(selectedTitle) {
        setContactPerson((state) => {
            return { ...state, title_drop: false, title: selectedTitle, title_error: false, }
        })
        inputRef.current.focus()
    }

    async function validateDataOnBlur(fieldName, val, id) {
        let errorMsg = null;
        let blocked = true;
        if (!val?.length) return
        switch (fieldName) {
            case 'contact_person_name':
                let flag = false;
                // let regexname = /^[a-zA-Z0-9\s]+$/;
                let regexname = /^[a-zA-Z\s]+([.'''’’’"'"``]{0,1}[ ]{0,1}[a-zA-Z\s'`]+)*$/
                let regextRepetiveCheck = /(.)\1{4,}/
                if (!regexname.test(val) || regextRepetiveCheck.test(val)) {
                    errorMsg = error_msg.MSG_CONTACTPERSON_REPCHAR;
                    flag = true;
                }
                setContactPerson((prev) => {
                    blurCheckStatus.current.name = false
                    return {
                        ...prev, name_error: flag, err_msg: flag ? errorMsg : ''
                    }
                })
                break;
            case 'phone_number':
                let flagphonenumber = false;
                if (val !== "") {
                    blocked = await checkBlockedNumber(val)
                }
                if (!isValidMobileNumber(val) || !blocked) {
                    flagphonenumber = true
                    errorMsg = error_msg.MSG_MOBILE_MAXLENGTH;
                    errData.current.mobile.push(id);
                } else {
                    if (errData.current.mobile.includes(id)) {
                        let index = errData.current.mobile.indexOf(id)
                        errData.current.mobile.splice(index, 1)
                    }
                }
                let alreadyErrorNumber = {}
                let alreadyErrorRemove = false;
                if (!flagphonenumber) {
                    let flag = false;
                    addMobileNum.map((e) => {
                        if (e.error) {
                            alreadyErrorNumber.id = e.id
                            alreadyErrorNumber.mobile = e.mobile
                        }
                    })
                    addMobileNum.map((e) => {
                        if (alreadyErrorNumber.id !== e.id) {
                            if (e.mobile === alreadyErrorNumber.mobile) {
                                alreadyErrorRemove = true
                            }
                        }
                        if (id !== e.id) {
                            if (e.mobile === val) {
                                flag = true
                            }
                        }
                    })
                    errorMsg = flag ? error_msg.MSG_MOBILE_DUPLICATE : ""
                    flagphonenumber = flag;
                }

                if (!alreadyErrorRemove && Object.entries(alreadyErrorNumber).length !== 0) {
                    setAddMobileNum((prev) => {
                        return prev.map((curr) => {
                            if (!errData.current.mobile.includes(curr.id)) {
                                if (curr.id === alreadyErrorNumber.id) {
                                    return {
                                        id: alreadyErrorNumber.id,
                                        mobile: alreadyErrorNumber.mobile,
                                        error: false,
                                        error_message: '',
                                    }
                                } else {
                                    return curr
                                }
                            } else {
                                return curr
                            }
                        })
                    })
                }

                setAddMobileNum((prev) =>
                    prev.map((curr, i) => {
                        if (i == addMobileNum.length - 1) {
                            blurCheckStatus.current.mobile = false
                        }
                        if (curr.id === id) {
                            return {
                                ...curr,
                                error: flagphonenumber,
                                error_message: flagphonenumber ? errorMsg : "",
                            }
                        }
                        else {
                            return curr
                        }
                    })
                )
                break;
            case 'landline_number':
                let flaglandlinenumber = false;
                let regex = /^\d{6,8}$/;
                if (val !== "") {
                    blocked = await checkBlockedNumber(val)

                }
                if (!regex.test(val) || /^[0189]/.test(val) || !blocked) {
                    errorMsg = error_msg.MSG_TELE_MINLENGTH;
                    flaglandlinenumber = true;
                    errData.current.landline.push(id);
                } else {
                    if (errData.current.landline.includes(id)) {
                        let index = errData.current.landline.indexOf(id)
                        errData.current.landline.splice(index, 1)
                    }
                }
                let alreadyErrorLanNumber = {}
                let alreadyErrorLanRemove = false;
                if (!flaglandlinenumber) {
                    let flag = false;
                    addLandlineNum.map((e) => {
                        if (e.error) {
                            alreadyErrorLanNumber.id = e.id
                            alreadyErrorLanNumber.landline = e.landline
                        }
                    })
                    addLandlineNum.map((e) => {
                        if (alreadyErrorLanNumber.id !== e.id) {
                            if (e.landline === alreadyErrorLanNumber.landline) {
                                alreadyErrorLanRemove = true
                            }
                        }
                        if (e.id !== id) {
                            if (e.landline === val) {
                                flag = true;
                            }
                        }
                    })
                    if (flag) errorMsg = error_msg.MSG_TELE_DUPLICATE;
                    flaglandlinenumber = flag;
                }
                if (!alreadyErrorLanRemove && Object.entries(alreadyErrorLanNumber).length !== 0) {
                    setAddLandlineNum((prev) => {
                        return prev.map((curr) => {
                            if (!errData.current.landline.includes(curr.id)) {
                                if (curr.id === alreadyErrorLanNumber.id) {
                                    return {
                                        id: alreadyErrorLanNumber.id,
                                        landline: alreadyErrorLanNumber.landline,
                                        extensionNum: alreadyErrorLanNumber.extensionNum,
                                        error: false,
                                        error_message: '',
                                    }
                                } else {
                                    return curr
                                }
                            } else {
                                return curr
                            }
                        })
                    })
                }
                setAddLandlineNum((prev) =>
                    prev.map((curr, i) => {
                        if (i == addLandlineNum.length - 1) {
                            blurCheckStatus.current.landline = false
                        }
                        if (curr.id == id) {
                            return {
                                ...curr,
                                error: flaglandlinenumber,
                                error_message: flaglandlinenumber ? errorMsg : "",
                            }
                        } else {
                            return curr
                        }
                    })
                )
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

    const maxLengthCheck = (e) => {
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
    }

    function handleLoopDatafromState(state, keyName) {
        const result = []
        state.map((data) => {
            if (data[keyName]) {
                if (keyName == "landline") {
                    // result.push(`${data.extensionNum}-${data[keyName]}`)
                    result.push(`${data[keyName]}`)
                } else {
                    result.push(`${data[keyName]}`)
                }
            }
        })
        return result
    }

    const isErrorOnSubmit = () => {
        let anyError = false

        if (contactPerson.title === '') {
            setContactPerson((state) => {
                return { ...state, title_error: true }
            })
            anyError = true
        }
        let regexname = /^[a-zA-Z\s]+([.'''’’’"'"``]{0,1}[ ]{0,1}[a-zA-Z\s'`]+)*$/
        let regextRepetiveCheck = /(.)\1{4,}/
        if (
            contactPerson.name === '' ||
            !regexname.test(contactPerson.name) || regextRepetiveCheck.test(contactPerson.name)
            || contactPerson.name_error
        ) {
            setContactPerson((state) => {
                return { ...state, name_error: true }
            })
            anyError = true
        }

        addMobileNum.map((mobileNos) => {
            if (mobileNos.error || mobileNos.mobile.length < 10) {
                setAddMobileNum((prev) => {
                    return prev.map((mobile) => {
                        if (mobile.id === mobileNos.id) {
                            return {
                                ...mobile,
                                error: true,
                                error_message: mobileNos.mobile.length == 0 ? 'Please Enter Mobile Number' : "Please Enter Valid Mobile Number",
                            }
                        } else {
                            return mobile
                        }
                    })
                })
                anyError = true
            }
        })

        addLandlineNum.map((lan) => {
            if (lan.error) {
                anyError = true
            }
        })

        if (contactPerson?.name_error == true) {
            anyError = true;

        }

        return anyError
    }

    const onFormSubmit = async (e) => {
        e.preventDefault()
        let anyError = isErrorOnSubmit()
        if (!anyError) {
            try {
                await logWorker("click")
            } catch (error) {
                console.log(error.message)
            }
            setLoader(true)
            let MobileNos = handleLoopDatafromState(addMobileNum, 'mobile')
            let landlineNos = handleLoopDatafromState(addLandlineNum, 'landline')

            dispatch(updatecontactPerson(contactPerson.name))
            dispatch(updateMobileNumber(MobileNos))
            dispatch(updateLandlineNumber(landlineNos))

            let response = await checkGlobalValidationApi({
                city: city,
                name: contactPerson.name || "",
                mobile_display: MobileNos.toString() || "",
                landline: landlineNos.toString() || ""
            })
            if (!response?.data?.success) {
                setResponceMsg(response?.data?.message || "Something went wrong")
                setLoader(false)
                return;
            }
            let token = null
            if (!getCookie("dcToken")) {
                token = generateDCToken(16)
                set_cookie("dcToken", token)
            } else {
                token = getCookie("dcToken")
            }
            let payload = {
                // token: token || "",
                city: city || "",
                area: area || "",
                pincode: pincode || "",
                business_name: businessName || "",
                dc_mobile_number: loggedInMobile || "",
                vendor_title: contactPerson.title || "",
                vendor_contact_name: contactPerson.name || "",
                vendor_mobile_number: MobileNos.toString() || "",
                vendor_landline: landlineNos.toString() || ""
            }
            dispatch(updateMultipleState({
                "mobile_number": MobileNos,
                "landline_number": landlineNos

            }))
            try {
                await updateDcDetailsApi(payload)
                router.push({
                    pathname: "/dc/linkedbusiness",
                    query: router?.query || {},
                });
            } catch (error) {
                console.log(error.message)
            }
        } else {
            setLoader(false)
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
    return (
        <>
            <div className={`inputwrap__flex mt-20`}>
                <div className={`inputwrap input__small mb-5`}>
                    <input
                        className="input"
                        type="text"
                        value={contactPerson.title}
                        onFocus={handleFocusTitle}
                        onChange={handleReadOnly}
                        autoComplete="off"
                        name="title"
                        inputMode="none"
                        onKeyDown={() =>
                            handleDropdownArrowKey('title')
                        }
                        required
                    />
                    <label className={`input__label`}>Title</label>
                    <span className={`iconwrap selectarrow `} name="title"
                    // onClick={() => handleFocusTitle()}
                    />
                    <ul className={`dropdown color111 ${contactPerson.title_drop ? '' : 'dn'}`}  >
                        <li onClick={() => handleSelect('Mr')} className={dropdownActiveIndex === 0 ? 'active' : ''}  >Mr</li>
                        <li onClick={() => handleSelect('Ms')} className={dropdownActiveIndex === 1 ? 'active' : ''}  >Ms</li>
                        <li onClick={() => handleSelect('Mrs')} className={dropdownActiveIndex === 2 ? 'active' : ''}   >Mrs</li>
                        <li onClick={() => handleSelect('Dr')} className={dropdownActiveIndex === 3 ? 'active' : ''}   >Dr </li>
                    </ul>
                    <div className={`error__message mt-5 ${contactPerson.title_error ? '' : 'dn'}`} >Please Select Title</div>
                </div>

                <div className={`inputwrap input__large mb-5 ${contactPerson.title_error || contactPerson.name_error ? 'inputwrap__error' : ''}`}   >
                    <input
                        className="input"
                        id="contactPerson"
                        type="text"
                        name="contactPerson"
                        value={contactPerson.name}
                        onBlur={() => {
                            blurCheckStatus.current.name = true
                            validateDataOnBlur('contact_person_name', contactPerson.name)
                        }}
                        autoComplete="off"
                        onChange={(e) => {
                            setContactPerson((state) => {
                                return {
                                    ...state,
                                    name: e.target.value,
                                    name_error: false,
                                    err_msg: ''
                                }
                            })
                        }}
                        ref={inputRef}
                        required
                    />
                    <label className="input__label"> Contact Person</label>
                    <div id="contactPerson" className={`error__message mt-5 ${checkIsError('contact_person_name') ? '' : 'dn'}`}  >
                        {`${contactPerson.name === '' ? 'Please Enter Contact Person' : contactPerson.err_msg}`}
                    </div>
                </div>
            </div>
            {addMobileNum.map((data, i) => {
                return (
                    <div className={`inputwrap__flex ${data?.error ? 'inputwrap__error' : ''} mt-20`} key={data.id}>
                        <div className="inputwrap input__small mb-5">
                            <span className={`${styles.countrycode}`}  >
                                <span className={`${styles.countryflag} mr-5`}   >
                                    <img
                                        src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/india_flag.svg"
                                        alt="country flag"
                                    />
                                </span> +91 </span>
                        </div>
                        <div className="inputwrap input__large mb-5">
                            {addMobileNum.length > 1 ? (
                                i !== 0 ? (
                                    <span className={`iconwrap closeicon__grey`} onClick={() => { handleAddMobileNumber('remove', data.id, i) }} />
                                ) : ('')) : ('')}
                            <input
                                className="input"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                onChange={(e) =>
                                    handleMobileInput(e, data.id)
                                }
                                value={data?.mobile}
                                onBlur={(e) => {
                                    blurCheckStatus.current.mobile = true
                                    validateDataOnBlur('phone_number', data.mobile, data.id);
                                    // handleCheckValidPhoneNumber(e.target.value, data.id)
                                }
                                }
                                autoComplete="off"
                                required
                            />
                            <label className="input__label">
                                Mobile Number
                            </label>
                            <div className={`error__message mt-5 ${checkIsError('phone_number', data.id) ? '' : 'dn'}`}   >
                                {data.error_message}
                            </div>
                        </div>
                    </div>
                )
            })}
            {addMobileNum.length < 3 && (
                <button className={`${styles.transparentButton} transparentButton font13`} onClick={(e) => { e.preventDefault(); handleAddMobileNumber() }}   >
                    + Add Another Mobile Number
                </button>
            )}
            {addLandlineNum.map((data, i) => {
                return (
                    <div className={`inputwrap__flex mt-20`} key={data.id}>
                        <div className={`inputwrap input__small mb-5`}>
                            <span className={`${styles.countrycode}`}   >
                                <span className={`${styles.countryflag} mr-5`}   >
                                    <img
                                        src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/india_flag.svg"
                                        alt="country flag"
                                    />
                                </span>
                                +91
                            </span>
                        </div>
                        <div className={`inputwrap input__small mb-5`}>
                            <input
                                className="input"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                // onChange={(e) => { handleLandlineInput(data.id, e.target.value, 'extensionNum') }}
                                // onBlur={(e) => {
                                //     blurCheckStatus.current.landline = true
                                //     validateDataOnBlur('landline_number', data.landline, data.id)
                                // }}
                                value={stdcode}
                                onInput={(e) => maxLengthCheck(e)}
                                autoComplete="off"
                                maxLength={4}
                                required
                            />

                        </div>
                        <div className={`inputwrap input__large ${checkIsError('landline_number', data.id) ? "inputwrap__error" : ""} mb-5`}>

                            {addLandlineNum.length > 1 ? (
                                i !== 0 ? (
                                    <span className={`iconwrap closeicon__grey`} onClick={() => handleAddLandlineNumber('remove', data.id)} />
                                ) : ('')) : ('')}
                            <input
                                className="input"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="off"
                                onChange={(e) => handleLandlineInput(data.id, e.target.value, "landline")}
                                onBlur={(e) => {
                                    blurCheckStatus.current.landline = true
                                    validateDataOnBlur('landline_number', data.landline, data.id)
                                }}
                                maxLength={8}
                                // maxLength={`${StoreCommonInfo.stdcode[0] == 0 ? 11 - (StoreCommonInfo?.stdcode?.length || 0) : 10 - (StoreCommonInfo?.stdcode?.length || 0)}`}
                                value={data.landline}
                                onInput={(e) => maxLengthCheck(e)}
                                required
                            />
                            <label className="input__label">Landline No.</label>
                            <div className={`error__message mt-5 ${checkIsError('landline_number', data.id) ? '' : 'dn'}`} >
                                {data.error_message}
                            </div>
                        </div>
                    </div>
                )
            })}
            <div></div>
            {addLandlineNum.length < 3 && (
                <button className={`${styles.transparentButton} transparentButton font13`} onClick={(e) => { e.preventDefault(); handleAddLandlineNumber() }}    >
                    + Add Landline Number
                </button>
            )}
            {showToast()}
            {!loader ? (
                <button className="primarybutton fw500 ripple mt-10" onClick={onFormSubmit}   >
                    Save and Continue
                </button>
            ) : (
                <button disabled className={`primarybutton mt-10`}>
                    <span className="btn-loader" />
                </button>
            )}


        </>
    )
}

export default ContactDetail
