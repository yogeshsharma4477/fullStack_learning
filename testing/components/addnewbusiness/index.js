import React, { useEffect, useRef, useState } from 'react'
import styles from './addnewbusiness.module.scss'
import { addNewBusiness, common } from '../../utils/string'
import clickTracker from '@/utils/clickTracker'
import { isEmptyString, sanitizeParams } from '@/utils/commonFunc'
import { isFieldEmpty } from '../../utils/validations'
import {
    isLegalBusinessName,
    isBadWord,
    isValidPincode,
    hotleadApiCall,
} from '@/utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { updateMultipleCommonValues } from '../../store/Slices/commonDataSlice'
import axios from 'axios'
import Image from 'next/image'
import { GenerateParentId, PostAddressAPI } from '../address/APICalls'
import { updateMultipleAddressValues } from '@/store/Slices/AddressSlice'
var CryptoJS = require('crypto-js')

const getDisplayLabels = () => {
    const title =
        addNewBusiness?.title ||
        'You are few steps away to avail free business listing at Justdial'
    const bussiness_name_label =
        addNewBusiness?.business_placeholder || 'Business Name'
    const legal_business_label =
        addNewBusiness?.legal_business_name_placeholder ||
        'Legal Business Name (As Per Official Records)'
    const info =
        addNewBusiness?.content ||
        'Your business listing will help you get discovered by customers on Justdial'
    const save_and_continue =
        common?.commonterms?.save_and_continue || 'Save and Continue'
    const empty_business_name =
        common?.errMsg?.emptyBusinessName || 'Please Enter a Business Name'
    const empty_business_legal_name =
        common?.errMsg?.emptyLegalBusinessName ||
        'Please Enter a Legal Business Name'
    const invalid_business_name =
        common?.errMsg?.invalidBusinessName ||
        'Please Enter valid a Business Name'
    const invalid_business_legal_name =
        common?.errMsg?.invalidLegalBusinessName ||
        'Please Enter valid a Legal Business Name'
    const invalid_pincode = 'Please Enter Valid Pincode'
    const empty_pincode = 'Please Enter a Pincode'

    return {
        title,
        info,
        bussiness_name_label,
        legal_business_label,
        empty_business_name,
        empty_business_legal_name,
        invalid_business_name,
        invalid_business_legal_name,
        save_and_continue,
        invalid_pincode,
        empty_pincode,
    }
}

export default function Addnewbusiness(props) {
    const businessNameInputRef = useRef(null)
    const pincodeInputRef = useRef(null)
    const saveAndContinueButtonRef = useRef(null)
    const [errMsgBusinessName, setErrMsgBusinessName] = useState('')
    const [errMsgPincode, setErrMsgPincode] = useState('')
    const [loader, setLoader] = useState(false)
    const dispatch = useDispatch()
    const mobileNumber = useSelector(
        (state) => state.CommonValues?.mobileNumber || ''
    )
    const sessionID = useSelector((state) => state.CommonValues?.sesionId || '')
    const router = useRouter()

    const compData = useSelector((state) => {
        let obj = {
            name: state.CommonValues?.companyName || '',
            pincode: state.Address?.pincode || '',
        }
        return obj
    })

    useEffect(() => {
        setTimeout(() => {
            let sessionIDval = ''
            const { long = null, lat = null } = router.query
            let payload = {
                link_location: 'FL_PageLoad',
                mobile1: mobileNumber,
            }
            let cookies = document.cookie || null
            if (cookies) cookies = cookies.split(';')
            if (cookies?.length) {
                cookies.map((e) => {
                    let valPair = e.split('=')
                    if (valPair[0].trim() == 'sessionId') {
                        sessionIDval = valPair[1].trim()
                    }
                })
            }
            if (sessionIDval) {
                hotleadApiCall(payload, sessionIDval, long, lat)
            }
        }, 1000)
    }, [])

    useEffect(() => {
        if (businessNameInputRef) {
            businessNameInputRef.current.value = compData.name
        }
        if (pincodeInputRef) {
            pincodeInputRef.current.value = compData.pincode
        }
    }, [])
    const [errMsgBusinessLegalName, setErrMsgBusinessLegalName] = useState('')
    const {
        title,
        info,
        bussiness_name_label,
        legal_business_label,
        empty_business_name,
        empty_business_legal_name,
        invalid_business_name,
        invalid_business_legal_name,
        save_and_continue,
        invalid_pincode,
        empty_pincode,
    } = getDisplayLabels()

    const sourceCode = sanitizeParams(router?.query?.source)

    const checkViaAPICall = async (name) => {
        return await isLegalBusinessName(name)
    }
    const checkBadWord = async (word, city) => {
        return await isBadWord(word, city)
    }
    const checkPincode = async (pincode) => {
        return await isValidPincode(pincode)
    }

    /**
     * The above code defines two asynchronous functions that check if a given name is a legal business
     * name and if a given word is a bad word.
     * @param name - The name parameter is a string representing a business name that needs to be checked
     * for legality.
     * @returns The functions `checkViaAPICall` and `checkBadWord` are returning the result of the
     * `isLegalBusinessName` and `isBadWord` functions respectively, after awaiting their asynchronous
     * execution.
     */

    /**
     * This is an asynchronous function that checks if a given business name is empty, contains bad
     * words, or is legal via an API call.
     * @param value - The value to be checked for a valid business name.
     * @returns a boolean value, either true or false, depending on whether there is an error or not.
     */
    const bussinessNameCheck = async (value, city) => {
        let isErr = true
        if (isFieldEmpty(value)) {
            setErrMsgBusinessName(empty_business_name)
            setLoader(false)
        } else {
            const badWordAPICall = await checkBadWord(value, city)

            if (badWordAPICall?.typeErr == 'legalword') {
                document.cookie = 'legalWord=1'
            } else {
                document.cookie = 'legalWord=0'
            }
            const encryptedStr = badWordAPICall?.encryptedCode || ''
            let salt = 'zhsmaj3GKL2CulM0v4KQWgumwVCTKOzy'
            let decrypt_msg = CryptoJS.AES.decrypt(encryptedStr, salt).toString(
                CryptoJS.enc.Utf8
            )

            if (badWordAPICall?.typeErr == 'badword') {
                if (badWordAPICall?.results?.block?.badwordFlag == 1) {
                    setErrMsgBusinessName(invalid_business_name)
                } else {
                    setErrMsgBusinessName(
                        badWordAPICall?.results?.block?.msg[0] ||
                            invalid_business_name
                    )
                }
                setLoader(false)
            } else {
                if (decrypt_msg !== `${value}${'true'}`) {
                    setErrMsgBusinessName(invalid_business_name)
                    setLoader(false)
                } else {
                    isErr = false
                }
            }
        }
        return isErr
    }

    const MobileCookie = props?.userProfile?.mobileNumber
    const StoreCommonValueInfo = useSelector((state) => state.CommonValues)
    const IP = props?.userProfile?.IP

    function insertApiCall(
        {
            docid = '',
            parentid = '',
            shorturl = '',
            sphinx_id = '',
            url_cityid = '',
        },
        city,
        state
    ) {
        let bussinessName = businessNameInputRef?.current?.value || ''
        let pincode = pincodeInputRef?.current?.value || ''

        let payload = {
            docid: docid,
            parentid: parentid,
            pincode: pincode,
            city: city,
            data_city: city,
            display_city: city,
            companyname: bussinessName,
            sphinx_id: sphinx_id,
            source: sourceCode,
            mobile_display: StoreCommonValueInfo.mobileNumber,
            mobile: StoreCommonValueInfo.mobileNumber,
            mobile_feedback: StoreCommonValueInfo.mobileNumber,
            IP: IP,
            page: 'Address',
        }

        dispatch(
            updateMultipleCommonValues({
                parentid: parentid,
                docid: docid,
                sphinx_id: sphinx_id,
                shorturl: shorturl,
                companyName: bussinessName,
            })
        )
        dispatch(
            updateMultipleAddressValues({
                pincode: pincode,
                city: city,
                state: state,
            })
        )
        PostAddressAPI(payload)
        let query = router?.asPath || ''
        query = query.split('?')
        if (query.length) query = '?' + query[1]
        document.cookie = 'isFlow=true'
        router.push({
            pathname: '/Address',
            query: router.query || {}
        })
    }

    const genrateDocID = async (city, state) => {
        let getParentId = await GenerateParentId({
            datacity: city,
            req_data_city: city,
        })

        //------------------------------------------------------
        let sessionIDval = ''
        const { long = null, lat = null } = router.query
        let payload = {
            link_location: 'FL_EBL',
            mobile1: mobileNumber,
            data_city: city,
            docid: getParentId?.data?.results?.docid || '',
            parentid: getParentId?.data?.results?.parentid || '',
        }
        let cookies = document.cookie || null
        if (cookies) cookies = cookies.split(';')
        if (cookies?.length) {
            cookies.map((e) => {
                let valPair = e.split('=')
                if (valPair[0].trim() == 'sessionId') {
                    sessionIDval = valPair[1].trim()
                }
            })
        }
        if (sessionIDval) {
            hotleadApiCall(payload, sessionIDval, long, lat)
        }
        //------------------------------------------------------

        insertApiCall(getParentId?.data?.results || {}, city, state)
        return getParentId?.data?.results
    }

    /**
     * The function checks if a given business legal name is valid and not containing any bad words.
     * @param value - The value being checked for business legal name validity.
     * @returns a boolean value indicating whether there is an error or not.
     */
    const bussinessLegalNameCheck = async (value) => {
        let isErr = true
        if (isFieldEmpty(value))
            setErrMsgBusinessLegalName(empty_business_legal_name)
        else {
            const badWordAPICall = await checkBadWord(value)
            const checkIsBusinessLegalNameLegal = await checkViaAPICall(value)
            await Promise.all([badWordAPICall]).then(function (values) {
                if (values.includes(false))
                    setErrMsgBusinessLegalName(invalid_business_legal_name)
                else {
                    setErrMsgBusinessLegalName('')
                    isErr = false
                }
            })
        }
        return isErr
    }

    async function fetchDataFromPincode() {
        let pincodeData = {
            areaArr: [],
            city: '',
            state: '',
            goFurther: false,
        }

        let pincodeVal = pincodeInputRef?.current?.value || null

        if (pincodeVal !== null) {
            if (pincodeVal?.length !== 6) setErrMsgPincode(invalid_pincode)
            await checkPincode(pincodeVal)
                .then((res) => {
                    const areaArray =
                        res?.data?.results?.result?.areaname || null
                    if (areaArray == null) {
                        setErrMsgPincode(invalid_pincode)
                        return
                    }
                    pincodeData = areaArray
                    if (Array.isArray(pincodeData) && pincodeData.length) {
                        pincodeData.city = areaArray[0].city
                        pincodeData.state = areaArray[0].state
                        pincodeData.goFurther = true
                    } else {
                        setErrMsgPincode(invalid_pincode)
                    }
                    return
                })
                .catch((error) => {
                    setErrMsgPincode(invalid_pincode)
                    console.error('error: ', error)
                })
        } else {
            setErrMsgPincode(empty_pincode)
        }

        return pincodeData
    }

    useEffect(() => {
        businessNameInputRef.current.focus()
    }, [])

    /**
     * The handleClick function handles a form submission by checking for errors in input fields and
     * dispatching an action to update values in a Redux store before redirecting to a new page.
     * @param e - The `e` parameter is an event object that is passed to the `handleClick` function when
     * it is called. It is used to prevent the default behavior of a form submission when a button is
     * clicked.
     */
    const handleClick = async (e) => {
        e.preventDefault()
        setLoader(true)

        /* `clickTracker` is a function that is being called with an object as its parameter. The object has
    three properties: `sourceCode`, `li`, and `ll`. These properties are used to track user clicks on
    certain elements on the page. The `sourceCode` property is used to identify the source of the click
    (e.g. the page the user was on when they clicked the element), while `li` and `ll` are used to
    identify the specific element that was clicked. In this case, `li` is set to "FL_BusinessNameClick"
    and `ll` is set to "FL_addnewbusiness", which likely correspond to specific elements on the page
    that are being tracked. */
        clickTracker({
            sourceCode: sourceCode,
            li: 'FL_addnewbusiness_continue',
            ll: 'FL_addnewbusiness',
        })

        /* These lines of code are calling two asynchronous functions `bussinessNameCheck` and
    `bussinessLegalNameCheck` with the values of `businessNameInputRef.current.value` and
    `businessLegalNameInputRef.current.value` respectively. The `await` keyword is used to wait for the
    functions to complete and return their results before assigning them to the variables `isErr1` and
    `isErr2`. These variables are then used to check if there are any errors in the input fields before
    proceeding with the form submission. */

        let bussinessName = businessNameInputRef?.current?.value || ''
        let pincode = pincodeInputRef?.current?.value || ''
        if (!bussinessName.length || !pincode.length) {
            if (!pincode.length) setErrMsgPincode(empty_pincode)
            if (!bussinessName.length)
                setErrMsgBusinessName(empty_business_name)
        } else {
            let pincodeDataObj = await fetchDataFromPincode()
            if (pincodeDataObj.goFurther) {
                let bussinessName = businessNameInputRef.current.value
                let isError = await bussinessNameCheck(
                    bussinessName,
                    pincodeDataObj.city
                )
                if (isError) return
                await genrateDocID(pincodeDataObj.city, pincodeDataObj.state)
            }
        }
        setLoader(false)

        // let isErr1 = await bussinessNameCheck(businessNameInputRef.current.value);
        // // let isErr2 = await bussinessLegalNameCheck(businessLegalNameInputRef.current.value);
        // let pincodeValue = pincodeInputRef.current?.value || '';
        // let pincodeDataRes = []
        // let isErr2 = pincodeValue?.length !== 6;
        // if(!isErr2) {
        //   pincodeDataRes = await pincodeCheck(pincodeInputRef.current.value)
        //                       .then((res)=>{
        //                         console.log("I am here", res)
        //                         return res
        //                       })
        //                       .catch((err)=>{
        //                         return [null, true, null]
        //                       })
        // }
        // else{
        //   if(pincodeValue.length==0){
        //     setErrMsgPincode(empty_pincode)
        //   } else{
        //     setErrMsgPincode(invalid_pincode)
        //   }
        //   isErr2 = true;
        // }
        // isErr2 = pincodeDataRes[1];
        // console.log(pincodeDataRes)

        // if (isErr1 == false && isErr2 == false) {

        //   const { docid='', parentid='', shorturl='', sphinx_id='', url_cityid='' } = pincodeDataRes[0]?.results || {}
        //   // let postAddNewBussinesObject = {
        //   //   docid: docid,
        //   //   parentid: parentid,
        //   //   pincode: pincodeValue,
        //   //   city: addressInfo.city,
        //   //   data_city: addressInfo.city,
        //   //   display_city: addressInfo.city,
        //   //   companyname: StoreCommonValueInfo.compName,
        //   //   sphinx_id: parentInfo.sphinx_id,
        //   //   source: StoreCommonValueInfo.source,
        //   //   mobile_display: MobileCookie,
        //   //   mobile: MobileCookie,
        //   //   mobile_feedback: MobileCookie,
        //   //   IP: IP,
        //   //   page: "AddNewBusiness",
        //   // };
        //   // PostAddBussinessAPI(postAddNewBussinesObject).then((res) => {
        //   //   if (res.data.success) {
        //   //     document.cookie = "isFlow = true";

        //   //     let query = router?.asPath || ''
        //   //     query = query.split('?')
        //   //     if (query.length) query = '?' + query[1]
        //   //     // router.push("/congratulation" + query);
        //   //   } else {
        //   //     // router.push('/Congratulation', '/congratulation')
        //   //     setLoader(false);
        //   //     setResponceMsg("Something went wrong");
        //   //   }
        //   // });
        //   // handleHotLeadApiCall()

        //   /* The above code is dispatching an action to update multiple common values in a Redux store. The
        //   action includes two properties: compName and compLegalName, which are being set to the values
        //   of two input fields (businessNameInputRef and businessLegalNameInputRef) respectively. If the
        //   input fields are empty, the properties will be set to an empty string. */
        //   dispatch(
        //     updateMultipleCommonValues({
        //       compName: businessNameInputRef?.current?.value || "",
        //       // compLegalName: businessLegalNameInputRef?.current?.value || "",
        //       //SABNCheckbox: document.getElementById('sameAsbussinessName')?.checked || false,
        //     })
        //   );

        //   document.cookie = "isFlow = true";

        //   let query = router?.asPath || ''
        //   query = query.split('?')
        //   if(query.length) query = '?'+ query[1]
        StoreAdressInfo.city
        //   // router.push("/Address"+query);
        // } else {
        //   // setLoader(false);
        // }
    }

    /**
     * The function handles an API call to a hot lead service with provided mobile number, company name,
     * and legal name.
     * @returns If the `mobileNumber` is not defined, the function will return nothing (`undefined`). If
     * there is an error during the execution of the function, it will also return nothing (`undefined`).
     */
    const handleHotLeadApiCall = () => {
        try {
            if (!mobileNumber) return

            let compName = businessNameInputRef.current?.value || ''
            let pincode = pincodeInputRef.current?.value || ''
            // let compLegalName = businessLegalNameInputRef.current?.value || ''

            // if(compName.length + compLegalName == 0) return; //avoid hotlead call if no data

            hotleadApiCall(
                {
                    mobile1: mobileNumber,
                    company_name: compName,
                    pincode: pincode,
                    li: 'FL_BusinessNameClick',
                    ll: 'FL_addnewbusiness',
                },
                sessionID
            )
        } catch (error) {
            console.error('error=> ', error)
            return
        }
    }

    const handlePincodeInput = (e) => {
        if (e.key == 'Backspace') return
        if (e.key == 'ArrowRight') return
        if (e.key == 'ArrowLeft') return
        if (e.ctrlKey || e.metaKey) return
        if (e.key == 'Enter') handleClick(e)
        if (pincodeInputRef.current.value.length == 6) {
            e.preventDefault()
            return
        }
        let regex = new RegExp('[^0-9]')
        if (regex.test(e.key)) {
            e.preventDefault()
            return
        }
    }

    const handleNameEmptyError = () => {
        if (errMsgBusinessName && businessNameInputRef.current?.value) {
            setErrMsgBusinessName('')
        }
        // resetSBNCheck()
    }

    const handlePincodeEmptyError = () => {
        if (errMsgPincode && pincodeInputRef.current?.value) {
            setErrMsgPincode('')
        }
    }

    const handleLegalNameEmptyError = () => {
        if (errMsgBusinessLegalName) {
            // && businessLegalNameInputRef.current?.value){
            setErrMsgBusinessLegalName('')
        }
        resetSBNCheck()
    }

    /**
     * The function subscribes event listeners to certain elements.
     */
    const subscribe = () => {
        if (saveAndContinueButtonRef)
            saveAndContinueButtonRef.current.addEventListener(
                'click',
                handleClick
            )
        // if(businessNameInputRef) businessNameInputRef.current.addEventListener("blur", handleHotLeadApiCall);
        // if(businessLegalNameInputRef) businessLegalNameInputRef.current.addEventListener("blur", handleHotLeadApiCall);
        if (pincodeInputRef)
            pincodeInputRef.current.addEventListener(
                'keydown',
                handlePincodeInput
            )
    }

    /**
     * The function "unsubscribe" removes event listeners from certain elements.
     */
    const unsubscribe = () => {
        if (saveAndContinueButtonRef.current)
            saveAndContinueButtonRef.current.removeEventListener(
                'click',
                handleClick
            )
    }

    /* This code block is using the `useEffect` hook to subscribe and unsubscribe event listeners. */
    useEffect(() => {
        subscribe()
        return unsubscribe
    }, [])

    /**
     * The function handles the checkbox for a business legal name input field and sets its value based
     * on the value of a related business name input field.
     * @param e - The event object that is triggered when the SABN checkbox is clicked.
     */
    const handleSABNCheckbox = (e) => {
        let value = ''
        let isChecked = e.target.checked
        if (isChecked) {
            value = businessNameInputRef.current.value
        }
        // businessLegalNameInputRef.current.value = value;
        setSABNCheckboxVal(isChecked)
    }

    /**
     * The function resets the value of a checkbox to false.
     * @param e - The parameter "e" is likely an event object that is passed as an argument to the
     * function. It could be used to access information about the event that triggered the function, such
     * as the target element or the type of event. However, in this particular function, it is not being
     * used.
     */
    const resetSBNCheck = (e) => {
        if (!SABNCheckboxVal) return
        setSABNCheckboxVal(false)
    }

    /**
     * The function returns an error message based on the input field name.
     * @param fieldName - fieldName is a string parameter that represents the name of a field in a form.
     * The function uses this parameter to determine which error message to display for that field.
     * @returns A function that takes a parameter `fieldName` and returns a JSX element containing an error
     * message string based on the value of `fieldName`. If `tempErrString` is an empty string, the
     * function returns `null`.
     */
    const errorMsgPopup = (fieldName) => {
        let tempErrString = ''
        switch (fieldName) {
            case 'bussinessName':
                tempErrString = errMsgBusinessName
                break
            case 'bussinessLegalName':
                tempErrString = errMsgBusinessLegalName
                break
            case 'pincode':
                tempErrString = errMsgPincode
                break
        }
        if (isEmptyString(tempErrString)) return null
        return <div className="error__message mt-5">{tempErrString}</div>
    }

    let businessNameWrapperErrClassName = isEmptyString(errMsgBusinessName)
        ? ''
        : 'inputwrap__error'
    let pincodeWrapperErrClassName = isEmptyString(errMsgPincode)
        ? ''
        : 'inputwrap__error'
    let businessLegalNameWrapperErrClassName = isEmptyString(
        errMsgBusinessLegalName
    )
        ? ''
        : 'inputwrap__error'

    return (
        <>
            <div className="container__inner">
                <div className={`container__inner__left`}>
                    <div className={`left__img`}>
                        <Image
                            fill
                            priority={true}
                            src={
                                'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/mobile_left@2x.png'
                            }
                            alt={'left image.'}
                        />
                    </div>
                </div>
                <div
                    className={`container__inner__right  ${styles.addnewbusiness}`}
                >
                    <p className={`${styles.title} color111 fw600`}>{title}</p>
                    <p className={`${styles.content} color111`}>{info}</p>
                    <form className={`form`}>
                        <div
                            className={`inputwrap ${businessNameWrapperErrClassName} mb-20`}
                        >
                            <input
                                autoComplete="off"
                                ref={businessNameInputRef}
                                className="input"
                                type="text"
                                required
                                onChange={handleNameEmptyError}
                            />
                            <label className="input__label">
                                {bussiness_name_label}
                            </label>
                            {errorMsgPopup('bussinessName')}
                        </div>
                        <div
                            className={`inputwrap ${pincodeWrapperErrClassName} mb-20`}
                        >
                            <input
                                autoComplete="off"
                                ref={pincodeInputRef}
                                className="input"
                                type="tel"
                                required
                                pattern="[0-9]+"
                                name="pincode"
                                maxLength="6"
                                onChange={handlePincodeEmptyError}
                                onPaste={(e) => {
                                    let val = e.target?.value || ''
                                    val += e.clipboardData.getData('text')
                                    if (val.length > 6) {
                                        e.preventDefault()
                                        return
                                    }
                                }}
                            />
                            <label className="input__label">Pincode</label>
                            {errorMsgPopup('pincode')}
                        </div>
                        {/* <div
              className={`inputwrap ${businessLegalNameWrapperErrClassName} mb-20`}
            >
              <input
                autoComplete="off"
                ref={businessLegalNameInputRef}
                className="input"
                type="text"
                required
                onChange={handleLegalNameEmptyError}
              />
              <label className="input__label">{legal_business_label}</label>
              {errorMsgPopup("bussinessLegalName")}
            </div>
            <label className="radio radio--bordernone">
              <input type="checkbox" id="sameAsbussinessName" name="sameAsbussinessName" 
                value={SABNCheckboxVal} checked={SABNCheckboxVal} onClick={handleSABNCheckbox}/>
              <span className={`iconwrap uncheck mr-14`} />
              <span className={`color414 font14`}>Same as Bussiness Name</span>
            </label> */}
                        <button
                            ref={saveAndContinueButtonRef}
                            className={`${styles.buttontopspace} primarybutton`}
                            disabled={loader}
                        >
                            {!loader ? (
                                <>{save_and_continue}</>
                            ) : (
                                <span className="primarybutton--loader" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
