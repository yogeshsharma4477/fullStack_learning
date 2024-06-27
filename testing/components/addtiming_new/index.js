import React, { useEffect, useReducer, useRef, useState } from "react";
import { checkIsAllFilled, compareTime, convertTime12to24, genrateOption, timeDiffrence, unsetDayFromAll } from "./functions";
import styles from "../../components/addtiming/addtiming.module.scss";
import { checkForOverLap, checkIsAny24hr_closed, checkIsMoreThan2Selected } from "./validations";
import Popup from "./subcomponents/Popup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { updateTimmingArr } from "@/store/Slices/addTiimmingSlice";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import Image from "next/image";
import clickTracker from "@/utils/clickTracker";
import { sanitizeParams } from "@/utils/commonFunc";
import { trackingDashboardAPI } from "@/utils/api";

const AddTimming = ({ IP, logWorker }) => {

    const router = useRouter();
    var source = sanitizeParams(router.query.source);
    const dispatch = useDispatch();

    const timeSlotReduxData = useSelector((state) => {
        return state?.TimmingList?.timmingArr || []
    })
    const firstTimeSlotUpdate = useRef(true)
    const [timeSlotArr, setTimeSlotArr] = useState([])
    const [isLoader, setLoader] = useState(false)
    const [responceMsg, setResponceMsg] = useState('')
    const [dropdown, setDropdown] = useState([])
    const closeAtInputRef = useRef()
    const openAtInputRef = useRef()
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [popupMsg, setPopupMsg] = useState('')
    const firstRender = useRef(true)
    const startTimeDataRef = useRef('')
    const endTimeDataRef = useRef('')
    const currypeVal = useRef('')
    const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
    const vendor_mobile = useSelector(state => state?.dcLandingSlice?.mobile_number)
    const isDcFlow = router?.pathname?.includes('/dc')
    let lat = sanitizeParams(router?.query?.lat) || ""
    let long = sanitizeParams(router?.query?.long) || ""
    const StoreCommonInfo = useSelector((state) => {
        let obj = {
            companyName: state?.CommonValues?.companyName || '',
            docid: state?.CommonValues?.docid || '',
            city: state?.Address?.city || '',
            parentid: state?.CommonValues?.parentid || '',
            mobileNumber: state?.CommonValues?.mobileNumber || '',
            contactDetailProgress: state?.CommonValues?.contactDetailProgress || '',
        }
        return obj;
    })

    const [popUpResponceObj, setPopUpResponceObj] = useState({
        hr24: false,
        closed: false,
        hr3: false,
        hr14: false,
        hr8pm_6am: false,
    })

    const weekDays = [
        { key: 'Mon', label: 'Mon' },
        { key: 'Tue', label: 'Tue' },
        { key: 'Wed', label: 'Wed' },
        { key: 'Thu', label: 'Thu' },
        { key: 'Fri', label: 'Fri' },
        { key: 'Sat', label: 'Sat' },
        { key: 'Sun', label: 'Sun' }
    ]
    const daysName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    class TimeObj {
        dummyTimeSlotArr = [];
        constructor(list) {
        }
        openAtDropDownOption = genrateOption('openAt', 15)
        closeAtDropDownOption = genrateOption('closeAt', 15)
        filteredOpenAtDropDownOption = this.openAtDropDownOption
        filteredCloseAtDropDownOption = this.closeAtDropDownOption
        selectedWeekValArr = new Array(7).fill(false);
        openAtVal = ''
        closeAtVal = ''
        timeSlotArrData = []
        isCloseAthHiddien = false
        isWeekErr = false
        isOpenAtErr = false
        isCloseAtErr = false
        isSelectAllchecked = false
        selectAllErrorDays = ""
        setTimeSlotArrData = (temp) => {
            this.timeSlotArrData = temp
        }
        onSelectAll = (e, containerIndex) => {
            this.isSelectAllchecked = e.target.checked
            let weekArr = [0, 1, 2, 3, 4, 5, 6]
            if (!e.target.checked) {
                this.selectedWeekValArr = new Array(7).fill(false);
                forceUpdate();
                return
            }
            forceUpdate();
            weekArr.map(index => {
                return this.onWeekClick(index, containerIndex, "all")
            })
            forceUpdate();
        }
        onWeekClick = (index, containerIndex, selectAll = null) => {
            if (selectAll === "all" && index == 0) {
                this.selectAllErrorDays = ''
            }
            let is24hrsError = false
            let isError = false;
            if (!this.selectedWeekValArr[index]) {
                isError ||= checkIsAny24hr_closed('Open 24hrs', index, this.timeSlotArrData);
                if (isError) {
                    is24hrsError = true
                    if (selectAll === "all") {
                        this.selectAllErrorDays += `${daysName[index]}, `
                    } else {
                        setResponceMsg(() => `${daysName[index]} Cannot be Selected as it is Marked as Open 24hrs.`);
                    }
                    this.isSelectAllchecked = false
                }
                isError ||= checkIsAny24hr_closed('Closed', index, this.timeSlotArrData);
                if (isError && !is24hrsError) {
                    if (selectAll === "all") {
                        this.selectAllErrorDays += `${daysName[index]}, `
                    } else {
                        setResponceMsg(`${daysName[index]} Cannot be Selected as it is Marked as Closed.`);
                    }
                    this.isSelectAllchecked = false
                }
                if (checkIsMoreThan2Selected(index, this.timeSlotArrData)) {
                    setResponceMsg(() => `${daysName[index]} Cannot be Selected in More than 2 Time Slots.`);
                    this.isSelectAllchecked = false
                    return !isError;
                } else if (!isError) {
                    if (this.openAtVal == 'Open 24hrs' || this.openAtVal == 'Closed') {
                        unsetDayFromAll(this.openAtVal, containerIndex, this.timeSlotArrData, index);
                        this.isSelectAllchecked = false
                    }
                    this.selectedWeekValArr[index] = !this.selectedWeekValArr[index];
                    if (this.selectedWeekValArr.every(item => item === true && this.selectedWeekValArr.length)) {
                        this.isSelectAllchecked = true
                    }
                    this.isWeekErr = false
                    forceUpdate()
                }
            } else {
                if (selectAll && this.selectedWeekValArr[index]) {
                    this.selectedWeekValArr[index] = true
                } else {
                    this.isSelectAllchecked = false
                    this.selectedWeekValArr[index] = !this.selectedWeekValArr[index];
                }
                this.isWeekErr = false
                forceUpdate()
            }
            if (selectAll === "all" && index == 6 && this.selectAllErrorDays.length > 0) {
                setResponceMsg(`Selected Day(s) cannot be Selected as it is Marked as Closed/Open (24 Hours)`);
                // setResponceMsg(`${this.selectAllErrorDays.replace(/,\s*$/, "")} Cannot be Selected as it is Marked as Closed/Open 24hrs.`);
                setResponceMsg(`Selected Day(s) cannot be Selected as it is Marked as Closed/Open (24 Hours)`);
            }
            forceUpdate();
            return !isError;
        }
        onDropDownClick = (type, val, index) => {
            let exceptionValArr = ['12:00 AM (Midnight)', '12:15 AM (Midnight)', '12:30 AM (Midnight)']
            let isOverLap = false;
            let closeAtIndexStarts = this.closeAtDropDownOption.findIndex(value => value.label === val)
            if (closeAtIndexStarts >= 93) {
                closeAtIndexStarts = Math.abs(closeAtIndexStarts - this.closeAtDropDownOption.length)
            } else {
                closeAtIndexStarts = closeAtIndexStarts + 4
            }
            switch (type) {
                case 'openAt':
                    let is_OpenAt_CloseAt = (val == 'Open 24hrs' || val == 'Closed')
                    if (is_OpenAt_CloseAt) {
                        this.openAtVal = val;
                        this.isCloseAthHiddien = true;
                        this.closeAtVal = '';
                        this.isOpenAtErr = false;
                        this.isCloseAtErr = false;
                        unsetDayFromAll(val, index, this.timeSlotArrData)
                        forceUpdate()
                    } else {
                        if (!exceptionValArr.includes(this.closeAtVal)) {
                            isOverLap = checkForOverLap(val, this.closeAtVal)
                        }
                        if (!isOverLap) {
                            let tempFilterCloseAtOption = [...this.closeAtDropDownOption];
                            let tempFilterCloseAtOptionStart = tempFilterCloseAtOption.slice(closeAtIndexStarts);
                            let tempFilterCloseAtOptionEnd = tempFilterCloseAtOption.slice(0, closeAtIndexStarts);
                            this.filteredCloseAtDropDownOption = [...tempFilterCloseAtOptionStart, ...tempFilterCloseAtOptionEnd]
                            // setTimeSlotArr([...tempTimeSlotArr])
                            this.isCloseAthHiddien = false;
                            this.openAtVal = val;
                            this.isOpenAtErr = false;
                            forceUpdate()
                        }
                        else setResponceMsg(`Open time is More then Close time.`);
                    }
                    if (!isOverLap) {
                        this.openAtVal = val;
                        if (openAtInputRef.current) {
                            openAtInputRef.current.value = val
                            openAtInputRef.current.blur()
                        }
                    }
                    break;
                case 'closeAt':
                    if (!exceptionValArr.includes(val)) {
                        isOverLap = checkForOverLap(this.openAtVal, val)
                    }
                    if (!isOverLap) {
                        this.closeAtVal = val;
                        if (closeAtInputRef.current) {
                            closeAtInputRef.current.value = val
                            closeAtInputRef.current.blur()
                            forceUpdate()
                        }
                        this.isCloseAtErr = false;
                    } else {
                        setResponceMsg(`Close time is Less then Open time.`);
                    }
                    break;
            }
        }
    }

    const setResponceToDefault = () => {
        setResponceMsg('');
    }

    const closePopup = (fromConfirm = false) => {
        if (!fromConfirm) setLoader(false);
        setPopupMsg('');
    }

    const confirmAction = (type) => {
        if (type) popUpResponceObj[type] = true;
        // InsertAPICall(startTimeDataRef.current, endTimeDataRef.current);
        closePopup(true);
        handleSubmit()
    }

    // bodyfixed

    const ShowToast = () => {
        if (!responceMsg?.length) return;
        setTimeout(() => {
            setResponceToDefault()
        }, 3000);
        return (
            <div className={`toastmessage font11 colorfff`}>
                <span className={`toastmessage__text`}>
                    {responceMsg}
                </span>
                <span
                    onClick={setResponceToDefault}
                    className={`iconwrap closeiconwhite ripple`}
                />
            </div>
        )
    }

    const AddNewSlot = () => {
        let isFirstRender = firstRender.current
        firstRender.current = false

        const { flag, data = {} } = checkIsAllFilled(timeSlotArr)
        let isGofurther = flag

        timeSlotArr.map((e, i) => {
            if (data?.weekErrIndex?.includes(i)) { timeSlotArr[i].isWeekErr = true; }
            else { timeSlotArr[i].isWeekErr = false; }

            if (data?.openAtErrIndex?.includes(i)) { timeSlotArr[i].isOpenAtErr = true; }
            else { timeSlotArr[i].isOpenAtErr = false; }

            if (data?.closedAtErrIndex?.includes(i)) { timeSlotArr[i].isCloseAtErr = true; }
            else { timeSlotArr[i].isCloseAtErr = false; }
        })
        if (isGofurther) {
            const tempTimeObj = new TimeObj(timeSlotArr);
            var tempDropdownObj = {
                openAt: false,
                closeAt: false
            };
            setDropdown((current) => [...current, tempDropdownObj]);
            setTimeSlotArr((current) => {
                if (firstRender.current && timeSlotReduxData) {
                    return timeSlotReduxData
                } else {
                    return [...current, tempTimeObj]
                }
            }
            );
        } else {
            setResponceMsg('Please fill above fields first.')
        }
    }

    const subscribeEvents = () => {
        if (document) document.addEventListener('click', closeAllDropDown)
    }


    const unSubscribeEvents = () => {
        if (document) document.removeEventListener('click', closeAllDropDown)
    }

    const closeAllDropDown = (event) => {
        let currClickElement = event?.target?.id || null
        let tempOpenAtVal = timeSlotArr[0]?.openAtVal || null
        let tempCloseAtVal = timeSlotArr[0]?.closeAtVal || null
        let isVlaidOpenAt = false;
        timeSlotArr[0]?.openAtDropDownOption.map((e) => {
            if (e.label === tempOpenAtVal) {
                isVlaidOpenAt = true;
            }
        })

        if (!isVlaidOpenAt && tempOpenAtVal) {
            timeSlotArr[0].openAtVal = '';
            timeSlotArr[0].filteredOpenAtDropDownOption = filteredOpenDropdownList(
                timeSlotArr[0].openAtDropDownOption,
                ''
            )
        }

        let isVlaidCloseAt = false;
        timeSlotArr[0]?.closeAtDropDownOption.map((e) => {
            if (e.label === tempCloseAtVal) {
                isVlaidCloseAt = true;
            }
        })

        if (!isVlaidCloseAt && tempCloseAtVal) {
            timeSlotArr[0].closeAtVal = '';
            timeSlotArr[0].filteredCloseAtDropDownOption = filteredOpenDropdownList(
                timeSlotArr[0].closeAtDropDownOption,
                ''
            )
        }

        if (['openAtInput', 'openAtIcon', 'closeAtInput', 'closeAtIcon'].includes(currClickElement)) return;
        dropdown.map((e, i) => {
            e.openAt = false,
                e.closeAt = false
        })
        forceUpdate();
        unSubscribeEvents()
    }

    const RemoveTimeSlot = (removeIndex) => {
        if (timeSlotArr.length > 1) {
            setTimeSlotArr((timeObj) => timeObj.filter((_, index) => index !== removeIndex));
            setDropdown((dropdownObj) => dropdownObj.filter((_, index) => index !== removeIndex));
        }
        if (timeSlotArr.length < 2) {
            setResponceMsg("Cannot remove all timeSlots.")
        }
    }

    const InsertAPICall = async (startPayload, endPayload) => {

        try {
            if (isDcFlow) {
                await logWorker("click", StoreCommonInfo?.docid || "")
            } else {
                let trackingDataPayload = {
                    source: source,
                    clickType: 'click',
                    IP: IP || "",
                    trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
                    mobile: isDcFlow ? vendor_mobile.toString() : StoreCommonInfo.mobileNumber,
                    docid: StoreCommonInfo?.docid || "",
                    sessionId: sesionId || "",
                    city: StoreCommonInfo.city || ""
                }
                await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
            }
        } catch (error) {
            console.log(error.message)
        }

        let payload = {
            working_time_start: startPayload,
            working_time_end: endPayload,
            companyname: StoreCommonInfo.companyName,
            city: StoreCommonInfo.city,
            data_city: StoreCommonInfo.city,
            docid: StoreCommonInfo.docid,
            parentid: StoreCommonInfo.parentid,
            ucode: isDcFlow ? vendor_mobile.toString() : StoreCommonInfo.mobileNumber,
            source: source,
            mobile: isDcFlow ? vendor_mobile.toString() : StoreCommonInfo.mobileNumber,
            uname: isDcFlow ? vendor_mobile.toString() : StoreCommonInfo.mobileNumber,
            // creatorip: IP,
            IP: IP ? IP : ""
        }

        axios({
            method: "post",
            url: "/api/v1/InsertAPI",
            data: payload
        })
            .then((res) => {
                clickTracker({
                    sourceCode: source || "",
                    docid: StoreCommonInfo?.docid || "",
                    li: 'Business_Timing_Continue',
                    ll: 'NFL_LP',
                })
                let query = router?.asPath || ''
                query = query.split('?')
                if (query.length) query = '?' + query[1]
                dispatch(updateTimmingArr({
                    'timmingArr': timeSlotArr,
                }));
                if (isDcFlow) {
                    router.push({
                        pathname: "/dc/addcategories",
                        query: router?.query || {},
                    });
                } else {
                    router.push({
                        pathname: "/addcategories",
                        query: router?.query || {},
                    });
                }
            })
            .catch((err) => {
                setLoader(false);
                console.log("----------------------")
                console.log(err)
                console.log("----------------------")
            })
    }

    function replaceLastOccurrence(inputString, search, replacement) {
        const regex = new RegExp(search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?=[^' + search + ']*$)');
        return inputString.replace(regex, replacement);
    }

    useEffect(() => {

        if (firstTimeSlotUpdate.current && timeSlotReduxData?.length) {
            let tempDropdown = []
            var tempDropdownObj = {
                openAt: false,
                closeAt: false
            };
            tempDropdown = timeSlotReduxData.map((e, index) => {
                return { ...tempDropdownObj }
            })
            setDropdown([...tempDropdown]);
            setTimeSlotArr([...timeSlotReduxData])
            firstTimeSlotUpdate.current = false
        }
    }, [timeSlotArr])


    const handleSubmit = () => {
        setLoader(true);
        let playloadStartArr = new Array(7).fill('');
        let playloadEndArr = new Array(7).fill('');
        let currPopupType = null;

        const { flag, data = {} } = checkIsAllFilled(timeSlotArr)
        let isGofurther = flag

        timeSlotArr.map((e, i) => {
            if (data?.weekErrIndex?.includes(i)) { timeSlotArr[i].isWeekErr = true; }
            else { timeSlotArr[i].isWeekErr = false; }

            if (data?.openAtErrIndex?.includes(i)) { timeSlotArr[i].isOpenAtErr = true; }
            else { timeSlotArr[i].isOpenAtErr = false; }

            if (data?.closedAtErrIndex?.includes(i)) { timeSlotArr[i].isCloseAtErr = true; }
            else { timeSlotArr[i].isCloseAtErr = false; }
        })
        let currStartTime = ''
        if (isGofurther) {
            timeSlotArr.map((data, index) => {
                currStartTime = data?.openAtVal || ''
                if (data.openAtVal == 'Open 24hrs') {
                    data.selectedWeekValArr.map((flag, weekIndex) => {
                        if (flag) {
                            playloadStartArr[weekIndex] = 'Open 24hrs'
                            playloadEndArr[weekIndex] = 'Open 24hrs'
                        }
                    })
                }
                else if (data.openAtVal == 'Closed') {
                    data.selectedWeekValArr.map((flag, weekIndex) => {
                        if (flag) {
                            playloadStartArr[weekIndex] = 'Closed'
                            playloadEndArr[weekIndex] = 'Closed'
                        }
                    })
                }
                else {
                    data.selectedWeekValArr.map((flag, weekIndex) => {
                        if (flag) {
                            if (playloadStartArr[weekIndex] != 'Open 24hrs') {
                                let StartTime = convertTime12to24(data.openAtVal);
                                let EndTime = convertTime12to24(data.closeAtVal);
                                if (playloadStartArr[weekIndex]?.length) {
                                    let isStartGreaterThenEndTime = compareTime(playloadEndArr[weekIndex], StartTime);
                                    let isStartLessThanOpenTime = compareTime(StartTime, playloadStartArr[weekIndex])
                                    let isEndGreaterThenEndTime = compareTime(playloadEndArr[weekIndex], EndTime)

                                    if (isStartGreaterThenEndTime) {
                                        playloadStartArr[weekIndex] += `-${StartTime}`
                                        playloadEndArr[weekIndex] += `-${EndTime}`
                                    } else if (isStartLessThanOpenTime) {
                                        if (isEndGreaterThenEndTime) {
                                            playloadStartArr[weekIndex] = StartTime
                                            playloadEndArr[weekIndex] = EndTime
                                        }
                                    } else {
                                        if (isEndGreaterThenEndTime) {
                                            playloadEndArr[weekIndex] = EndTime
                                        }
                                    }
                                } else {
                                    playloadStartArr[weekIndex] = StartTime;
                                    playloadEndArr[weekIndex] = EndTime;
                                }
                            }
                        }
                    })
                }

            })
            var dayStringArr = []
            var timeSum = 0

            playloadStartArr.map((dayVal, i) => {

                if (dayVal == 'Open 24hrs' && !popUpResponceObj['hr24'] && (currPopupType == null || currPopupType == 'hr24')) {
                    dayStringArr.push(daysName[i]);
                    if (!currPopupType) currPopupType = 'hr24'
                }
                else {
                    let isCheck = (currPopupType == 'hr3' || currPopupType == 'hr14' || currPopupType == 'hr8pm_6am' || currPopupType == null)
                    if (dayVal?.length && isCheck) {

                        let timeDiffrenceArr = [];
                        let dayValArr = dayVal.split('-')
                        let endDayValArr = playloadEndArr[i].split('-')

                        dayValArr.map((val, index) => {
                            let timeDiff = timeDiffrence(val, endDayValArr[index])
                            timeDiffrenceArr.push(timeDiff)
                        })

                        if (timeDiffrenceArr.length > 1) {
                            let minSum = ((timeDiffrenceArr[0][1] + timeDiffrenceArr[1][1]) / 60)
                            timeSum = minSum + timeDiffrenceArr[0][0] + timeDiffrenceArr[1][0];
                        } else {
                            timeSum = timeDiffrenceArr[0][0] + (timeDiffrenceArr[0][1] / 60)
                        }

                        if (timeSum < 3 && !popUpResponceObj['hr3'] && (currPopupType == null || currPopupType == 'hr3')) {
                            dayStringArr.push(daysName[i])
                            if (!currPopupType) currPopupType = 'hr3'
                        }

                        if (timeSum > 14 && !popUpResponceObj['hr14'] && (currPopupType == null || currPopupType == 'hr14')) {
                            dayStringArr.push(daysName[i])
                            if (!currPopupType) currPopupType = 'hr14'
                        }

                        let isBetween8pmAnd6am = false
                        dayValArr.map((e, i) => {
                            let valHrMinArr = e.split('0');
                            let tempTime = Number(valHrMinArr[0]) + (Number(valHrMinArr[1]) / 60)

                            if (tempTime >= 20 || tempTime <= 6) {
                                isBetween8pmAnd6am = true
                            }
                        })
                        if (isBetween8pmAnd6am && !popUpResponceObj['hr8pm_6am'] && (currPopupType == null || currPopupType == 'hr8pm_6am')) {
                            dayStringArr.push(daysName[i])
                            if (!currPopupType) currPopupType = 'hr8pm_6am'
                        }
                    }
                    if ((dayVal?.length == 0) && !popUpResponceObj['closed'] && (currPopupType == null || currPopupType == 'closed')) {
                        dayStringArr.push(daysName[i])
                        if (!currPopupType) currPopupType = 'closed'
                    }

                }
            })


            if (!currPopupType) {
                dayStringArr = []
                currypeVal.current = null
            }

            if (currPopupType) {
                currypeVal.current = currPopupType;
            }

            let dayString = dayStringArr.join(', ')
            dayString = replaceLastOccurrence(dayString, ", ", " and ")
            if (dayString.length) {
                let tempMsg = ''
                switch (currypeVal.current) {
                    case 'hr24':
                        tempMsg = `Your selected timings for ${dayString} is Open 24hrs.`
                        break;
                    case 'hr3':
                        tempMsg = `Your selected timings for ${dayString} is less than 3 hours.`
                        break;
                    case 'hr14':
                        tempMsg = `Your selected timings for ${dayString} is more than 14 hours.`
                        break;
                    case 'closed':
                        tempMsg = `Please confirm if the business is closed on ${dayString}.`
                        break;
                    case 'hr8pm_6am':
                        tempMsg = `Please confirm if the business starts at ${currStartTime || ''} on ${dayString}`
                        break;
                }
                if (!popUpResponceObj[currypeVal.current]) {
                    setPopupMsg(tempMsg);
                }
            }
            if (!currPopupType?.length) {
                playloadStartArr.map((e, i) => {
                    if (!e?.length) {
                        playloadStartArr[i] = 'Closed'
                    }
                })
                playloadEndArr.map((e, i) => {
                    if (!e?.length) {
                        playloadEndArr[i] = 'Closed'
                    }
                })

                let payloadStartString = '';
                let tempPayloadStartArr = playloadStartArr.map((e) => {
                    if (e == 'Open 24hrs') {
                        return '00:00';
                    } else {
                        return e;
                    }
                })
                payloadStartString = tempPayloadStartArr.join(',')

                let tempPlayloadEndArr = playloadEndArr.map((e, i) => {
                    if (playloadStartArr[i] == 'Open 24hrs') {
                        return '23:59';
                    } else {
                        return e;
                    }
                })

                let payloadEndString = '';
                payloadEndString = tempPlayloadEndArr.join(',')
                startTimeDataRef.current = payloadStartString;
                endTimeDataRef.current = payloadEndString;
                if (popUpResponceObj[currypeVal.current] || !currypeVal?.current?.length) {
                    currypeVal.current = ''
                    const contactProgress = StoreCommonInfo?.contactDetailProgress > 50 ? StoreCommonInfo?.contactDetailProgress : 50
                    dispatch(updateCommonValues({ key: "contactDetailProgress", value: contactProgress }))
                    InsertAPICall(payloadStartString, payloadEndString)
                }
            }


        } else {
            setLoader(false);
            setResponceMsg('Please fill all fields.')
        }
    }

    const handleDropDown = (type, index) => {
        switch (type) {
            case 'openAt':
                dropdown[index].openAt = !dropdown[index].openAt;
                dropdown[index].closeAt = false;
                subscribeEvents();
                break;

            case 'closeAt':
                // console.log(!timeSlotArr[index].filteredCloseAtDropDownOption?.length,timeSlotArr[index].filteredCloseAtDropDownOption);
                // if(!timeSlotArr[index]?.closeAtVal && !timeSlotArr[index].filteredCloseAtDropDownOption?.length){
                // 	timeSlotArr[index].filteredCloseAtDropDownOption = genrateOption('closeAt', 15)
                // }
                dropdown[index].openAt = false;;
                dropdown[index].closeAt = !dropdown[index].closeAt;
                subscribeEvents();
                break;
        }
        forceUpdate()
    }

    useEffect(() => {
        let trackingDataPayload = {
            source: source,
            clickType: 'load',
            IP: IP || "",
            trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
            mobile: StoreCommonInfo?.mobileNumber || "",
            docid: StoreCommonInfo?.docid || "",
            sessionId: sesionId || "",
            city: StoreCommonInfo.city || ""
        }
        if (!isDcFlow) {
            trackingDashboardAPI(trackingDataPayload, window.location.href || "");
        }
        clickTracker({
            sourceCode: source || "",
            docid: StoreCommonInfo?.docid || "",
            li: 'Business_Timing_PL',
            ll: 'NFL_LP',
        })
        if (firstRender.current) {
            if (timeSlotReduxData?.length == 0) { AddNewSlot(true) }
        }
    }, [])
    useEffect(() => {
        timeSlotArr.map((obj) => {
            obj.setTimeSlotArrData(timeSlotArr)
        })
    }, [timeSlotArr])
    useEffect(() => {
        if (popupMsg?.length) {
            document.body.classList.add('bodyfixed');
            setLoader(false)
        }
    }, [popupMsg?.length])

    // Function to extract time value from the "label" property
    function getTimeValue(label) {
        const time = label.split(' ')[0];
        const [hours, minutes] = time.split(':');
        const isPM = label.includes('PM');

        let hourValue = parseInt(hours, 10);
        if (isPM && hourValue !== 12) {
            hourValue += 12;
        } else if (!isPM && hourValue === 12) {
            hourValue = 0;
        }

        return hourValue * 60 + parseInt(minutes, 10);
    }

    function filteredOpenDropdownList(list, searchTerm) {
        let filteredList = list.filter(item => {
            searchTerm = (searchTerm.length === 1 && searchTerm !== '0') ? '0' + searchTerm : searchTerm
            return item.label.toLowerCase().startsWith(searchTerm.toLowerCase())
        }
        );

        // Sort the filteredList by the "label" property
        filteredList.sort((a, b) => {
            const timeA = getTimeValue(a.label);
            const timeB = getTimeValue(b.label);

            return timeA - timeB;
        });
        return filteredList
    }
    let isAnyDaySelected = timeSlotArr[0]?.selectedWeekValArr ? timeSlotArr[0]?.selectedWeekValArr.filter(data => data == true) : []
    async function handleSkip() {
        try {
            await logWorker("click", StoreCommonInfo?.docid || "")
        } catch (error) {
            console.log(error.message);
        }
        dispatch(updateTimmingArr({
            'timmingArr': timeSlotArr,
        }));
        router.push({
            pathname: "/dc/addcategories",
            query: router?.query || {},
        });
    }
    return (
        <>
            <div className="container__inner">
                <div className={`container__inner__left`}>
                    <div className='left__img' >
                        <Image
                            fill
                            src={'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/business_time_2x_new.png'}
                            alt={"left image."}
                        />
                    </div>
                </div>
                <div className={`container__inner__right`}>
                    <progress className={`${styles.progressbar}`} value={StoreCommonInfo?.contactDetailProgress > 50 ? StoreCommonInfo?.contactDetailProgress : 50} max="100" />
                    <div className={`form-wrapper`}>
                        <p className={`${styles.title} color111 fw600`}>Add business timings</p>
                        <p className={`${styles.content} color111`}>
                            {
                                isDcFlow ? "Set business hours so customers know when the business is available" :
                                    "Let your customers know when you are open for business"
                            }
                        </p>
                        <div className={`${styles.usines_heght}`}>
                            <div className={`form`}>
                                <>
                                    {
                                        timeSlotArr?.map((timeSlotArrData, timrContainerIndex) => {
                                            return (
                                                <div className={`${styles.week}`} key={`timrContainerIndex_${timrContainerIndex}`}>
                                                    <div>
                                                        <label className='color111 font14'>Select Days of the Week</label>
                                                        <div className={`${styles.week__block} mt-10 mb-10 `}>

                                                            <div className={`${styles.week__select}`}>
                                                                {
                                                                    timeSlotArrData?.selectedWeekValArr.map((data, index) => {
                                                                        return (
                                                                            <label key={index} className={`${styles.week__select__label}`}>
                                                                                <input autoComplete="off" id={'test'} type='checkbox' checked={data} />
                                                                                <span
                                                                                    onClick={() => {
                                                                                        timeSlotArrData.onWeekClick(index, timrContainerIndex);
                                                                                        forceUpdate()
                                                                                    }}
                                                                                    className='font12'
                                                                                >
                                                                                    {weekDays[index].label}
                                                                                </span>
                                                                            </label>
                                                                        )
                                                                    })
                                                                }
                                                            </div>

                                                            {!!timrContainerIndex ? (<button
                                                                onClick={() => { RemoveTimeSlot(timrContainerIndex) }}
                                                                className={`iconwrap ${styles.deleteicon} ripple`}
                                                            />) : null}
                                                            {timeSlotArrData?.isWeekErr ? <span className='error__message mt-5'>Please Select Working Days</span> : null}
                                                        </div>
                                                        {
                                                            timrContainerIndex <= 1 &&
                                                            <div>
                                                                <label className={`${styles.selectalldays} radio font0 color007 flex`}>
                                                                    <input type="checkbox" className={`m-0`} checked={timeSlotArrData.isSelectAllchecked}
                                                                        onChange={(e) => {
                                                                            timeSlotArrData.onSelectAll(e, timrContainerIndex);
                                                                            forceUpdate()
                                                                        }} />
                                                                    <span className={`uncheck ${styles.uncheck}`} />
                                                                    <span className={`ml-10 font13 fw500`}>Select All Days</span>
                                                                </label>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className={`flex mt-20`}>
                                                        <div className={`inputwrap ${timeSlotArrData?.isOpenAtErr ? 'inputwrap__error ' : ''} flex__inputwrap mb-5 mr-20`}>
                                                            <input
                                                                id='openAtInput'
                                                                onClick={() => { handleDropDown('openAt', timrContainerIndex) }}
                                                                autoComplete="off"
                                                                className='input'
                                                                type='tel'
                                                                placeholder='Select'
                                                                required
                                                                onChange={(e) => {
                                                                    let val = e?.target?.value || ''
                                                                    timeSlotArrData.openAtVal = val
                                                                    if (!val) {
                                                                        timeSlotArrData.filteredCloseAtDropDownOption = genrateOption('closeAt', 15)
                                                                    }
                                                                    timeSlotArrData.filteredOpenAtDropDownOption = filteredOpenDropdownList(
                                                                        timeSlotArrData.openAtDropDownOption,
                                                                        val
                                                                    )
                                                                    forceUpdate()
                                                                }}
                                                                value={timeSlotArrData.openAtVal}
                                                                ref={openAtInputRef}
                                                            />
                                                            <label className='input__label input__label__top'>Open at</label>
                                                            <span
                                                                id='openAtIcon'
                                                                onClick={() => { handleDropDown('openAt', timrContainerIndex) }}
                                                                className={`iconwrap selectarrow ${styles.selectarrow}`}
                                                            />

                                                            {dropdown[timrContainerIndex]?.openAt ?
                                                                <ul className={`dropdown color111 customscroll`}>
                                                                    {timeSlotArrData?.filteredOpenAtDropDownOption?.map((data, i) => {
                                                                        return (
                                                                            <li
                                                                                onClick={(event) => {
                                                                                    timeSlotArrData.onDropDownClick('openAt', event.target.innerHTML, timrContainerIndex)
                                                                                    forceUpdate()
                                                                                }}>
                                                                                {data.label}
                                                                            </li>
                                                                        )
                                                                    })}
                                                                </ul>
                                                                : null}
                                                            {timeSlotArrData?.isOpenAtErr ? <div id={`${styles.openat}`} className='error__message mt-5'>Please Enter Open Timing</div> : null}
                                                        </div>
                                                        <div className={`inputwrap ${timeSlotArrData?.isCloseAtErr ? 'inputwrap__error ' : ''} flex__none mb-5 ${timeSlotArrData.isCloseAthHiddien ? 'dn' : ''}`}>
                                                            <input
                                                                id='closeAtInput'
                                                                onClick={() => { handleDropDown('closeAt', timrContainerIndex) }}
                                                                autoComplete="off"
                                                                className='input'
                                                                type='tel'
                                                                placeholder='Select'
                                                                required
                                                                onChange={(e) => {
                                                                    let val = e?.target?.value || ''
                                                                    timeSlotArrData.closeAtVal = val
                                                                    timeSlotArrData.filteredCloseAtDropDownOption = filteredOpenDropdownList(
                                                                        timeSlotArrData.closeAtDropDownOption,
                                                                        val
                                                                    )
                                                                    forceUpdate()
                                                                }}
                                                                ref={closeAtInputRef}
                                                                value={timeSlotArrData.closeAtVal}
                                                            />
                                                            <label className='input__label input__label__top'>Close at</label>
                                                            <span
                                                                id='closeAtIcon'
                                                                onClick={() => { handleDropDown('closeAt', timrContainerIndex) }}
                                                                className={`iconwrap selectarrow ${styles.selectarrow}`}
                                                            />
                                                            {dropdown[timrContainerIndex]?.closeAt ?
                                                                <ul className={`dropdown  color111 customscroll`}>
                                                                    {timeSlotArrData?.filteredCloseAtDropDownOption?.map((data, i) => {
                                                                        return (
                                                                            <li
                                                                                onClick={(event) => {
                                                                                    timeSlotArrData.onDropDownClick('closeAt', event.target.innerHTML, timrContainerIndex)
                                                                                    forceUpdate()
                                                                                }}
                                                                            >
                                                                                {data.label}
                                                                            </li>
                                                                        )
                                                                    })}
                                                                </ul>
                                                                : null}
                                                            {timeSlotArrData?.isCloseAtErr ? <div id={`${styles.openat}`} className='error__message mt-5'>Please Enter Close Timing</div> : null}
                                                        </div>
                                                    </div>
                                                </div>

                                            )
                                        })
                                    }
                                </>

                                {timeSlotArr.length >= 4 ?
                                    null
                                    :
                                    (<button
                                        onClick={AddNewSlot}
                                        className={`transparentButton font13 mt-10`}
                                    >
                                        + Add Another Time Slot
                                    </button>)
                                }
                            </div>

                        </div>
                    </div>
                    {
                        isAnyDaySelected.length == 0 && isDcFlow ?
                            <button
                                className='primarybutton fw500 ripple mt-10'
                                onClick={handleSkip}  >
                                Skip
                            </button>
                            :
                            <>
                                {!isLoader ?
                                    <button
                                        className='primarybutton fw500 ripple mt-10'
                                        onClick={handleSubmit}
                                    >
                                        Save and Continue
                                    </button>
                                    :
                                    <button
                                        disabled
                                        className={`primarybutton mt-10`}
                                    >
                                        <span className='btn-loader' />
                                    </button>
                                }
                            </>
                    }
                    {/* {!isLoader ?
                        <button
                            className='primarybutton fw500 ripple mt-10'
                            onClick={handleSubmit}
                        >
                            Save and Continue
                        </button>
                        :
                        <button
                            disabled
                            className={`primarybutton mt-10`}
                        >
                            <span className='btn-loader' />
                        </button>
                    } */}
                </div>
                {ShowToast()}
            </div>
            {popupMsg?.length ?
                (<Popup
                    msg={popupMsg}
                    confirmAction={confirmAction}
                    closePopup={closePopup}
                    currentType={currypeVal.current}
                    setLoader={setLoader}
                />)
                :
                null}
        </>
    )

}

export default AddTimming;
