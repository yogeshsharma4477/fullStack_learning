import React, { useEffect, useRef, useState } from 'react'
// import styles from './common.module.scss'
import { isEmptyString } from '@/utils/commonFunc'

const DropDown = React.forwardRef((props)=>{
    const ref =useRef(null)
    const { option=[], inputLabel='', errMsg='' } = props                                 // options = [
                                                                                        // {key: 1, label: 'a1'},                   
    const dropDownIconRef = useRef(null)                                                // {key: 2, label: 'a2'},               
    const inputRef = useRef(null)                                                       // {key: 3, label: 'a3'}  
                                                                                        //]
    const handleSelect = (e)=>{                                                         //key should be unique and label is text that will be shown
        e.preventDefault()
        if(e.target.nodeName==='LI'){                                                   // if errrMSg empty no err is some string it will be shown as ee
            inputRef.current.value = e.target.textContent
            handleDropDownCLick()                                                       // inputLabel label on input tab
        }
    }

    const handleDropDownCLick = (e)=>{
        if(e) e.preventDefault()
        let a = ref.current.classList
        a = Array.from(a)
        if(a.includes('dn')) ref.current.classList.remove('dn')
        else ref.current.classList.add('dn')
    }

    const handleFocusClick = (e)=>{
        if(e) e.preventDefault()
        ref.current.classList.remove('dn')
    }

    const inputHandleBlurClick = (e)=>{
        if(e) e.preventDefault()
        ref.current.classList.remove('dn')
    }

    const handleBlurClick = (e)=>{
        if(e) e.preventDefault()
        if(document.activeElement.contains(inputRef.current) &&  inputRef.current.contains(e.target)) return
        // console.log("init", ref.current.contains(e.target))
       if(ref.current && !ref.current.contains(e.target) && !dropDownIconRef.current.contains(e.target)) ref.current.classList.add('dn')
    }
    
    const subscribe = ()=>{
        if(ref) ref.current.addEventListener('click', handleSelect)
    }
    
    const subscribeDropDownAction = ()=>{
        if(inputRef) inputRef.current.addEventListener('focus', handleFocusClick)
        if(inputRef) inputRef.current.addEventListener('blur', inputHandleBlurClick)
        if(dropDownIconRef) dropDownIconRef.current.addEventListener('click', handleDropDownCLick)
    }

    const unsubscribe = ()=>{
        if(inputRef) inputRef.current.removeEventListener('focus', handleFocusClick)
        if(inputRef) inputRef.current.removeEventListener('blur', inputHandleBlurClick)
        if(ref) ref.current.removeEventListener('click', handleSelect)
        if(dropDownIconRef) dropDownIconRef.current.removeEventListener('click', handleDropDownCLick)
    }

    useEffect(()=>{
        subscribe()
    },[])

    useEffect(()=>{
        subscribeDropDownAction()
        document.addEventListener('click', handleBlurClick)
        return unsubscribe
    },[])

    const renderError = (errMsg)=>{
        if(isEmptyString(errMsg)) return <div className='error__message mt-5'>{errMsg}</div>
        return null
    }
    
    let inputWrapperClass = 'inputwrap  mb-5 mr-5'

    return (
        <>
            <div className={inputWrapperClass}>
                    <input ref={inputRef} className='input' type='tel' placeholder='Select' required />
                    <label className='input__label input__label__top'>{inputLabel}</label>
                    <span ref={dropDownIconRef} className={`iconwrap selectarrow`} />
                    <ul ref={ref} className={`dropdown color111 `}>
                        {
                            option.map((data, i) => {
                                return (
                                    <li id={data.key} key={data.key}>{data.label}</li>
                                )
                            })
                        }
                    </ul>
                    {renderError(errMsg)}
            </div>
        </>
    )
})

export default DropDown