import React, { useState, useEffect, useRef } from 'react'
import styles from './addcontact.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import {
    updatecontactPerson,
    updateDesignation,
    updateMobileNumber,
    updateLandlineNumber,
    updateEmailId,
    updateWhatsAppNumber,
} from '@/store/Slices/AddContactSlice'
import { error_msg } from "../../utils/formValidation/ErrorMsg"
// import InputType from './InputType'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import {
    isValidMobileNumber,
    isValidEmailId,
    isOnlyNumber,
} from '@/utils/validations'
import { DesignationList } from './DesignationList'
import axios from 'axios'
var CryptoJS = require('crypto-js')
import Image from 'next/image'
import { IOS_CODE_ARR, clickTracker, sanitizeParams } from '@/utils/commonFunc'
import { trackingDashboardAPI } from '@/utils/api'

async function PostAddContactAPI(AddContactFormData) {
    const response = await axios({
        method: 'post',
        url: '/api/v1/InsertAPI',
        data: AddContactFormData,
    })
    return response
}

export default function Addcontact(props) {
    const MobileCookie = props?.userProfile?.mobileNumber
    const IP_Prop = props?.userProfile?.IP
    let IP = useSelector((state) => state.CommonValues?.ip || "");
    const router = useRouter()
    const reduxMobile = useSelector((state) => state.CommonValues.isVerified)
    const mobileNumber = useSelector((state) => state.CommonValues.mobileNumber)
    const StorecontactInfo = useSelector((state) => state.AddContact)
    const StoreCommonInfo = useSelector((state) => state.CommonValues)
    const StoreAddressInfo = useSelector((state) => state.Address)
    const dispatch = useDispatch()
    const sourceCodeNew = sanitizeParams(router?.query?.source)
    const sendToAdvertisePage = useSelector(
        (state) => state.redirectAdvertise.redirectToAdvertise
    )
    const sourceCode = sanitizeParams(router?.query?.source)
    const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
    const [dropdownActiveIndex, setDropdownActiveIndex] = useState(0)
    const inputRef = useRef(null)
    let lat = sanitizeParams(router?.query?.lat) || ""
    let long = sanitizeParams(router?.query?.long) || ""
    const [loader, setLoader] = useState(false)
    const [responceMsg, setResponceMsg] = useState('')
    const [contactPerson, setContactPerson] = useState({
        title: 'Mr',
        name: StorecontactInfo.contactPerson,
        title_error: false,
        name_error: false,
        title_drop: false,
        err_msg: ""
    })
    const [addDesignation, setAddDesignation] = useState({
        designation: contactPerson.designation ? contactPerson.designation : '',
        isDesignationAdd: false,
        error: false,
        error_message: 'Please Enter Valid Designation',
        lists: [],
        isDesignationSelected: false,
    })
    const [addMobileNum, setAddMobileNum] = useState([
        {
            id: uuidv4(),
            mobile: MobileCookie || mobileNumber || reduxMobile,
            error: false,
            error_message: 'Please Enter Mobile Number',
        },
    ])
    const [addWhatsAppNum, setAddWhatsAppNum] = useState([
        {
            id: uuidv4(),
            mobile: '',
            error: false,
            error_message: 'Please Enter Whatsapp Number',
        },
    ])
    let [addLandlineNum, setAddLandlineNum] = useState([
        // {
        //   id: uuidv4(),
        //   extensionNum: StoreCommonInfo.stdcode,
        //   landline: "",
        //   error: false,
        //   error_message: "Please Enter Landline Number",
        // },
    ])
    const [addEmail, setAddEmail] = useState([
        {
            id: uuidv4(),
            email: '',
            error: false,
            error_message: 'Please Enter a Email',
        },
    ])

    const errData = useRef({
        mobile: [],
        whatsapp: [],
        landline: [],
        email: []
    })

    function handleclickoutside(e) {
        if (e.target.name !== 'designation') {
            setAddDesignation((prev) => {
                return {
                    ...prev,
                    isDesignationSelected: true,
                    designation: prev.lists.includes(prev.designation)
                        ? prev.designation
                        : '',
                }
            })
        }
        if (e.target.name !== 'title') {
            setContactPerson((state) => {
                return { ...state, title_drop: false }
            })
        }
        document.onkeydown = null
        setDropdownActiveIndex(0)
    }

    function handleAddWhatsappNumber(opsType = 'add', id = undefined, index) {
        if (opsType === 'remove' && index !== 0) {
            setAddWhatsAppNum((previousState) =>
                previousState.filter((inputArray) => inputArray.id !== id)
            )
        }
        if (addWhatsAppNum.length < 3 && opsType !== 'remove') {
            setAddWhatsAppNum((previousState) => [
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

    function handleWhatsappInput(e, uid) {
        let mobNum = e.target.value
        if (mobNum) mobNum = mobNum.replace(/\+91/, '').replace(/[^\d]/g, '')
        mobNum = mobNum ? mobNum.match(/(\d{1,10})/)[0] : mobNum
        if (isOnlyNumber(mobNum) && mobNum.length <= 10) {
            setAddWhatsAppNum((prev) => {
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

    function handleSameAsMobileNumber() {
        if (document.getElementById('wupCheckbox').checked) {
            const existingData = addWhatsAppNum
            existingData[0].mobile = addMobileNum[0].mobile
            existingData[0].error = false
            setAddWhatsAppNum([...existingData])
        } else {
            const existingDataWhatsApp = [...addWhatsAppNum]
            existingDataWhatsApp[0].mobile = ''
            existingDataWhatsApp[0].error = false
            setAddWhatsAppNum([...existingDataWhatsApp])
        }
    }


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
                        extensionNum: StoreCommonInfo.stdcode,
                        landline: '',
                        error: false,
                        error_message: 'Please Enter Landline Number',
                    },
                ])
            }
        }
    }

    function handleLandlineInput(uid, extNum, mobNum) {
        // if (mobNum) mobNum = mobNum.replace(/\+91/, '').replace(/[^\d]/g, '')
        // mobNum = mobNum ? mobNum.match(/(\d{1,10})/)[0] : mobNum;
        // StoreCommonInfo.stdcode
        // let validLenCheck = StoreCommonInfo.stdcode
        if (isOnlyNumber(mobNum)) {
            setAddLandlineNum((prev) => {
                return prev.map((landline) => {
                    if (landline.id === uid) {
                        return {
                            id: uid,
                            extensionNum: extNum
                                ? extNum
                                : landline.extensionNum,
                            landline: mobNum,
                            error_message: '',
                        }
                    } else {
                        return landline
                    }
                })
            })
        }
    }

    function handleAddEmail(opsType = 'add', id) {
        if (opsType === 'remove') {
            setAddEmail((previousState) =>
                previousState.filter((inputArray) => inputArray.id !== id)
            )
        } else {
            if (addEmail.length < 3) {
                setAddEmail((previousState) => [
                    ...previousState,
                    {
                        id: uuidv4(),
                        email: '',
                        error: false,
                        error_message: 'Please Enter Email',
                    },
                ])
            }
        }
    }

    function handleEmailInput(uid, mailId) {
        setAddEmail((prev) => {
            return prev.map((email) => {
                if (email.id === uid) {
                    return {
                        id: uid,
                        email: mailId,
                        error: false,
                        error_message: '',
                    }
                } else {
                    return email
                }
            })
        })
    }

    function handleLoopDatafromState(state, keyName) {
        const result = []
        state.map((data) => {
            if(data[keyName]){
                result.push(`${data[keyName]}`)
            }
        })
        return result
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

    function checkIsError(fieldName, id) {
        let flag = false;
        switch (fieldName) {
            case 'contact_person_name':
                flag = contactPerson.name_error;
            break;
            case 'phone_number':
                if(addMobileNum?.length){
                    addMobileNum.map((valObj)=>{
                        if(valObj.id == id){
                            flag = valObj?.error;
                        }
                    })
                }
            break;
            case 'whatsapp_number':
                if(addWhatsAppNum?.length){
                    addWhatsAppNum.map((valObj)=>{
                        if(valObj.id == id){
                            flag = valObj?.error;
                        }
                    })
                }
            break;
            case 'landline_number':
                if(addLandlineNum?.length){
                    addLandlineNum.map((valObj)=>{
                        if(valObj.id == id) {
                            flag = valObj?.error;
                        }
                    })
                }
            break;
            case 'email':
                if(addEmail?.length){
                    addEmail.map((valObj)=>{
                        if(valObj.id == id) {
                            flag = valObj?.error;
                        }
                    })
                }
            break;
        }
        return flag;
    }

    async function validateDataOnBlur(fieldName, val, id) {
        let errorMsg = null; 
        let blocked = true;
        if(!val?.length) return
        switch (fieldName) {
            case 'contact_person_name':
                let flag = false;
                // let regexname = /^[a-zA-Z0-9\s]+$/;
                let regexname = /^[a-zA-Z\s]+([.'''’’’"'"``]{0,1}[ ]{0,1}[a-zA-Z\s'`]+)*$/
                let regextRepetiveCheck = /(.)\1{4,}/
                if(!regexname.test(val) || regextRepetiveCheck.test(val)) {
                    errorMsg = error_msg.MSG_CONTACTPERSON_REPCHAR;
                    flag = true;
                }
                setContactPerson((prev)=> {
                    return {
                        ...prev, name_error: flag, err_msg: flag? errorMsg : ''
                    }
                })
                break;
            case 'phone_number':
                let flagphonenumber = false;
                if (val !== "") {
                    blocked = await checkBlockedNumber(val)
                }
                if(!isValidMobileNumber(val)) {
                    flagphonenumber =  true
                    errorMsg = error_msg.MSG_MOBILE_MAXLENGTH;
                    errData.current.mobile.push(id);
                } else if(!blocked) {
                    flagphonenumber =  true
                    errorMsg = 'This Number has been Blocked for Signing Up';
                    errData.current.mobile.push(id);
                } else{
                    if(errData.current.mobile.includes(id)){
                       let index = errData.current.mobile.indexOf(id)
                       errData.current.mobile.splice(index,1)
                    }
                }
                let alreadyErrorNumber = {}
                let alreadyErrorRemove = false;
                if(!flagphonenumber) {
                    let flag = false;
                    addMobileNum.map((e)=>{
                        if(e.error){
                            alreadyErrorNumber.id = e.id
                            alreadyErrorNumber.mobile = e.mobile
                        }
                    })
                    addMobileNum.map((e)=>{
                        if(alreadyErrorNumber.id !== e.id){
                            if(e.mobile === alreadyErrorNumber.mobile){
                                alreadyErrorRemove = true
                            }
                        }
                        if(id !== e.id) {
                            if(e.mobile === val){
                                flag = true
                            }
                        }
                    })
                    errorMsg = flag? error_msg.MSG_MOBILE_DUPLICATE : ""
                    flagphonenumber = flag;
                }

                if(!alreadyErrorRemove && Object.entries(alreadyErrorNumber).length !== 0){
                    setAddMobileNum((prev)=>{
                        return prev.map((curr) => {
                            if(!errData.current.mobile.includes(curr.id)){
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
                        }else{
                            return curr
                        }
                        })
                    })
                }

                setAddMobileNum((prev) =>
                    prev.map((curr) => {
                        if (curr.id === id) {
                            return {
                                id: curr.id,
                                mobile: curr.mobile,
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
            case 'whatsapp_number':
                let flagwhatsappnumber = false;
                if (val !== "") {
                    blocked = await checkBlockedNumber(val)
                }

                let wap_regex = /^[1-9]\d{9}$/;

                // if(!wap_regex.test(val) || !blocked) {
                if(val.length < 10) {
                    errorMsg = error_msg.MSG_WHATSAPP_NUMBER_MINLENGTH;
                    flagwhatsappnumber =true
                    errData.current.whatsapp.push(id);
                } else if(!blocked){
                    errorMsg = 'This Number has been Blocked for Signing Up';
                    flagwhatsappnumber =true
                    errData.current.whatsapp.push(id);
                } else{
                    if(errData.current.whatsapp.includes(id)){
                       let index = errData.current.whatsapp.indexOf(id)
                       errData.current.whatsapp.splice(index,1)
                    }
                }
                let alreadyErrorWapNumber = {}
                let alreadyErrorWapRemove = false;
                if(!flagwhatsappnumber) {
                    let flag = false;
                    addWhatsAppNum.map((e)=>{
                        if(e.error){
                            alreadyErrorWapNumber.id = e.id
                            alreadyErrorWapNumber.mobile = e.mobile
                        }
                    })
                    addWhatsAppNum.map((e)=>{
                        if(alreadyErrorWapNumber.id !== e.id){
                            if(e.mobile === alreadyErrorWapNumber.mobile){
                                alreadyErrorWapRemove = true
                            }
                        }
                        if(e.id !== id){
                            if(e.mobile === val) {
                                flag = true;
                            }
                        }
                    })
                    if(flag) errorMsg = error_msg.MSG_WHATSAPP_NUMBER_DUPLICATE;
                    flagwhatsappnumber = flag
                }

                if(!alreadyErrorWapRemove && Object.entries(alreadyErrorWapNumber).length !== 0){
                    setAddWhatsAppNum((prev)=>{
                        return prev.map((curr) => {
                            if(!errData.current.whatsapp.includes(curr.id)){
                            if (curr.id === alreadyErrorWapNumber.id) {
                                return {
                                    id: alreadyErrorWapNumber.id,
                                    mobile: alreadyErrorWapNumber.mobile,
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
                setAddWhatsAppNum((prev) =>
                    prev.map((curr) => {
                        if (curr.id === id) {
                            return {
                                id: curr.id,
                                mobile: curr.mobile,
                                error: flagwhatsappnumber,
                                error_message: flagwhatsappnumber? errorMsg : "",
                            }
                        } else {
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
                if(!regex.test(val) || /^[0189]/.test(val)) {
                    errorMsg = error_msg.MSG_TELE_MINLENGTH;
                    flaglandlinenumber = true;
                    errData.current.landline.push(id);
                } else if(!blocked){
                    errorMsg = 'This Number has been Blocked for Signing Up';
                    flaglandlinenumber = true;
                    errData.current.landline.push(id);
                } else{
                    if(errData.current.landline.includes(id)){
                       let index = errData.current.landline.indexOf(id)
                       errData.current.landline.splice(index,1)
                    }
                }
                let alreadyErrorLanNumber = {}
                let alreadyErrorLanRemove = false;
                if(!flaglandlinenumber) {
                    let flag = false;
                    addLandlineNum.map((e)=>{
                        if(e.error){
                            alreadyErrorLanNumber.id = e.id
                            alreadyErrorLanNumber.landline = e.landline
                        }
                    })
                    addLandlineNum.map((e)=>{
                        if(alreadyErrorLanNumber.id !== e.id){
                            if(e.landline === alreadyErrorLanNumber.landline){
                                alreadyErrorLanRemove = true
                            }
                        }
                        if(e.id !== id) {
                            if(e.landline === val) {
                                flag = true;
                            }
                        } 
                    })
                    if(flag) errorMsg = error_msg.MSG_TELE_DUPLICATE;
                    flaglandlinenumber = flag;
                }
                if(!alreadyErrorLanRemove && Object.entries(alreadyErrorLanNumber).length !== 0){
                    setAddLandlineNum((prev)=>{
                        return prev.map((curr) => {
                            if(!errData.current.landline.includes(curr.id)){
                            if (curr.id === alreadyErrorLanNumber.id) {
                                return {
                                    id: alreadyErrorLanNumber.id,
                                    landline: alreadyErrorLanNumber.landline,
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
                    prev.map((curr) => {
                        if (curr.id == id) {
                            return {
                                id: curr.id,
                                landline: curr.landline,
                                error: flaglandlinenumber,
                                error_message: flaglandlinenumber? errorMsg : "",
                            }
                        }
                        else {
                            return curr
                        }
                    })
                )
                break;
            case 'email':
                let email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                let flagemail = false;
                if(!email_regex.test(val)) {
                    flagemail = true;
                    errorMsg = error_msg.MSG_EMAIL_INVALID;
                    errData.current.email.push(id);
                }else{
                    if(errData.current.email.includes(id)){
                       let index = errData.current.email.indexOf(id)
                       errData.current.email.splice(index,1)
                    }
                }


                let alreadyErrorEmail = {}
                let alreadyErrorEmailRemove = false;
                if(!flagemail) {
                    let flag = false;
                    addEmail.map((e)=>{
                        if(e.error){
                            alreadyErrorEmail.id = e.id
                            alreadyErrorEmail.email = e.email
                        }
                    })
                    addEmail.map((e)=>{
                        if(alreadyErrorEmail.id !== e.id){
                            if(e.email === alreadyErrorEmail.email){
                                alreadyErrorEmailRemove = true
                            }
                        }
                        if(e.id !== id){
                            if(e.email === val) {
                                flag = true;
                            }
                        }
                    })
                    if(flag) errorMsg = error_msg.MSG_EMAIL_DUPLICATE;
                    flagemail = flag
                }

                if(!alreadyErrorEmailRemove && Object.entries(alreadyErrorEmail).length !== 0){
                    setAddEmail((prev)=>{
                        return prev.map((curr) => {
                            if(!errData.current.email.includes(curr.id)){
                            if (curr.id === alreadyErrorEmail.id) {
                                return {
                                    id: alreadyErrorEmail.id,
                                    email: alreadyErrorEmail.email,
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
                setAddEmail((prev) =>
                    prev.map((curr) => {
                        if (curr.id === id) {
                            return {
                                id: curr.id,
                                email: curr.email,
                                error: flagemail,
                                error_message: flagemail? errorMsg : "",
                            }
                        } else {
                            return curr
                        }
                    })
                )
                break;    
        }
    }

    const isErrorOnSubmit = () =>{
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
            contactPerson.name.length > 0 && !regexname.test(contactPerson.name) || regextRepetiveCheck.test(contactPerson.name)
            || contactPerson.name_error
        ) {
            setContactPerson((state) => {
                return { ...state, name_error: true }
            })
            anyError = true
        }

        addMobileNum.map((mobileNos) => {
            if (mobileNos.error) {
                anyError = true
            }
        })

        addWhatsAppNum.map((mobileNos) => {
            if (mobileNos.error) {
                anyError = true
            }
        })

        addLandlineNum.map((lan) => {
            if (lan.error) {
                anyError = true
            }
        })

        addEmail.map((email) => {
            if (email.error && !isValidEmailId(email.email)) {
                anyError = true
            }
        })

        if(contactPerson?.name_error==true) {
            anyError = true;

        }

        return anyError
    }

    const onFormSubmit = async () => {
        setLoader(true)
        //click tracker implementaion
        clickTracker({
            sourceCode: sourceCodeNew,
            docid: StoreCommonInfo?.docid,
            li: 'FL_AddContact',
            ll: 'FL_Contact',
        })
        let anyError = isErrorOnSubmit()
        if (!anyError) {
            let personName = `${contactPerson.title} ${contactPerson.name}${addDesignation.designation?.length > 0 &&
                isUserSelectedDataFromDropDown
                ? ' (' + addDesignation.designation + ')'
                : ''
                }`

            let designations = addDesignation.designation
            let MobileNos = handleLoopDatafromState(addMobileNum, 'mobile')
            let emails = handleLoopDatafromState(addEmail, 'email')
            let landlineNos = handleLoopDatafromState(
                addLandlineNum,
                'landline'
            )
            let WhatsappNos = handleLoopDatafromState(addWhatsAppNum, 'mobile')

            dispatch(updatecontactPerson(contactPerson.name))
            dispatch(updateDesignation(designations))
            dispatch(updateMobileNumber(MobileNos))
            dispatch(updateEmailId(emails))
            dispatch(updateLandlineNumber(landlineNos))
            dispatch(updateWhatsAppNumber(WhatsappNos))

            var AddressLocalStorage = {
                contactPerson: contactPerson.name,
                Designation: designations,
                mobile_number: MobileNos,
                EmailId: emails,
                landline_number: landlineNos,
                WhatsappNos: WhatsappNos,
            }

            const salt = 'Bj94h%5n49jK#HMAkh7O0Wf5sjXk9KlDbzvh'
            let encryptedAddress = CryptoJS.AES.encrypt(
                JSON.stringify(AddressLocalStorage),
                salt
            ).toString()
            localStorage.setItem(
                'AddressLocalStorage',
                JSON.stringify(encryptedAddress)
            )
            try {
                let trackingDataPayload = {
                    source: sourceCode,
                    clickType: 'click',
                    IP: IP || IP_Prop || "",
                    trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
                    mobile: MobileCookie || mobileNumber || reduxMobile,
                    docid: StoreCommonInfo?.docid || "",
                    sessionId: sesionId || "",
                    city: StoreAddressInfo.city || ""
                }
                await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
            } catch (error) {
                console.log(error.message)
            }

            let postAddContactObject = {
                docid: StoreCommonInfo.docid,
                parentid: StoreCommonInfo.parentid,
                contact_person_display: personName,
                contact_person: personName,
                contact_person_addinfo: personName,
                mobile_display: MobileNos.toString(),
                mobile: MobileNos.toString(),
                mobile_feedback: MobileNos.toString(),
                landline: landlineNos.toString(),
                landline_display: landlineNos.toString(),
                messenger_enabled: JSON.stringify({ wup: WhatsappNos }),
                email: emails.toString(),
                email_display: emails.toString(),
                companyname: StoreCommonInfo.companyName,
                city: StoreAddressInfo.city,
                data_city: StoreAddressInfo.city,
                stdcode: StoreCommonInfo.stdcode,
                source: sourceCodeNew,
                wnumber: WhatsappNos.toString(),
                IP: IP || IP_Prop || '',
            }

            PostAddContactAPI(postAddContactObject).then((res) => {
                if (res.data.success) {
                    // document.cookie = "isFlow = true"
                    clickTracker({
                        sourceCode: sourceCodeNew,
                        docid: StoreCommonInfo?.docid,
                        li: 'NFL_Contact_Detail_Continue',
                        ll: 'NFL_LP',
                    })
                    if (sendToAdvertisePage) {
                        let query = new URLSearchParams(
                            router?.query || {}
                        ).toString()
                        router.push({
                            pathname: "/addcategories",
                            query: router.query || {}
                        })
                    } else {
                        let query = router?.asPath || ''
                        query = query.split('?')
                        if (query.length) query = '?' + query[1]
                        router.push({
                            pathname: "/addtiming",
                            query: router.query || {}
                        })
                    }
                } else {
                    setLoader(false)
                    setResponceMsg('Something went wrong')
                }
            })
        } else {
            setLoader(false)
        }
    }

    function handleFocusTitle() {
        setContactPerson((state) => {
            return { ...state, title_drop: true }
        })
    }

    function handleSelect(selectedTitle) {
        setContactPerson((state) => {
            return {
                ...state,
                title_drop: false,
                title: selectedTitle,
                title_error: false,
            }
        })
        inputRef.current.focus()
    }

    const maxLengthCheck = (e) => {
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength)
        }
    }

    const handleReadOnly = () => { }

    const handleBackData = () => {
        if (StorecontactInfo.EmailId.length > 0) {
            setAddEmail([])
            StorecontactInfo.EmailId.map((email) => {
                setAddEmail((previousState) => [
                    ...previousState,
                    {
                        id: uuidv4(),
                        email: email,
                        error: false,
                        error_message: 'Please Enter Email',
                    },
                ])
            })
        }
        if (StorecontactInfo.mobile_number.length > 0) {
            setAddMobileNum([])
            StorecontactInfo.mobile_number.map((num) => {
                setAddMobileNum((previousState) => [
                    ...previousState,
                    {
                        id: uuidv4(),
                        mobile: num,
                        error: false,
                        error_message: 'Please Enter Mobile Number',
                    },
                ])
            })
        }

        if (StorecontactInfo.WhatsappNos.length > 0) {
            setAddWhatsAppNum([])
            StorecontactInfo.WhatsappNos.map((num) => {
                setAddWhatsAppNum((previousState) => [
                    ...previousState,
                    {
                        id: uuidv4(),
                        mobile: num,
                        error: false,
                        error_message: 'Please Enter WhatsApp Number',
                    },
                ])
            })
        }

        if (StorecontactInfo.landline_number.length > 0) {
            setAddLandlineNum([])
            StorecontactInfo.landline_number.map((lan) => {
                setAddLandlineNum((previousState) => [
                    ...previousState,
                    {
                        id: uuidv4(),
                        extensionNum: StoreCommonInfo.stdcode,
                        landline: lan,
                        error: false,
                        error_message: 'Please Enter Landline Number',
                    },
                ])
            })
        }
    }

    useEffect(() => {
        let trackingDataPayload = {
            source: sourceCode,
            clickType: 'load',
            IP: IP || IP_Prop || "",
            trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
            mobile: MobileCookie || mobileNumber || reduxMobile,
            docid: StoreCommonInfo?.docid || "",
            sessionId: sesionId || "",
            city: StoreAddressInfo.city || ""
        }
        trackingDashboardAPI(trackingDataPayload, window.location.href || "");
        document.cookie = 'isFlow = false'
        document.addEventListener('click', handleclickoutside, false)
        inputRef.current.focus()
        handleBackData()
        return () => removeEventListener('click', handleclickoutside, false)
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
            if (dropdownName === 'designation') {
                if (e.key === 'ArrowUp' && dropdownActiveIndex > 0) {
                    setDropdownActiveIndex((prev) => prev - 1)
                    if (dropdownActiveIndex < addDesignation.lists.length - 3) {
                        document
                            .getElementById('IdAreaDropdown')
                            .scrollBy({ top: -50 })
                    }
                }
                if (e.key === 'ArrowDown') {
                    if (
                        addDesignation.lists.length !==
                        dropdownActiveIndex + 1
                    ) {
                        setDropdownActiveIndex((prev) => prev + 1)
                    }
                    if (dropdownActiveIndex >= 3) {
                        document
                            .getElementById('IdAreaDropdown')
                            .scrollBy({ top: 50 })
                    }
                }
                if (e.key === 'Enter') {
                    e.preventDefault()
                    setAddDesignation((state) => {
                        return {
                            ...state,
                            designation:
                                addDesignation.lists[dropdownActiveIndex],
                            isDesignationSelected: true,
                        }
                    })
                }
            }
        }
    }

    const setSourceQuery = () => {
        let userAgent = navigator?.userAgent
        let sourceVal = '77'
        if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                userAgent
            )
        ) {
            sourceVal = '2'
        }
        let queryObj = router.query

        queryObj.source = sourceVal
        router.push({
            pathname: '/bussinesslist',
            query: queryObj,
        })
    }

    const handlePopState = () => {
        setSourceQuery()
    }

    useEffect(() => {
        clickTracker({
            sourceCode: sourceCodeNew,
            docid: StoreCommonInfo?.docid,
            li: 'NFL_Contact_Detail_PL',
            ll: 'NFL_LP',
        })
        document.cookie = 'isFlow=false'
        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    useEffect(() => {
        if (addMobileNum[0].mobile !== addWhatsAppNum[0].mobile) {
            document.getElementById('wupCheckbox').checked = false
        } else {
            document.getElementById('wupCheckbox').checked = true
        }
    }, [addWhatsAppNum[0].mobile])

    return (
        <>
            <div className="container__inner">
                <div className={`container__inner__left`}>
                    <div className="left__img">
                        <Image
                            fill
                            src={
                                'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/add_contact_2x.png'
                            }
                            alt={'Business Listing Image'}
                            title="Business Listing Image"
                        />
                    </div>
                </div>
                <div
                    className={`container__inner__right input_height ${styles.addcontact}`}   >
                    <form 
                        novalidate="novalidate"
                        onKeyDown={(e) => {
                            let ENTER_KEY_CODE = 13
                            if (e.keyCode == ENTER_KEY_CODE) {
                                e.preventDefault()
                                onFormSubmit()
                            }    
                        }}
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}
                    >
                        <progress className={`${styles.progressbar}`} value={StoreCommonInfo?.contactDetailProgress || 25} max="100" />
                        <p className={`${styles.title} color111 fw600`}>  {' '}
                            Add Contact Details{' '}
                        </p>
                        {/* <p className={`${styles.content} color111`}> Showcase phone number, website URL and more on your business listing </p> */}
                        {/* <form className={`form`}> */}
                        <div className={`inputwrap__flex mt-20`}>
                            <div className="inputwrap input__small mb-5">
                                <input
                                    className="input"
                                    type="text"
                                    value={contactPerson.title}
                                    onFocus={handleFocusTitle}
                                    /* The above code is a comment in JavaScript. It is not doing
                                    anything, but it is used to provide information or explanations
                                    about the code to other developers. */
                                    onChange={handleReadOnly}
                                    autoComplete="off"
                                    name="title"
                                    inputmode="none"
                                    onKeyDown={() =>
                                        handleDropdownArrowKey('title')
                                    }
                                    required
                                    title="title"
                                />
                                <label className="input__label">Title</label>
                                <span
                                    className={`iconwrap selectarrow `}
                                    onClick={() => handleFocusTitle()}
                                    name="title"
                                />
                                <ul className={`dropdown color111 ${contactPerson.title_drop ? '' : 'dn'}`}  >
                                    <li onClick={() => handleSelect('Mr')} className={dropdownActiveIndex === 0 ? 'active' : ''}  >
                                        Mr
                                    </li>
                                    <li onClick={() => handleSelect('Ms')} className={dropdownActiveIndex === 1 ? 'active' : ''}  >
                                        Ms
                                    </li>
                                    <li onClick={() => handleSelect('Mrs')} className={dropdownActiveIndex === 2 ? 'active' : ''}   >
                                        Mrs
                                    </li>
                                    <li onClick={() => handleSelect('Dr')} className={dropdownActiveIndex === 3 ? 'active' : ''}   >
                                        Dr
                                    </li>
                                </ul>
                                <div className={`error__message mt-5 ${contactPerson.title_error ? '' : 'dn'}`}   >
                                    {' '}
                                    Please Select Title{' '}
                                </div>
                            </div>
                            <div
                                className={`inputwrap input__large mb-5 ${contactPerson.title_error || contactPerson.name_error ? 'inputwrap__error' : ''}`}   >
                                <input
                                    className="input"
                                    id="contactPerson"
                                    type="text"
                                    name="contactPerson"
                                    value={contactPerson.name}
                                    onBlur={()=>{
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
                                    title="contactPerson"
                                />
                                <label className="input__label">
                                    Contact Person
                                </label>
                                <div id="contactPerson" className={`error__message mt-5 ${checkIsError('contact_person_name')? '' : 'dn'}`}  >
                                    {' '}
                                    {`${contactPerson.name === ''
                                        ? 'Please Enter Contact Person'
                                        : contactPerson.err_msg
                                        }`}{' '}
                                </div>
                            </div>
                        </div>

                        {addMobileNum.map((data, i) => {
                            return (
                                <div
                                    className={`inputwrap__flex ${
                                        data?.error ? 'inputwrap__error' : ''
                                    } mt-20`}
                                    key={data.id}
                                >
                                    <div className="inputwrap input__small mb-5">
                                        <span className={`${styles.countrycode}`}  >
                                            <span className={`${styles.countryflag} mr-5`}   >
                                                <Image width={23} height={16}
                                                    src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/india_flag.svg"
                                                    alt="Country Flag"
                                                    title="Country Flag"
                                                />
                                            </span>{' '}
                                            +91{' '}
                                        </span>
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
                                            onBlur={(e)=>{
                                                validateDataOnBlur('phone_number', data.mobile, data.id);
                                                // handleCheckValidPhoneNumber(e.target.value, data.id)
                                            }
                                            }
                                            autoComplete="off"
                                            disabled={i === 0 ? 'disabled' : ''}
                                            required
                                            title="Mobile Number"
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
                            <button className={`${styles.transparentButton} transparentButton font13`} onClick={() => handleAddMobileNumber()}   >
                                + Add Another Mobile Number
                            </button>
                        )}

                        {addWhatsAppNum.map((data, i) => {
                            return (
                                <div
                                    className={`inputwrap__flex ${
                                        data?.error ? 'inputwrap__error' : ''
                                    } mt-20`}
                                    key={data.id}
                                >
                                    <div className="inputwrap input__small mb-5">
                                        <span className={`${styles.countrycode}`}  >
                                            <span className={`${styles.countryflag} mr-5`}  >
                                                <Image width={23} height={16}
                                                    src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/india_flag.svg"
                                                    alt="Country Flag"
                                                    title="Country Flag"
                                                />
                                            </span>{' '}
                                            +91{' '}
                                        </span>
                                    </div>
                                    <div className="inputwrap input__large mb-5">
                                        {addWhatsAppNum.length > 1 ? (
                                            i !== 0 ? (
                                                <span className={`iconwrap closeicon__grey`} onClick={() => { handleAddWhatsappNumber('remove', data.id, i) }} />
                                            ) : ('')) : ('')}
                                        <input
                                            className="input"
                                            type="text"
                                            onChange={(e) =>
                                                handleWhatsappInput(e, data.id)
                                            }
                                            onPaste={(e) =>
                                                handleWhatsappInput(e, data.id)
                                            }
                                            value={data?.mobile}
                                            autoComplete="off"
                                            onBlur={(e)=>{
                                                // handleCheckValidWhatsappNumber(e.target.value, data.id)
                                                validateDataOnBlur('whatsapp_number', data.mobile, data.id)
                                            }}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            required
                                            title="whatsapp Number"
                                        />
                                        <label className="input__label">
                                            WhatsApp Number
                                        </label> 
                                        <div
                                            className={`error__message mt-5 ${
                                                checkIsError('whatsapp_number', data.id) ? '' : 'dn'
                                            }`}
                                        >
                                            {data.error_message}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}   
                        <div className={`${styles.button_outer}`}>
                            {addWhatsAppNum.length < 3 && (
                                <button aria-label="Add WhatsApp Number"
                                    className={`${styles.transparentButton} transparentButton font13 mb-10`}
                                    onClick={() => handleAddWhatsappNumber()}
                                >
                                    + Add WhatsApp Number
                                </button>
                            )}

                            <label tabIndex="0" aria-label="Same As Mobile Number" className={`font13 mb-10 color007 ${styles.samefield}`} onClick={() => handleSameAsMobileNumber()}  >
                                <input type="checkbox" id="wupCheckbox" title="same As Mobile Number" />
                                <span className={`${styles.uncheck}`} />
                                <span>Same As Mobile Number</span>
                            </label>
                        </div>

                        {addLandlineNum.map((data) => {
                            return (
                                <div
                                    className={`inputwrap__flex mt-20`}
                                    key={data.id}
                                >
                                    <div className="inputwrap input__small mb-5">
                                        <span className={`${styles.countrycode}`}   >
                                            <span className={`${styles.countryflag} mr-5`}   >
                                                <Image width={23} height={16}
                                                    src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/india_flag.svg"
                                                    alt="Country Flag"
                                                    title="Country Flag"
                                                />
                                            </span>
                                            +91
                                        </span>
                                    </div>
                                    <div className="inputwrap input__small mb-5">
                                        <input
                                            className="input"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            onChange={(e) => console.log(e.target.value,"e.target.value")}
                                            value={StoreCommonInfo.stdcode}
                                            onInput={(e) => maxLengthCheck(e)}
                                            autoComplete="off"
                                            required
                                            title={StoreCommonInfo.stdcode}
                                        />
                                    </div>
                                    <div className={`inputwrap input__large ${checkIsError('landline_number', data.id) ? "inputwrap__error" : ""} mb-5`}>
                                        <span className={`iconwrap closeicon__grey`} onClick={() => handleAddLandlineNumber('remove', data.id)} />

                                        <input
                                            className="input"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            autoComplete="off"
                                            onChange={(e) => handleLandlineInput(data.id, '', e.target.value)}
                                            onBlur={(e) => {
                                                // handleCheckValidLandlineNumber(e.target.value, data.id);
                                                validateDataOnBlur('landline_number', data.landline, data.id)
                                            }}
                                            // maxLength={`${StoreCommonInfo.stdcode[0] == 0 ? 11 - (StoreCommonInfo?.stdcode?.length || 0) : 10 - (StoreCommonInfo?.stdcode?.length || 0)}`}
                                            value={data.landline}
                                            onInput={(e) => maxLengthCheck(e)}
                                            required
                                            title="Landline"
                                        />
                                        <label className="input__label">
                                            Landline No.
                                        </label>
                                        {/* <div className={`error__message mt-5 ${data.error ? '' : 'dn'}`}>Please Enter Landline Number</div> */}
                                        <div
                                            className={`error__message mt-5 ${
                                                checkIsError('landline_number', data.id) ? '' : 'dn'
                                            }`}
                                        >
                                            {data.error_message}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div></div>
                        {addLandlineNum.length < 3 && (
                            <button aria-label="Add Landline Number" className={`${styles.transparentButton} transparentButton font13`} onClick={() => handleAddLandlineNumber()}    >
                                + Add Landline Number
                            </button>
                        )}
                        {addEmail.map((data) => {
                            return (
                                <div className={`inputwrap inputwrap__flex ${data.error ? 'inputwrap__error' : ''} mt-20`} key={data.id}    >
                                    {/* <div className={`inputwrap inputwrap__flex ${data.error ? "inputwrap__error" : ""} mt-20`} key={data.id}> */}
                                    {addEmail.length > 1 ? (
                                        <span className={`iconwrap closeicon__grey`}
                                            onClick={() => handleAddEmail('remove', data.id)}
                                        />) : ('')}
                                    <input
                                        className="input"
                                        type="text"
                                        autoComplete="off"
                                        value={data.email}
                                        onChange={(e) =>
                                            handleEmailInput(
                                                data.id,
                                                e.target.value
                                            )
                                        }
                                        onBlur={()=>{
                                            validateDataOnBlur('email', data.email, data.id)
                                        }}
                                        required
                                        title="email"
                                    />
                                    <label className="input__label">
                                        Email
                                    </label>
                                    <div className={`error__message mt-5 ${checkIsError('email', data.id) ? '' : 'dn'}`}  >
                                        {data.error_message}
                                    </div>
                                </div>
                            )
                        })}
                        {addEmail.length < 3 && (
                            <button aria-label="Add Another Email" className={`transparentButton font13`} onClick={() => handleAddEmail()}    >
                                + Add Another Email
                            </button>
                        )}

                        {!loader ? (
                            <button aria-label="Save and Continue" className="primarybutton fw500 ripple mt-10" onClick={onFormSubmit}   >
                                Save and Continue
                            </button>
                        ) : (
                            <button aria-label="Button Loader" disabled className={`primarybutton mt-10`}>
                                <span className="btn-loader" />
                            </button>
                        )}
                    </form>
                </div>
                {showToast()}
            </div>
        </>
    )
}
