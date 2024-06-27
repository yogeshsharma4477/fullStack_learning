import React from "react";
import styles from "./createfreeaccount.module.scss";
import Image from 'next/image'
import EnterMobileNumber from "../enterMobileNumber";
import Otppopup from "../otppopup";
import { useSelector } from "react-redux";
// import { useState } from "react";

export default function Createfreeaccount({city=""}) {


    const landingPageReduxData = useSelector((state) => {
        const {isShowOTP=false, moblieNumber=""} = state?.landinfPageSlice || {};
        return {
            isShowOTP, moblieNumber
        }
    })
    
    const {isShowOTP, moblieNumber} = landingPageReduxData;    
    


    return(
        <div className={`section`}>
            <div className={`${styles.createfreeaccount}`}>
                <div className={`${styles.createfreeaccount__left}`}>
                    <h2 className={`color1a1`}><span className={`color007`}>GROW</span> Your Business</h2>
                    <span className={`color1a1`}>on Justdial - India's No. 1 Local Search Engine</span>
                    <div className={`${styles.createfreeaccount_subtxt}`}>Advertise on Justdial Today</div>
                    <EnterMobileNumber styles={styles} city={city} />
                    {
                    isShowOTP?
                    <Otppopup
                        moblieNumber={moblieNumber} 
                        fromAd={true}
                    />:
                    null
                }
                    
                    <span className={`${styles.error__text}`}>Please Enter a Valid Mobile Number</span>
                </div>
                <div className={`${styles.createfreeaccount__right}`}>
                    <Image width={370} height={197} src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/list.svg" alt="create free account" />
                </div>
            </div>
        </div>
    )
}