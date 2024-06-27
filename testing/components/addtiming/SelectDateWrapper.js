import React, { useEffect, useRef, useState } from "react";
import styles from './addtiming.module.scss'
import { useDispatch } from "react-redux";


const SelectDateWrapper = ({ openAtOptions, closeAtOptions, data, fetchValue, isDelete, removeTimeOption, id, resetFetchValue, updateData, timmingArr, errArr, openPopup, setResponceMsg }) => {
    const { openAt, closeAt, weekArr } = data;
    const openAtInputRef = useRef(null)
    const openAtDropDownIconRef = useRef(null)
    const openAtDropDownRef = useRef(null)

    const closeAtInputRef = useRef(null)
    const closeAtDropDownIconRef = useRef(null)
    const closeAtDropDownRef = useRef(null)
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const [isDropDownClose, setIsDropDownClose] = useState(false)
    const [closeDisabled, setCloseDisabled] = useState(false)
    const shouldCheck = useRef(false)
    const dispatch = useDispatch


    const weekDays = [
        { key: 'Mon', label: 'Mon' },
        { key: 'Tue', label: 'Tue' },
        { key: 'Wed', label: 'Wed' },
        { key: 'Thu', label: 'Thu' },
        { key: 'Fri', label: 'Fri' },
        { key: 'Sat', label: 'Sat' },
        { key: 'Sun', label: 'Sun' }
    ]

    // console.log(openAtInputRef.current.value, "===="); open at value
    // console.log(closeAtInputRef.current.value)

    useEffect(() => {
        if (fetchValue) {
            shouldCheck.current = true
            resetFetchValue()
        }
    })

    useEffect(() => {
        subscribe()
        setData()

        return unsubscribe
    }, [])


    useEffect(() => {
        setData()
    }, [updateData])


    const documentClickHandling = (e) => {
        let targetElement = e?.target || null;
        if (Object.is(targetElement, null)) return;
        let currentNodeType = targetElement || null;
        if (Object.is(currentNodeType)) return
        if (['INPUT', 'SPAN'].includes(e.target.nodeName)) {
        }
        else {
            hideOpenDropdown(e)
            hideCloseDropdown(e)
        }
    }

    const subscribe = () => {
        if (document) {
            document.addEventListener('click', documentClickHandling)
        }
    }

    const unsubscribe = () => {
        if (document) {
            document.removeEventListener('click', documentClickHandling)
        }
    }

    const setData = () => {
        openAtInputRef.current.value = openAt;
        closeAtInputRef.current.value = closeAt;
        weekArr.map((value, index) => {
            let el = document.getElementById(`week_${index}_${id}`)
            if (el) el.checked = !!value;
        })
    }

    const openTimeDropDownSelect = (e) => {
        openAtInputRef.current.value = e.target.innerText;
        if (openAtInputRef.current.value === 'Open 24hrs' || openAtInputRef.current.value === 'Closed') {
            updateData('closeAt', '', id)
            closeAtInputRef.current.value = ''
            setCloseDisabled(true)
        }
        else setCloseDisabled(false)
        updateData('openAt', openAtInputRef.current.value, id)
        hideOpenDropdown(e)
    }

    const closeTimeDropDownSelect = (e) => {
        closeAtInputRef.current.value = e.target.innerText;
        updateData('closeAt', closeAtInputRef.current.value, id)
        hideCloseDropdown(e)
    }

    //4th point
    const setDataInParent = (e) => {
        let currElIndex = e.target?.getAttribute('id');
        let ArrCurrElIndex = currElIndex?.split('_')
        let goFurther = true;
        let specialSelection = '';
        let closedCount = 0;
        timmingArr.map((val, index) => {
            if (val.openAt === 'Closed') closedCount += 1;
            if (Number(ArrCurrElIndex[2]) != index) {
                if (val.openAt == 'Open 24hrs' || val.openAt == 'Closed') {
                    if (!timmingArr[Number(ArrCurrElIndex[2])].weekArr[Number(ArrCurrElIndex[1])]) {
                        if (!!val.weekArr[Number(ArrCurrElIndex[1])]) {
                            e.preventDefault();
                            goFurther = false;
                            specialSelection = val.openAt
                            return;
                        }
                    }
                }
            }
        })
        const daysName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        if (!goFurther) {
            setResponceMsg(`${daysName[Number([ArrCurrElIndex[1]])]} Cannot be Selected as it is Marked as ${specialSelection}.`)
        }
        if (goFurther) {
            let currOpenAtVal = timmingArr[Number(ArrCurrElIndex[2])].openAt;
            if (['Open 24hrs', 'Closed'].includes(currOpenAtVal)) {
                let el = document.getElementById(`week_${Number(ArrCurrElIndex[1])}_${Number(ArrCurrElIndex[2])}`);
                let tempArr = []
                timmingArr.map((val, index) => {
                    let currWeekArr = val.weekArr || null;
                    if (currWeekArr) {
                        if (index === Number(ArrCurrElIndex[2])) {
                            currWeekArr[Number(ArrCurrElIndex[1])] = el.checked ? 1 : 0
                        } else {
                            currWeekArr[Number(ArrCurrElIndex[1])] = 0
                        }
                        tempArr.push(currWeekArr)
                    }
                })
                updateData('weekArr', tempArr)
            } else {
                let checkedCount = 0;
                timmingArr.map((eVal, index) => {
                    if (index != ArrCurrElIndex[2]) {
                        if (!!eVal.weekArr[ArrCurrElIndex[1]]) checkedCount += 1
                    }
                })
                if (checkedCount >= 2) {
                    e.preventDefault();
                    checkedCount = 0
                    setResponceMsg(`${daysName[Number([ArrCurrElIndex[1]])]} Cannot be Selected in More than 2 Time Slots.`)
                    return;
                }
                let Array = [0, 0, 0, 0, 0, 0, 0]
                Array.map((value, index) => {
                    let el = document.getElementById(`week_${index}_${id}`)
                    if (el) Array[index] = el.checked ? 1 : 0
                })
                updateData('weekArr', Array, id)
            }
        }
        hideCloseDropdown()
        hideOpenDropdown()
    }

    const showOpenDropdown = (e) => {
        if (e) e.preventDefault(e)
        hideCloseDropdown(e)
        setIsDropDownOpen(true)
    }

    const hideOpenDropdown = (e) => {
        if (e) e.preventDefault()
        setIsDropDownOpen(false)
    }

    const toggleOpenDropdown = (e) => {
        e.preventDefault()
        if (isDropDownOpen) hideOpenDropdown(e)
        else showOpenDropdown(e)
    }

    const showCloseDropdown = (e) => {
        hideOpenDropdown(e)
        if (['Open 24hrs', 'Closed'].includes(openAtInputRef.current.value)) return
        setIsDropDownClose(true)
    }

    const hideCloseDropdown = (e) => {
        setIsDropDownClose(false)
    }

    const toggleCloseDropdown = (e) => {
        hideOpenDropdown(e)
        if (['Open 24hrs', 'Closed'].includes(openAtInputRef.current.value)) return
        if (isDropDownClose) hideCloseDropdown(e)
        else showCloseDropdown(e)
    }

    const renderErrorMsg = (FieldType) => {

        switch (FieldType) {
            case 'openAt':
                if (errArr.openAt) return <div id={`${styles.openat}`} className='error__message mt-5'>Please Enter Open Timing</div>
                return null
            case 'closeAt':
                if (errArr.closeAt) return <div id={`${styles.openat}`} className='error__message mt-5'>Please Enter Close Timing</div>
                return null
            case 'weekDays':
                if (errArr.week) return <span className='error__message mt-5'>Please Select Working Days</span>
                return null
            case 'checkOverlap':
                if (errArr.isOverlapInside || errArr.isOverlap) return <span id={`${styles.openat}`} className='error__message mt-5'>Time Is Overlaping</span>
            default:
                return null;
        }
    }

    return (
        <div className={`${styles.week}`}>
            <div>
                <label className='color111 font14'>Select Days of the Week</label>
                <div className={`${styles.week__block} mt-10 mb-20 ${errArr.week ? 'inputwrap__error' : ''}`}>

                    <div className={`${styles.week__select}`}>
                        {
                            weekDays.map((data, index) => {
                                return (
                                    <label role="button" tabIndex="0" aria-label={data.label} key={index} className={`${styles.week__select__label}`}>
                                        <input onClick={setDataInParent} id={`week_${index}_${id}`} autoComplete="off" type='checkbox' />
                                        <span className='font12'>{data.label}</span>
                                    </label>
                                )
                            })
                        }
                    </div>

                    {isDelete ? <button aria-label="Delete Week" onClick={(e, index) => { removeTimeOption(e, index) }} className={`iconwrap ${styles.deleteicon} ripple`} /> : null}
                    {renderErrorMsg('weekDays')}
                </div>
            </div>
            <div className={`flex mt-20`}>

                {/*--------------------------- openAt dropdown -------------------------------------------*/}
                <div className={`inputwrap flex__none ${errArr.openAt || errArr.isOverlapInside || errArr.isOverlap ? 'inputwrap__error' : ''} mb-5 mr-5`}>
                    <input title="Open Time" id={`openAt_${id}`} autoComplete="off" onChange={(e) => { e.preventDefault(); openAtInputRef.current.value = '' }} onClick={showOpenDropdown} ref={openAtInputRef} className='input' type='tel' placeholder='Select' required />
                    <label className='input__label input__label__top'>Open at</label>
                    <span ref={openAtDropDownIconRef} onClick={toggleOpenDropdown} className={`iconwrap selectarrow ${styles.selectarrow}`} />

                    {/*--------------------------------options-----------------------------*/}
                    {isDropDownOpen ? <ul ref={openAtDropDownRef} className={`dropdown color111 customscroll`}>
                        {openAtOptions.map((data, i) => {
                            return (
                                <li role="button" taxIndex="0" aria-label={data.label} onClick={openTimeDropDownSelect} id={data.key} key={data.key}>{data.label}</li>
                            )
                        })}
                    </ul> : null}

                    {/*----------------------------options---------------------------------*/}
                    {renderErrorMsg('openAt')}
                    {renderErrorMsg('checkOverlap')}
                </div>
                {/* ------------------------------------------------------------------------------------- */}
                {/*--------------------------- closeAt dropdown -------------------------------------------*/}
                <div className={`inputwrap ${errArr.closeAt || errArr.isOverlapInside || errArr.isOverlap ? 'inputwrap__error' : ''} mb-5 mr-5 ${(['Open 24hrs', 'Closed'].includes(openAtInputRef?.current?.value) || ['Open 24hrs', 'Closed'].includes(timmingArr[id].openAt))? 'dn' : ''}`}>
                    <input title="Close Time" autoComplete="off" id={`closeAt_${id}`} onChange={(e) => { e.preventDefault(); closeAtInputRef.current.value = '' }} onClick={showCloseDropdown} disabled={closeDisabled} ref={closeAtInputRef} className='input' type='tel' placeholder='Select' required />
                    <label className='input__label input__label__top'>Close at</label>
                    <span ref={closeAtDropDownIconRef} onClick={toggleCloseDropdown} className={`iconwrap selectarrow ${styles.selectarrow}`} />

                    {/*--------------------------------options-----------------------------*/}
                    {isDropDownClose ? <ul ref={closeAtDropDownRef} className={`dropdown  color111 customscroll`}>
                        {closeAtOptions.map((data, i) => {
                            return (
                                <li role="button" taxIndex="0" aria-label={data.label} onClick={closeTimeDropDownSelect} id={data.key} key={data.key}>{data.label}</li>
                            )
                        })}
                    </ul> : null}

                    {/*----------------------------options---------------------------------*/}
                    {renderErrorMsg('closeAt')}
                    {renderErrorMsg('checkOverlap')}
                    {/* ------------------------------------------------------------------------------------- */}

                </div>

            </div>
        </div>
    )
}

export default SelectDateWrapper;