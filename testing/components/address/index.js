import React, { useState, useEffect, useRef } from 'react'
import styles from './address.module.scss'
import { common } from '../../utils/string'
import { error_msg } from "../../utils/formValidation/ErrorMsg"
import {
    generateHotLead,
    generateSMS,
    generateSessionId,
    isEmptyString, 
    getCookie,
    set_cookie,
    delete_cookie,
    removeRepetitiveQueryParams,
    sanitizeParams,
    IOS_CODE_ARR,
    setCookie,
} from '@/utils/commonFunc'
import clickTracker from '@/utils/clickTracker'
import { useSelector, useDispatch } from 'react-redux'
import { updateMultipleAddressValues } from '@/store/Slices/AddressSlice'
import { updateCommonValues } from '@/store/Slices/commonDataSlice'
import axios from 'axios'
import {
    PostAddressAPI,
    GetPincodeLocationAPI,
    ValidateAddressAPI,
    GenerateParentId,
    GetState,
} from './APICalls'
import { isBadWord, trackingDashboardAPI } from '@/utils/api'
import { useRouter } from 'next/router'
import { isOnlyNumber, isFieldEmpty } from '@/utils/validations'
import { resetAddContact } from '@/store/Slices/AddContactSlice'
import { resetAddPhoto } from '@/store/Slices/AddPhotoSlice'
import { resetAddTiming } from '@/store/Slices/addTiimmingSlice'
import { resetImages } from '@/store/Slices/imageSlice'
import Image from 'next/image'

var CryptoJS = require('crypto-js')
let toggleState = false

export default function Address(props) {
    const router = useRouter()
    const isHasBusiness = props.isHasBusiness
    const city = props.city
    const MobileCookie = props?.userProfile?.mobileNumber
    const IP = props?.userProfile?.IP
    const cityCookie = props?.userProfile?.city
    const AreaArrayRef = useRef([])
    const inputFocusRef = useRef(null)
    const areaFocusRef = useRef(null)
    const StoreCommonValueInfo = useSelector((state) => state.CommonValues)
    const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
    const mobileNumber = useSelector((state) => state.CommonValues?.mobileNumber || '')
    // const sessionID = useSelector((state) => state.CommonValues.sesionId);
    const sendToAdvertisePage = useSelector(
        (state) => state.redirectAdvertise.redirectToAdvertise
    )

    const StoreAdressInfo = useSelector((state) => state.Address)
    const sourceCode = sanitizeParams(router?.query?.source)
    let lat = sanitizeParams(router?.query?.lat) || ""
    let long = sanitizeParams(router?.query?.long) || ""
    let chl = sanitizeParams(router?.query?.chl) || ""
    const cityParams = router?.query?.city
    const jdlite = router?.query?.jdlite
    const getSource = useSelector(
        (state) => state.CommonValues?.getSource || ''
    )
    const dispatch = useDispatch()
    const cityRef = useRef()
    const [loader, setLoader] = useState(false)
    const [location, setLocation] = useState([])
    const [dropdownfocused, setDropdowndocused] = useState({
        area: false,
    })
    const [dropdownActiveIndex, setDropdownActiveIndex] = useState(0)

    const [addressInfo, setAddressInfo] = useState({
        pincode: '',
        block_num: '',
        street: '',
        landmark: '',
        area: '',
        city: '',
        state: '',
        businessName: '',
    })

    const [errorMsg, setErrorMsg] = useState({
        pincode: 'Please Enter a Pincode',
        block_num: 'Please Enter Block Number / Building Name',
        street: 'Please Enter Street / Colony Name',
        landmark: 'Please Enter Landmark',
        area: 'Please Select Area',
        city: 'Please Select City',
        state: 'Please Select State',
        businessName: '',
    })
    const [isError, setIsError] = useState({
        pincode: false,
        block_num: false,
        street: false,
        landmark: false,
        area: false,
        city: false,
        state: false,
        businessName: false,
    })
    const [responceMsg, setResponceMsg] = useState('')
    const [toggleDropDown, setToggleDropDown] = useState(false)

    function maxLengthCheck(e) {
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
    }

    function handleclickoutside(e) {
        if (
            e.target.name !== 'area' &&
            e?.target?.classList[0] !== 'iconwrap'
        ) {
            setToggleDropDown((prev) => {
                toggleState = false
                return false
            })
        }
        if (e?.target?.classList[1] === 'selectarrow' && toggleState) {
            setDropdowndocused((prev) => {
                return { ...prev, area: true }
            })
        } else if (e.target.name !== 'area') {
            setDropdowndocused((prev) => {
                return { ...prev, area: false }
            })
            setAddressInfo((prev) => {
                return {
                    ...prev,
                    area: AreaArrayRef.current.includes(prev.area)
                        ? prev.area
                        : '',
                }
            })
        }
        setLocation(AreaArrayRef.current)
        document.onkeydown = null
        setDropdownActiveIndex(0)
    }

    const updateAddressInfo = (e) => {
        if (e.target.name === 'area') {
            const filteredArea = AreaArrayRef.current.filter((data) =>
                data.toLowerCase().includes(e.target.value.toLowerCase())
            )
            setLocation(filteredArea)
        }

        if (e.target.name !== 'pincode') {
            setAddressInfo((state) => ({
                ...state,
                [e.target.name]: e.target.value,
            }))
        } else {
            if (isOnlyNumber(e.target.value)) {
                setAddressInfo((state) => ({
                    ...state,
                    [e.target.name]: e.target.value,
                }))
            }
        }
        if (e.target.name !== 'pincode') {
            setIsError((prev) => {
                return { ...prev, [e.target.name]: false }
            })
        }
    }

    function scrollToCenter(element) {
        const viewportHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementHeight = element.clientHeight;
        window.scrollTo(0, elementTop - (viewportHeight / 2) + (elementHeight / 2));
      }

    const handleOnFocus = (e, value) => {
        if(value=='area' && (sourceCode?.toString() != '7' && sourceCode?.toString() != '77')){
            let el = document.getElementById('areaDiv')
            if(el){
                // el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
                scrollToCenter(el)
            }
        }
        if (location.length > 0) {
            if (e?.target?.classList[1] === 'selectarrow') {
                if (!toggleDropDown) {
                    areaFocusRef.current.focus()
                }
                setToggleDropDown((prev) => {
                    toggleState = !prev
                    return !prev
                })
            }
        }
        setDropdowndocused((prev) => {
            return { ...prev, [value]: true }
        })
    }

    function getSoruceNamefunction() {
        if (jdlite == 1 && sourceCode == 2) {
            return 'jdlite'
        } else {
            return getSource[sourceCode]
        }
    }

    useEffect(() => {
        let localStorageCity = Array.isArray(
            JSON.parse(window?.localStorage?.getItem('recentLocation'))
        )
            ? JSON.parse(window?.localStorage?.getItem('recentLocation'))[0]
                  ?.city
            : null
        let isSessionIdCalled = false
        
        let trackingDataPayload = {
            source: sourceCode,
            clickType: 'load',
            IP: IP || "",
            trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
            mobile: MobileCookie || "",
            docid: "",
            sessionId: sesionId || "",
            city: city || cityParams || StoreAdressInfo.city || ""
        }
        // if (JSON.parse(getCookie("isThroughLandingPage")) === false) {
        if (!StoreCommonValueInfo.isThroughLandingPage) {
            if (!isHasBusiness && !sesionId) {
                isSessionIdCalled = true
                generateSessionId().then((data) => {
                    dispatch(
                        updateCommonValues({
                            key: 'sesionId',
                            value: data ? data : '',
                        })
                    )
                    trackingDataPayload = {...trackingDataPayload, sessionId : data}
                    trackingDashboardAPI(trackingDataPayload, window.location.href || "");
                    let payload = {
                        number: MobileCookie,
                        g_queue: '0',
                        data_city: cityCookie
                            ? cityCookie
                            : cityParams
                            ? cityParams
                            : localStorageCity
                            ? localStorageCity
                            : '',
                        session: data,
                        platform: getSoruceNamefunction(),
                        campaign_name: chl ==1 ? "campaign_freelisting_warm" :'new_free_listing_warm',
                        link_location: 'new_fl_pageload',
                        message_template: router?.query?.message_template || '',
                        communication_channel:
                            router?.query?.communication_channel || '',
                        customer_segment: router?.query?.customer_segment || '',
                    }
                    generateHotLead(payload,true).then((resp) => {
                        dispatch(
                            updateCommonValues({
                                key: 'isThroughLandingPage',
                                value: true,
                            })
                        )
                        // document.cookie = "isThroughLandingPage=true"
                    })
                })
            }
        }

        if (!sesionId && !isSessionIdCalled) {
            generateSessionId().then((data) => {
                trackingDataPayload = {...trackingDataPayload, sessionId : data}
                trackingDashboardAPI(trackingDataPayload, window.location.href || "");
                dispatch(
                    updateCommonValues({
                        key: 'sesionId',
                        value: data ? data : '',
                    })
                )
            })
        }

        if(sesionId){
            trackingDashboardAPI(trackingDataPayload, window.location.href || "");
        }

        document.cookie = 'isFlow=false'
        dispatch(resetAddContact())
        dispatch(resetAddPhoto())
        dispatch(resetAddTiming())
        dispatch(resetImages())
    }, [])

    const handleSelectedList = (inputName, Listvalue) => {
        setAddressInfo((prev) => ({ ...prev, [inputName]: Listvalue }))
        setDropdowndocused((prev) => ({ ...prev, [inputName]: false }))
        setToggleDropDown((prev) => {
            toggleState = false
            return false
        })
    }

    const handleReadOnly = () => {}

    function getCookie(name) {
        function escape(s) {
            return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1')
        }
        var match = document.cookie.match(
            RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)')
        )
        return match ? match[1] : null
    }

    async function handleSubmit() {
        //click tracker implementaion
        setLoader(true) 
        let sourceCode = sanitizeParams(router?.query?.source)
        if (!sourceCode) {
            let device_userAgent = navigator.userAgent
            if (
                /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                    device_userAgent
                )
            ) {
                sourceCode = '2'
            } else {
                sourceCode = '7'
            }
        }

        clickTracker({
            sourceCode: sourceCode,
            li: 'FL_AddressDetails_Click',
            ll: 'FL_Address',
        })

        let isError = false
        if (isEmptyString(addressInfo.pincode)) {
            setIsError((state) => ({ ...state, pincode: true }))
            isError = true
        }

        // if (isEmptyString(addressInfo.area)) {
        //     setIsError((state) => ({ ...state, area: true }))
        //     isError = true
        // }
        if (isEmptyString(addressInfo.city)) {
            setIsError((state) => ({ ...state, city: true }))
            isError = true
        }
        if (isEmptyString(addressInfo.state)) {
            setIsError((state) => ({ ...state, state: true }))
            isError = true
        }
        if (isEmptyString(addressInfo.businessName)) {
            setIsError((state) => ({ ...state, businessName: true }))
            isError = true
        }
        if(addressInfo.area){
            let isAreaValid = AreaArrayRef.current.filter((data) =>
            data.toLowerCase().includes(addressInfo.area.toLowerCase())
            )
            if (isAreaValid.length == 0) {
                isError = true
            }
        }


        if (
            addressInfo.block_num.length > 0 ||
            addressInfo.street.length > 0 ||
            addressInfo.landmark.length > 0
        ) {
            let ValidateAddressAPIResponse = await ValidateAddressAPI({
                building_name: addressInfo.block_num,
                street: addressInfo.street,
                landmark: addressInfo.landmark,
                data_city: addressInfo.city,
                area : addressInfo.area,
                state : addressInfo.state
            })

            let isAnyValidationError =
                ValidateAddressAPIResponse.data.results?.block?.msg

            if (isAnyValidationError?.building_name !== undefined) {
                setIsError((state) => ({ ...state, block_num: true }))
                setErrorMsg((state) => ({
                    ...state,
                    block_num:
                        'Please Enter Valid Block Number / Building Name',
                }))
                isError = true
            }
            if (isAnyValidationError?.landmark !== undefined) {
                setIsError((state) => ({ ...state, landmark: true }))
                setErrorMsg((state) => ({
                    ...state,
                    landmark: 'Please Valid Enter Landmark',
                }))
                isError = true
            }
            if (isAnyValidationError?.street !== undefined) {
                setIsError((state) => ({ ...state, street: true }))
                setErrorMsg((state) => ({
                    ...state,
                    street: 'Please Enter Valid Street / Colony Name',
                }))
                isError = true
            }
            if (addressInfo.pincode.length !== 6) {
                setIsError((state) => ({ ...state, pincode: true }))
                setErrorMsg((state) => ({
                    ...state,
                    pincode: 'Please Enter Valid Pincode',
                }))
                isError = true
            }
        }
        let isBadWord = await bussinessNameCheck(
            addressInfo.businessName,
            addressInfo.city
        )
        if (isBadWord) {
            isError = true
        }

        if (!isError) {
            dispatch(
                updateMultipleAddressValues({
                    pincode: addressInfo.pincode,
                    block_num: addressInfo.block_num,
                    street: addressInfo.street,
                    area: addressInfo.area,
                    city: addressInfo.city,
                    state: addressInfo.state,
                })
            )
            dispatch(
                updateCommonValues({
                    key: 'compName',
                    value: addressInfo.businessName,
                })
            )
            dispatch(
                updateCommonValues({
                    key: 'companyName',
                    value: addressInfo.businessName,
                })
            )

            let getParentId = await GenerateParentId({
                datacity: addressInfo.city,
                req_data_city: addressInfo.city,
            })
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
            
            try {
                let trackingDataPayload = {
                    source: sourceCode,
                    clickType: 'click',
                    IP: IP || "",
                    trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
                    mobile: MobileCookie || "",
                    docid: parentInfo.docid || '',
                    sessionId: sesionId || "",
                    city: addressInfo.city || city || cityParams || ""
                }
                await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
            } catch (error) {
                console.log(error.message)
            }

            const {
                docid = null,
                parentid = null,
                companyName = null,
                sphinx_id = null,
                source = null,
            } = StoreCommonValueInfo
            const {
                pincode = null,
                block_num = '',
                street = '',
                area = null,
                city = null,
                state = null,
            } = addressInfo
            const tempSourceVal = sanitizeParams(router.query.source) || '77'
            if (
                (!docid || !parentid || !companyName || !sphinx_id,
                !tempSourceVal || !pincode || !city || !state)
            )
                return
            let postAddressObject = {
                docid: parentInfo.docid,
                parentid: parentInfo.parentid,
                pincode: addressInfo.pincode,
                building_name: addressInfo.block_num,
                street: addressInfo.street,
                area: addressInfo.area,
                city: addressInfo.city,
                data_city: addressInfo.city,
                display_city: addressInfo.city,
                state: addressInfo.state,
                companyname: addressInfo.businessName,
                sphinx_id: parentInfo.sphinx_id,
                source: sourceCode,
                mobile_display: MobileCookie || mobileNumber,
                mobile: MobileCookie || mobileNumber,
                mobile_feedback: MobileCookie || mobileNumber,
                IP: IP ? IP : '',
                landmark:addressInfo.landmark,
                page: 'Address',
            }
            PostAddressAPI(postAddressObject).then(async (res) => {
                if (res?.data?.success) {
                    clickTracker({
                        sourceCode: sourceCode,
                        li: 'Buiness_Created_PL',
                        ll: 'NFL_LP',
                    })

                    let hotleadPayload = {
                        number: MobileCookie,
                        g_queue: '1',
                        docid: parentInfo.docid,
                        company_name: addressInfo.businessName,
                        data_city: addressInfo.city,
                        session: sesionId,
                        platform: getSoruceNamefunction(),
                        campaign_name: chl == 1 ? 'campaign_freelisting_hot' : 'new_free_listing_hot',
                        data_source: chl == 1 ? 'campaign_freelisting_hot' : "Joinfree",
                        link_location: 'new_fl_new_business',
                        message_template: router?.query?.message_template || '',
                        communication_channel:
                            router?.query?.communication_channel || '',
                        customer_segment: router?.query?.customer_segment || '',
                    }

                    generateHotLead(hotleadPayload, false);
                    setCookie('isFlow', true);
                    set_cookie("docid",parentInfo.docid);
                    let checkForLegal = getCookie('legalWord') || false;
                    if (checkForLegal == 1) {
                        dispatch(updateCommonValues({ key: 'isCopyright_infringement', value: true }))
                    }
                    router.push({
                        pathname: '/addcontact',
                        query: router?.query || {},
                    })
                } else {
                    console.log(res);
                    setLoader(false)
                    setResponceMsg('Something went wrong')
                }
            })
        } else {
            setLoader(false)
        }
    }

    useEffect(() => {
        if (addressInfo.pincode.length === 6) {
            GetPincodeLocationAPI(addressInfo.pincode).then((res) => {
                if (res.data.results.numRows !== 0) {
                    setAddressInfo((prev) => {
                        return {
                            ...prev,
                            city: res.data.results.result.areaname[0].data_city,
                            state: res.data.results.result.areaname[0].state,
                        }
                    })
                    setIsError((state) => ({ ...state, pincode: false }))
                    setLocation(
                        res.data.results.result.areaname.map(
                            (area) => area.areaname
                        )
                    )
                    dispatch(
                        updateCommonValues({
                            key: 'stdcode',
                            value: res.data.results.result.areaname[0].stdcode,
                        })
                    )
                    AreaArrayRef.current = res.data.results.result.areaname.map(
                        (area) => area.areaname
                    )
                } else {
                    setIsError((state) => ({ ...state, pincode: true }))
                    setErrorMsg((prev) => ({
                        ...prev,
                        pincode: 'Please Enter Valid Pincode',
                    }))
                    setAddressInfo((prev) => ({
                        ...prev,
                        city: '',
                        state: '',
                        area: '',
                    }))
                }
            })
        } else {
            setAddressInfo((prev) => ({
                ...prev,
                state: '',
                city: '',
                area: '',
            }))
            // setLocation("")
            AreaArrayRef.current = []
        }
    }, [addressInfo.pincode])

    // const handlePincode = () => {
    //   if (addressInfo.pincode.length === 6) {
    //     GetPincodeLocationAPI(addressInfo.pincode).then((res) => {
    //       if (res.data.results.numRows !== 0) {
    //         setAddressInfo((prev) => {
    //           return {
    //             ...prev,
    //             city: res.data.results.result.areaname[0].data_city,
    //             state: res.data.results.result.areaname[0].state,
    //             area:
    //               res.data.results.result.areaname.length === 1
    //                 ? res.data.results.result.areaname[0].area
    //                 : "",
    //           };
    //         });
    //         setIsError((state) => ({ ...state, pincode: false }));
    //         setLocation(
    //           res.data.results.result.areaname.map((area) => area.areaname)
    //         );
    //         dispatch(
    //           updateCommonValues({
    //             key: "stdcode",
    //             value: res.data.results.result.areaname[0].stdcode,
    //           })
    //         );
    //         AreaArrayRef.current = res.data.results.result.areaname.map(
    //           (area) => area.areaname
    //         );
    //       } else {
    //         setIsError((state) => ({ ...state, pincode: true }));
    //         setErrorMsg((prev) => ({
    //           ...prev,
    //           pincode: "Please Enter Valid Pincode",
    //         }));
    //         setAddressInfo((prev) => ({
    //           ...prev,
    //           city: "",
    //           state: "",
    //           area: "",
    //         }));
    //       }
    //     });
    //   } else {
    //     setAddressInfo(prev => (
    //       { ...prev, state: "", city: "", area: "" }
    //     ))
    //     // setLocation("");
    //     AreaArrayRef.current = []
    //   }
    // }

    const checkBadWord = async (word, city) => {
        return await isBadWord(word, city)
    }

    const bussinessNameCheck = async (value, city) => {
        let invalid_business_name = 'Please Enter a Valid Business Name'
        let isErr = true

        //empty
        if (isFieldEmpty(value)) {
            setIsError((state) => ({ ...state, businessName: true }))
            setErrorMsg((state) => ({
                ...state,
                businessName: 'Please Enter a Business Name',
            }))
        } else {
            const badWordAPICall = await checkBadWord(value, city)
            if (badWordAPICall?.typeErr == 'legalword') {
                set_cookie("legalWord","1")
            } else {
                set_cookie("legalWord","0")
            }

            const encryptedStr = badWordAPICall?.encryptedCode || ''
            let salt = 'zhsmaj3GKL2CulM0v4KQWgumwVCTKOzy'
            let decrypt_msg = CryptoJS.AES.decrypt(encryptedStr, salt).toString(
                CryptoJS.enc.Utf8
            )

            if (badWordAPICall?.typeErr == 'badword') {
                if (badWordAPICall?.results?.block?.badwordFlag == 1) {
                    setIsError((state) => ({ ...state, businessName: true }))
                    setErrorMsg((state) => ({
                        ...state,
                        businessName:
                            badWordAPICall?.results?.block?.msg[0] ||
                            invalid_business_name,
                    }))
                } else {
                    setIsError((state) => ({ ...state, businessName: true }))
                    setErrorMsg((state) => ({
                        ...state,
                        businessName:
                            badWordAPICall?.results?.block?.msg[0] ||
                            invalid_business_name,
                    }))
                }
            } else {
                if (decrypt_msg !== `${value}${'true'}`) {
                    setIsError((state) => ({ ...state, businessName: true }))
                    setErrorMsg((state) => ({
                        ...state,
                        businessName:
                            badWordAPICall?.results?.block?.msg[0] ||
                            invalid_business_name,
                    }))
                } else {
                    setIsError((state) => ({ ...state, businessName: false }))
                    isErr = false
                }
            }
        }
        return isErr
    }

    useEffect(() => {
        setLoader(false)
        // let localStorageCity = Array.isArray(JSON.parse(window?.localStorage?.getItem("recentLocation"))) ? JSON.parse(window?.localStorage?.getItem("recentLocation"))[0]?.city : null
        document.addEventListener('click', handleclickoutside, false)
        inputFocusRef.current.focus();
        delete_cookie("docid")
        // let filtercity = city ? city : cityParams ? cityParams : localStorageCity ? localStorageCity : "Mumbai"
        // GetState({ city: filtercity }).then(res => {
        //   if (res?.data?.data[0]?.text?.split(',')[1]) {
        //     setAddressInfo({
        //       ...addressInfo,
        //       city: filtercity,
        //       state: res?.data?.data[0]?.text?.split(',')[1]
        //     });
        //   } else {
        //     setAddressInfo({
        //       ...addressInfo,
        //       city: "Mumbai",
        //       state: "Maharashtra"
        //     });
        //   }
        // }).catch(() => {
        //   setAddressInfo({
        //     ...addressInfo,
        //     city: "Mumbai",
        //     state: "Maharashtra"
        //   });
        // })

        return () => {
            document.removeEventListener('click', handleclickoutside, false)
        }
    }, [])

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

    const handleDropdownArrowKey = () => {
        let scrollAmount = 0
        document.onkeydown = function (e) {
            if (e.key === 'ArrowUp' && dropdownActiveIndex > 0) {
                setDropdownActiveIndex((prev) => prev - 1)
                if (dropdownActiveIndex < location.length - 3) {
                    if (document.getElementById('IdAreaDropdown')) {
                        document
                            .getElementById('IdAreaDropdown')
                            .scrollBy({ top: -50 })
                    }
                }
            }
            if (e.key === 'ArrowDown') {
                if (location.length !== dropdownActiveIndex + 1) {
                    setDropdownActiveIndex((prev) => prev + 1)
                }
                if (dropdownActiveIndex >= 3) {
                    if (document.getElementById('IdAreaDropdown')) {
                        document
                            .getElementById('IdAreaDropdown')
                            .scrollBy({ top: 50 })
                    }
                }
            }
            if (e.key === 'Enter') {
                e.preventDefault()
                setToggleDropDown((prev) => {
                    toggleState = false
                    return false
                })
                setAddressInfo((prev) => ({
                    ...prev,
                    area: location[dropdownActiveIndex],
                }))
                setDropdowndocused((prev) => ({ ...prev, area: false }))
                document.getElementsByName('area')[0].blur()
            }
        }
    }

    useEffect(() => {
        if (addressInfo.area?.length >= 1 && location?.length >= 1) {
            setDropdownActiveIndex(0)
            if (document.getElementById('IdAreaDropdown')) {
                document.getElementById('IdAreaDropdown').scrollTo(0, 0)
            }
        }
    }, [addressInfo.area])

    return (
        <>
            <div className={`container__inner ${styles.accountloader}`}>
                <div className={`container__inner__left `}>
                    <div className="left__img">
                        <Image
                            fill
                            src={
                                'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/business_details_2x.png'
                            }
                            alt={'Business Listing Image'}
                            title="Business Listing Image"
                        />
                    </div>
                </div>
                <div className={`container__inner__right`}>
                    <p className={`${styles.title} color111 fw600`}>
                        Enter your business details
                    </p>
                    {/* <p className={`${styles.content} color111`}>Enter the business details that will your customers locate you easily</p> */}
                    <form
                        className={`form input_height`}
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}
                    >
                        <div
                            className={`inputwrap mb-20 ${
                                isError.businessName ? 'inputwrap__error' : null
                            }`}
                        >
                            <input
                                autoComplete="off"
                                // ref={businessNameInputRef}
                                className="input"
                                name="businessName"
                                value={addressInfo.businessName}
                                type="text"
                                onChange={updateAddressInfo}
                                ref={inputFocusRef}
                                required
                                title="businessName"
                            />
                            <label className="input__label">
                                {' '}
                                Business Name{' '}
                            </label>
                            <div
                                className={`error__message mt-5  ${
                                    isError.businessName ? '' : 'dn'
                                } ${styles.captilize}`}
                            >
                                {' '}
                                {errorMsg.businessName}{' '}
                            </div>
                        </div>

                        <div
                            className={`inputwrap mb-20 ${
                                isError.pincode ? 'inputwrap__error' : null
                            }`}
                        >
                            <input
                                className="input"
                                type="text"
                                name="pincode"
                                autoComplete="off"
                                value={addressInfo.pincode}
                                maxLength="6"
                                title="pincode"
                                // onBlur={handlePincode}
                                // onChange={handleReadOnly}
                                
                                inputMode="numeric"
                                pattern="[0-9]*"
                                onChange={updateAddressInfo}
                                required
                            />
                            <label className="input__label">Pincode</label>
                            <div
                                className={`error__message mt-5  ${
                                    isError.pincode ? '' : 'dn'
                                }`}
                            >
                                {' '}
                                {errorMsg.pincode}{' '}
                            </div>
                        </div>
                        <div
                            className={`inputwrap mb-20 ${
                                isError.block_num ? 'inputwrap__error' : ''
                            }`}
                        >
                            <input
                                className="input"
                                type="text"
                                name="block_num"
                                autoComplete="off"
                                value={addressInfo.block_num}
                                onChange={updateAddressInfo}
                                required
                                maxLength="250"
                                title="Block Number"
                                onBlur={()=>{
                                    let regex = /(?:([a-zA-Z])\1{3,}|(\d)\2{5})(?=(?:.*\d){0,6}$)/;
                                    if(addressInfo.block_num?.length){
                                        let flag = regex.test(addressInfo.block_num)
                                        if(flag){
                                            setErrorMsg((prev)=>{
                                                return {
                                                    ...prev,
                                                    block_num:error_msg.MSG_BUILDING_REPCHAR
                                                    
                                                }
                                            })
                                            setIsError((prev)=>{
                                                return {
                                                    ...prev,
                                                    block_num:flag
                                                    
                                                }
                                            })
                                        }
                                    } else {
                                        setErrorMsg((prev)=>{
                                            return {
                                                ...prev,
                                                block_num:''
                                                
                                            }
                                        })
                                        setIsError((prev)=>{
                                            return {
                                                ...prev,
                                                block_num:false
                                                
                                            }
                                        })
                                    }
                                }}
                            />
                            <label className="input__label">
                                {' '}
                                Block Number / Building Name{' '}
                            </label>
                            <div
                                className={`error__message mt-5  ${
                                    isError.block_num ? '' : 'dn'
                                }`}
                            >
                                {' '}
                                {errorMsg.block_num}
                            </div>
                        </div>
                        <div
                            className={`inputwrap mb-20 ${
                                isError.street ? 'inputwrap__error' : ''
                            }`}
                        >
                            <input
                                className="input"
                                type="text"
                                name="street"
                                autoComplete="off"
                                value={addressInfo.street}
                                onChange={updateAddressInfo}
                                required
                                maxLength="250"
                                title="street"
                                onBlur={()=>{
                                    let regex = /(?:([a-zA-Z])\1{3,}|(\d)\2{5})(?=(?:.*\d){0,6}$)/;
                                    if(addressInfo.street?.length){
                                        let flag = regex.test(addressInfo.street)
                                        if(flag){
                                            setErrorMsg((prev)=>{
                                                return {
                                                    ...prev,
                                                    street:error_msg.MSG_STREET_REPNUM
                                                    
                                                }
                                            })
                                            setIsError((prev)=>{
                                                return {
                                                    ...prev,
                                                    street:flag
                                                    
                                                }
                                            })
                                        }
                                    } else {
                                        setErrorMsg((prev)=>{
                                            return {
                                                ...prev,
                                                street:''
                                                
                                            }
                                        })
                                        setIsError((prev)=>{
                                            return {
                                                ...prev,
                                                street:false
                                                
                                            }
                                        })
                                    }
                                }}
                            />
                            <label className="input__label">
                                {' '}
                                Street / Colony Name{' '}
                            </label>
                            <div
                                className={`error__message mt-5  ${
                                    isError.street ? '' : 'dn'
                                }`}
                            >
                                {' '}
                                {errorMsg.street}{' '}
                            </div>
                        </div>
                        <div
                            id='areaDiv'
                            className={`inputwrap mb-20 ${
                                !isError.area || addressInfo.area.length > 1
                                    ? ''
                                    : 'inputwrap__error'
                            }`}
                        >
                            <input
                                className="input"
                                type="text"
                                name="area"
                                onChange={updateAddressInfo}
                                onFocus={(e) => handleOnFocus(e, 'area')}
                                value={addressInfo.area}
                                onKeyDown={(e) => handleDropdownArrowKey()}
                                autoComplete="off"
                                ref={areaFocusRef}
                                required
                                title="area"
                            />
                            <label className="input__label">Area</label>
                            <span
                                className={`iconwrap selectarrow `}
                                onClick={(e) => handleOnFocus(e, 'area')}
                            />
                            {(toggleDropDown ||
                                (dropdownfocused.area &&
                                    location.length > 0)) && (
                                <ul
                                    className={`dropdown color111 customscroll`}
                                    id="IdAreaDropdown"
                                >
                                    {location.map((area, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <li role="button" tabIndex="0" aria-label={area}
                                                    onClick={() =>
                                                        handleSelectedList(
                                                            'area',
                                                            area
                                                        )
                                                    }
                                                    className={
                                                        dropdownActiveIndex == i
                                                            ? 'active'
                                                            : ''
                                                    }
                                                >
                                                    {area}
                                                </li>
                                            </React.Fragment>
                                        )
                                    })}
                                </ul>
                            )}
                            <div
                                className={`error__message mt-5  ${
                                    !isError.area || addressInfo.area.length > 1
                                        ? 'dn'
                                        : ''
                                }`}
                            >
                                {' '}
                                {errorMsg.area}{' '}
                            </div>
                        </div>
                        <div
                            className={`inputwrap mb-20 ${
                                isError.landmark ? 'inputwrap__error' : ''
                            }`}
                        >
                            <input
                                className="input"
                                type="text"
                                onBlur={()=>{
                                    let regex = /(?:([a-zA-Z])\1{3,}|(\d)\2{5})(?=(?:.*\d){0,6}$)/;
                                    if(addressInfo.landmark?.length){
                                        let flag = regex.test(addressInfo.landmark)
                                        if(flag){
                                            setErrorMsg((prev)=>{
                                                return {
                                                    ...prev,
                                                landmark:error_msg.MSG_LANDMARK_REPCHAR
                                                    
                                                }
                                            })
                                            setIsError((prev)=>{
                                                return {
                                                    ...prev,
                                                    landmark:flag
                                                    
                                                }
                                            })
                                        }
                                    } else {
                                        setErrorMsg((prev)=>{
                                            return {
                                                ...prev,
                                                landmark:''
                                                
                                            }
                                        })
                                        setIsError((prev)=>{
                                            return {
                                                ...prev,
                                                landmark:false
                                                
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
                                title="landmark"
                            />
                            <label className="input__label"> Landmark </label>
                            <div
                                className={`error__message mt-5  ${
                                    isError.landmark ? '' : 'dn'
                                }`}
                            >
                                {' '}
                                {errorMsg.landmark}{' '}
                            </div>
                        </div>
                        <div className={`flex`}>
                            <div
                                className={`inputwrap flex__inputwrap mb-20 ${
                                    !isError.city || addressInfo.city.length > 1
                                        ? ''
                                        : 'inputwrap__error'
                                } mr-5`}
                            >
                                <input
                                    className="input"
                                    type="text"
                                    name="city"
                                    value={addressInfo.city}
                                    onChange={handleReadOnly}
                                    ref={cityRef}
                                    autoComplete="off"
                                    required
                                    title="city"
                                />
                                <label className="input__label">City</label>
                                <div
                                    className={`error__message mt-5  ${
                                        !isError.city ||
                                        addressInfo.city.length > 1
                                            ? 'dn'
                                            : ''
                                    }`}
                                >
                                    {errorMsg.city}
                                </div>
                            </div>
                            <div
                                className={`inputwrap flex__inputwrap mb-20 ${
                                    !isError.state ||
                                    addressInfo.state.length > 1
                                        ? ''
                                        : 'inputwrap__error'
                                } ml-5`}
                            >
                                <input
                                    className="input"
                                    type="text"
                                    name="state"
                                    value={addressInfo.state}
                                    onChange={handleReadOnly}
                                    autoComplete="off"
                                    required
                                    title="state"
                                />
                                <label className="input__label">State</label>
                                <div
                                    className={`error__message mt-5  ${
                                        !isError.state ||
                                        addressInfo.state.length > 1
                                            ? 'dn'
                                            : ''
                                    }`}
                                >
                                    {' '}
                                    {errorMsg.state}{' '}
                                </div>
                            </div>
                        </div>
                        {!loader ? (
                            <button aria-label="Save And Continue"
                                className="primarybutton fw500 ripple mt-10"
                                onClick={() => handleSubmit()}
                            >
                                {common.commonterms.save_and_continue}
                            </button>
                        ) : (
                            <button disabled className={`primarybutton mt-10`}>
                                <span className="btn-loader" />
                            </button>
                        )}
                    </form>
                </div>
                {showToast()}
                <div
                    className={`flex flex__col flex__item__center mt-30 pt-30 dn`}
                >
                    <div class={`loader ${styles.spin}`}>
                        <div class={`${styles[`spin__blocker`]}`}></div>
                        <div class={`${styles[`spin__bottom--left`]}`}></div>
                        <div class={`${styles[`spin__bottom--right`]}`}></div>
                        <div class={`${styles[`spin__top--left`]}`}></div>
                    </div>
                    <div className={`color111 font30 fw500 mt-20 mb-15`}>
                        Creating Your Account
                    </div>
                    <div className={`color788`}>
                        This may take a few seconds
                    </div>
                </div>
            </div>
        </>
    )
}
