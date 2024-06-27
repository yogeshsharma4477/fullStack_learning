import React, { useEffect, useRef, useState, useReducer } from 'react'
import styles from './addtiming.module.scss'
import SelectDateWrapper from './SelectDateWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { updateTimmingArr } from '@/store/Slices/addTiimmingSlice'
import { useRouter } from 'next/router'
import axios from 'axios'
import clickTracker from '@/utils/clickTracker'
import { isNull, sanitizeParams } from '@/utils/commonFunc'
import Businesstiming from '@/components/businesstiming'

const genrateTimingOption = (minDiff) => {
    let optionArr = []
    let checkIsInLoop = true
    let hr = 12
    let min = 0
    let am_pm = 'AM'
    while (checkIsInLoop) {
        let optionValue = `${hr < 10 ? `0${hr}` : hr}:${min < 10 ? `0${min}` : min
            } ${am_pm}`
        if (
            optionValue === '12:00 AM' ||
            optionValue === '12:15 AM' ||
            optionValue === '12:30 AM'
        )
            optionValue += ' (Midnight)'
        if (
            optionValue === '12:00 PM' ||
            optionValue === '12:15 PM' ||
            optionValue === '12:30 PM'
        )
            optionValue += ' (Noon)'
        optionArr.push({ key: optionValue, label: optionValue })
        if (optionValue == `11:45 PM`) checkIsInLoop = false
        min += minDiff
        if (min == 60) {
            if (hr + 1 == 12) am_pm = 'PM'
            if (hr + 1 > 12) hr = 1
            else hr += 1
            min = 0
        }
    }
    return optionArr
}

export default function Addtiming({ IP }) {
    const daysName = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ]
    const router = useRouter()
    const dispatch = useDispatch()
    const timeArr = useSelector((state) => state?.TimmingList?.timmingArr || [])
    const compName = useSelector((state) => state.CommonValues.compName)
    const StoreCommonInfo = useSelector((state) => state.CommonValues)
    const city = useSelector((state) => state.Address.city)
    const StoreCommonValueInfo = useSelector((state) => state.CommonValues)
    const [loader, setLoader] = useState(false)
    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0)
    const [isConfirmationPopup, setIsConfirmationPopup] = useState(false)
    const popUpMsgTimeDiff = useRef('')
    const errCheckVariable = useRef(false)
    const [responceMsg, setResponceMsg] = useState('')
    const sourceCode = sanitizeParams(router?.query?.source)
    const [errArr, setErrArr] = useState([
        {
            openAt: false,
            closeAt: false,
            week: false,
        },
    ])
    const openAtOptions = genrateTimingOption(15)
    openAtOptions.unshift({
        key: 2,
        label: 'Closed',
    })
    openAtOptions.unshift({
        key: 1,
        label: 'Open 24hrs',
    })
    openAtOptions.push({
        key: openAtOptions.length,
        label: '12:00 AM (Midnight)',
    })

    const closeAtOptions = genrateTimingOption(15)
    closeAtOptions.push({
        key: closeAtOptions.length,
        label: '12:00 AM (Midnight)',
    })

    const [popUpAllowed, setPopUpAllowed] = useState({
        openAt: false,
        hrs_3: false,
        hrs_14: false,
    })

    const [timmingArr, seTimmingArr] = useState([
        {
            openAt: '',
            closeAt: '',
            weekArr: [0, 0, 0, 0, 0, 0, 0],
        },
    ])

    const setData = () => {
        if (timeArr.length) {
            seTimmingArr(timeArr)
            let tempErrArr = new Array(timeArr.length).fill({
                openAt: false,
                closeAt: false,
                week: false,
            })
            setErrArr(tempErrArr)
        }
    }

    useEffect(() => {
        setData()
    }, [])

    useEffect(() => {
        document.cookie = 'isFlow = false'
        setLoader(false)
    }, [])

    const [fetchValue, setFetchValue] = useState(false)

    const genrateTimeDataObj = () => {
        let tempObj = {
            openAt: '',
            closeAt: '',
            weekArr: [0, 0, 0, 0, 0, 0, 0],
        }
        return tempObj
    }

    function checkForEmptyData(data) {
        let isOkFlag = true
        let weekCheck = 'data.reduce((a,b) =>a+b,0)'
        if (!isOkFlag?.openAt || !isOkFlag?.closeAt || eval(weekCheck)) {
            isOkFlag = false
        }
        return isOkFlag
    }

    const AddNewTimingOption = (event) => {
        if (event) event.preventDefault()
        let isAllowed = true
        timmingArr.map((value, i) => {
            isAllowed ||= checkForEmptyData(value)
        })
        if (!isAllowed) {
            return
        }
        let tempObj = genrateTimeDataObj()
        seTimmingArr([...timmingArr, tempObj])
        setErrArr([
            ...errArr,
            {
                openAt: false,
                closeAt: false,
                week: false,
            },
        ])
    }

    //index remove
    const removeTimeOption = (event, index) => {
        if (event) event.preventDefault()

        let tempArrObj = timmingArr
        tempArrObj.splice(index, 1)
        seTimmingArr([...tempArrObj])

        let tempErrArrObj = errArr
        tempErrArrObj.splice(index, 1)
        setErrArr([...tempErrArrObj])
    }

    const resetFetchValue = () => {
        setFetchValue(false)
    }

    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ')

        let [hours, minutes] = time.split(':')

        if (hours === '12') {
            hours = '00'
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12
        }

        return `${hours}:${minutes}`
    }

    //ignore
    const callInsertAPI = async () => {
        let working_time_start = ''
        let working_time_end = ''
        let tempArrStart = new Array(7).fill('')
        let tempArrEnd = new Array(7).fill('')
        timmingArr.map((e, index) => {
            e.weekArr.map((data, i) => {
                if (!!data) {
                    if (tempArrStart[i]) {
                        if (
                            e.openAt === 'Open 24hrs' ||
                            tempArrStart[i] == 'Open'
                        )
                            tempArrStart[i] = 'Open'
                        else
                            tempArrStart[i] += `-${convertTime12to24(e.openAt)}`
                    } else {
                        if (e.openAt === 'Open 24hrs') tempArrStart[i] = 'Open'
                        else tempArrStart[i] += `${convertTime12to24(e.openAt)}`
                    }
                    if (tempArrEnd[i]) {
                        if (
                            e.openAt === 'Open 24hrs' ||
                            tempArrStart[i] == 'Open'
                        )
                            tempArrEnd[i] = 'Open'
                        else tempArrEnd[i] += `-${convertTime12to24(e.closeAt)}`
                    } else {
                        if (e.openAt === 'Open 24hrs') tempArrEnd[i] = 'Open'
                        else tempArrEnd[i] += `${convertTime12to24(e.closeAt)}`
                    }
                }
            })
        })
        tempArrStart.map((e, i) => {
            if (i !== 0) working_time_start += ','
            if (e) working_time_start += e
            else working_time_start += 'Closed'
        })

        tempArrEnd.map((e, i) => {
            if (i !== 0) working_time_end += ','
            if (e) working_time_end += e
            else working_time_end += 'Closed'
        })

        let payload = {
            working_time_start: working_time_start,
            working_time_end: working_time_end,
            companyname: compName,
            city: city,
            data_city: city,
            docid: StoreCommonInfo.docid,
            parentid: StoreCommonInfo.parentid,
            ucode: StoreCommonValueInfo.mobileNumber,
            source: sourceCode,
            uname: StoreCommonValueInfo.mobileNumber,
            creatorip: StoreCommonValueInfo.ip,
            IP: IP,
        }

        const response = await axios({
            method: 'post',
            url: '/api/v1/InsertAPI',
            data: payload,
        })
        if (response.data.success || true) {
            setLoader(false)
            document.cookie = 'isFlow = true'
            let query = router?.asPath || ''
            query = query.split('?')
            if (query.length) query = '?' + query[1]

            if (router.pathname.includes('dc')) {
                router.push({
                    pathname: "/dc/addcategory",
                    query: router?.query || {},
                });
            } else {
                router.push({
                    pathname: "/addcategory",
                    query: router?.query || {},
                });
            }
        }
    }

    const warningPopUpConfirm = () => {
        switch (type) {
        }
        popUpAllowed.openAt = true
        setToRedux()
    }

    //ignore
    const setToRedux = () => {
        console.log('here', errCheckVariable.current)
        if (errCheckVariable.current) return
        console.log(popUpAllowed)
        // setLoader(true)
        // dispatch(updateTimmingArr({ key: "timmingArr", value: timmingArr }));
        // callInsertAPI()
    }

    function overlapCheck(t1 = null, t2 = null) {
        try {
            if (isNull(t1) || isNull(t2)) return null
            let isOverlap = false
            t1 = convertTime12to24(t1)
            let t1_Arr = t1.split(':')
            t2 = convertTime12to24(t2)
            let t2_Arr = t2.split(':')
            if (parseInt(t1_Arr[0]) > parseInt(t2_Arr[0])) isOverlap = true
            else if (parseInt(t1_Arr[0]) == parseInt(t2_Arr[0])) {
                if (parseInt(t1_Arr[1]) > parseInt(t2_Arr[1])) isOverlap = true
            }
            return isOverlap
        } catch (err) {
            console.error('error=> ', err)
            return null
        }
    }

    // two time difference only in 24 hour format
    function diffTime(time1, time2) {
        var hour1 = time1.split(':')[0]
        var hour2 = time2.split(':')[0]
        var min1 = time1.split(':')[1]
        var min2 = time2.split(':')[1]

        var diff_hour = hour2 - hour1
        var diff_min = min2 - min1
        if (diff_hour < 0) {
            diff_hour += 24
        }
        if (diff_min < 0) {
            diff_min += 60
            diff_hour--
        } else if (diff_min >= 60) {
            diff_min -= 60
            diff_hour++
        }
        return [diff_hour, diff_min]
    }

    const validation = () => {
        let errArr = []
        let check = false
        let showPopup = false

        timmingArr.map((e, index) => {
            let errObj = {
                openAt: false,
                closeAt: false,
                week: false,
                isOverlapInside: false,
                isOverlap: false,
                lessThanThreeHrs: false,
            }
            if (e.openAt.length === 0) errObj.openAt = true
            if (
                e.closeAt.length === 0 &&
                (e.openAt != 'Open 24hrs' || e.openAt != 'Closed')
            )
                errObj.closeAt = true
            if (e.openAt != 'Open 24hrs' && e.openAt != 'Closed') {
                console.log('inside')
                errObj.isOverlapInside = overlapCheck(e.openAt, e.closeAt)
                if (!!e.closeAt?.length && !!e.openAt?.length) {
                    let openAt24Format = convertTime12to24(e.openAt)
                    let closeAt24Format = convertTime12to24(e.closeAt)
                    let timeDiff = diffTime(openAt24Format, closeAt24Format)

                    let count = 0
                    let selectedDays = ''
                    e.weekArr.map((day, i) => {
                        if (!!day) {
                            count += 1
                            selectedDays += `${daysName[i]}, `
                        }
                    })
                    let lastIndexOfComma = selectedDays.lastIndexOf(',')
                    selectedDays =
                        selectedDays.slice(0, lastIndexOfComma) +
                        '' +
                        selectedDays.slice(lastIndexOfComma + 1)
                    if (count > 1) {
                        let lastIndexOfComma = selectedDays.lastIndexOf(',')
                        selectedDays =
                            selectedDays.slice(0, lastIndexOfComma) +
                            ' and' +
                            selectedDays.slice(lastIndexOfComma + 1)
                    }

                    if (timeDiff[0] < 3 || timeDiff[0] > 14) {
                        errObj.lessThanThreeHrs = true
                        if (!isConfirmationPopup) {
                            showPopup = true
                        }
                        if (timeDiff[0] > 14) {
                            popUpMsgTimeDiff.current = `You select timings for ${selectedDays}is more than 14 hours.`
                        } else {
                            popUpMsgTimeDiff.current = `You selected timings for ${selectedDays}is less than 3 hours.`
                            forceUpdate()
                        }
                    }

                    let openAtArr = e.openAt.split(':')
                    let closeAtArr = e.closeAt.split(':')

                    let checkFor8amTo6pm = ''

                    // checkFor8amTo6pm += `${openAtArr[0]} > 20 && ${closeAtArr[0]} < 6`

                    // if (eval(checkFor8amTo6pm)) {
                    // if (checkFor8amTo6pm) {
                    //   popUpMsgTimeDiff.current = `Please confirm if the business starts at ${e.openAt} on ${selectedDays}.`
                    // }
                }
                if (e.openAt) errObj.lessThanThreeHrs = true
                if (errObj.isOverlapInside) check ||= true
            } else {
                //---------------------------------------------------------------------------------------------------------
                //show popup
                if (!popUpAllowed.openAt) {
                    let count = 0
                    let selectedDays = ''
                    e.weekArr.map((day, i) => {
                        if (!!day) {
                            count += 1
                            selectedDays += `${daysName[i]}, `
                        }
                    })
                    let lastIndexOfComma = selectedDays.lastIndexOf(',')
                    selectedDays =
                        selectedDays.slice(0, lastIndexOfComma) +
                        '' +
                        selectedDays.slice(lastIndexOfComma + 1)
                    if (count > 1) {
                        let lastIndexOfComma = selectedDays.lastIndexOf(',')
                        selectedDays =
                            selectedDays.slice(0, lastIndexOfComma) +
                            ' and' +
                            selectedDays.slice(lastIndexOfComma + 1)
                    }
                    popUpMsgTimeDiff.current = `You select timings for ${selectedDays}is Open 24hrs.`
                    if (!isConfirmationPopup) {
                        showPopup = true
                    }
                    forceUpdate()
                }
                //---------------------------------------------------------------------------------------------------------
            }

            let weekSum = e.weekArr.reduce(function (a, b) {
                return a + b
            }, 0)
            errObj.week = weekSum == 0
            if (errObj.openAt || errObj.week) check ||= true
            if (errObj.openAt !== 'Open 24hrs') {
                if (errObj.closeAt) check ||= true
            }
            errArr.push(errObj)
        })

        if (!check) {
            let timmingArrLength = timmingArr.length
            while (timmingArrLength > 0) {
                timmingArrLength -= 1
                let i = timmingArrLength
                let currOpenAt = timmingArr[i].openAt
                let k = timmingArrLength

                while (k > 0) {
                    let checkForOverLap = false
                    k -= 1
                    timmingArr[k].weekArr.map((data, index) => {
                        if (!!timmingArr[i].weekArr[index] && !!data) {
                            checkForOverLap = true
                        }
                    })
                    if (checkForOverLap) {
                        let innerCurrCloseAt = timmingArr[k].closeAt
                        errArr[i].isOverlap = overlapCheck(
                            innerCurrCloseAt,
                            currOpenAt
                        )
                        if (errArr[i].isOverlap) check ||= true
                    }
                }
            }
        }
        // setErrArr(errArr)
        // errCheckVariable.current = false //check;
        // if (showPopup) { setIsConfirmationPopup(true); check ||= true }
        // return check;
    }

    const saveAndContinue = (event) => {
        event.preventDefault()
        //click tracker implementaion

        const sourceCode = sanitizeParams(router?.query?.source)
        clickTracker({
            sourceCode: sourceCode,
            docid: StoreCommonInfo?.docid,
            li: 'FL_AddTiming',
            ll: 'FL_Timing',
        })

        setLoader(true)
        let isAnyErr = validation()
        if (isAnyErr) {
            setLoader(false)
        } else {
            setToRedux()
            errCheckVariable.current = false
        }
    }

    const updateData = (key, data, index = null) => {
        if (!timmingArr.length) return
        if (key == 'weekArr') {
            if (Object.is(index, null)) {
                let tempArr = [...timmingArr]
                data.map((e, i) => {
                    tempArr[i].weekArr = e
                })
                seTimmingArr([...tempArr])
            } else {
                let tempArr = [...timmingArr]
                tempArr[index] = { ...timmingArr[index], ...{ weekArr: data } }
                seTimmingArr([...tempArr])
            }
        }
        if (key == 'openAt') {
            let tempArr = [...timmingArr]
            tempArr[index] = { ...timmingArr[index], ...{ openAt: data } }
            seTimmingArr([...tempArr])
        }
        if (key == 'closeAt') {
            let tempArr = [...timmingArr]
            tempArr[index] = { ...timmingArr[index], ...{ closeAt: data } }
            seTimmingArr([...tempArr])
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
            <div className="container__inner">
                {isConfirmationPopup && (
                    <Businesstiming
                        msg={popUpMsgTimeDiff.current}
                        setToRedux={warningPopUpConfirm}
                        closePopup={() => {
                            setIsConfirmationPopup(false)
                        }}
                    />
                )}
                <div className={`container__inner__left`}>
                    <div className={`left__img ${styles.left__img}`} />
                </div>
                <div className={`container__inner__right`}>
                    <progress
                        className={`${styles.progressbar}`}
                        value="50"
                        max="100"
                    />
                    <p className={`${styles.title} color111 fw600`}>
                        Add business timings
                    </p>
                    <p className={`${styles.content} color111`}>
                        Let your customers know when you are open for business
                    </p>
                    <div className={`form`}>
                        <>
                            {timmingArr.map((data, index, self) => {
                                return (
                                    <SelectDateWrapper
                                        setResponceMsg={(msg) => {
                                            setResponceMsg(msg)
                                        }}
                                        key={`a${index}`}
                                        errArr={errArr[index]}
                                        id={index}
                                        openAtOptions={openAtOptions}
                                        closeAtOptions={closeAtOptions}
                                        data={data}
                                        timmingArr={timmingArr}
                                        isDelete={index != 0}
                                        removeTimeOption={(event) => {
                                            removeTimeOption(event, index)
                                        }}
                                        fetchValue={fetchValue}
                                        selectedValue={(data) => {
                                            seTimmingArr([...timmingArr, data])
                                        }}
                                        resetFetchValue={resetFetchValue}
                                        updateData={updateData}
                                    />
                                )
                            })}
                        </>
                        {timmingArr.length < 4 ? (
                            <button aria-label="Add Another Time Slot"
                                onClick={AddNewTimingOption}
                                className={`transparentButton font13 mt-10`}
                            >
                                + Add Another Time Slot{' '}
                            </button>
                        ) : null}
                        {!loader ? (
                            <button aria-label="Save and Continue"
                                className="primarybutton fw500 ripple mt-10"
                                onClick={saveAndContinue}
                            >
                                {'Save and Continue'}
                            </button>
                        ) : (
                            <button aria-label="Button Loader" className={`primarybutton mt-10`}>
                                <span className="btn-loader" />
                            </button>
                        )}
                    </div>
                </div>
                {showToast()}
            </div>
        </>
    )
}
// {
//   timmingArr.length < 4 ? (
//     <button onClick={AddNewTimingOption} className={`transparentButton font13 mt-10`} >+ Add Another Time Slot </button>
//   ) :
//   null
// }
// {
//   !loader ?
//   <button className='primarybutton fw500 ripple mt-10' onClick={saveAndContinue}>{'Save and Continue'}</button>
//   :
//   <button className={`primarybutton mt-10`}><span className='btn-loader' /></button>
// }

//           </div >
//         </div >
//   { showToast() }
//       </div >
//     </>
//   );
// }
