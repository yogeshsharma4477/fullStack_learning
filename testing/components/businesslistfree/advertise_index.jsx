import React from "react";
import styles from "./businesslistfree.module.scss";
import Image from 'next/image'
import { isValidMobileNumber } from "@/utils/validations";

import { useState } from "react";
import { useRouter } from "next/router";
import EnterMobileNumber from "../enterMobileNumber";
import Otppopup from "../otppopup";
import { useSelector } from "react-redux";

export default function Businesslistfree(props) { // This Landing Page
  const {mobile,setMobile ,error,checkMobileNum, city=""} = props

  
  const landingPageReduxData = useSelector((state) => {
    const {isShowOTP=false, moblieNumber=""} = state?.landinfPageSlice || {};
    return {
        isShowOTP, moblieNumber
    }
})

const {isShowOTP, moblieNumber} = landingPageReduxData;

    return(
        <div id={`listyourbusiness`} className={`${styles.businesslistfree} section`}>
            <div className={`${styles.businesslistfree__left}`}>
                <h2 className={`color111`}><img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/growtxt.svg" className={`${styles.growimg}`} /> Your Business</h2>
                <span className={`color111 fw500 ${styles.businesssubtxt1}`}>with India’s No. 1 Local Search Engine</span>
                <div className={`${styles.businesssubtxt}`}>Advertise on Justdial Today</div>
                <EnterMobileNumber styles={styles} city={city}/>
                {
                    isShowOTP?
                    <Otppopup
                        moblieNumber={moblieNumber} 
                        fromAd={true}
                    />:
                    null
                }
              
               {/* {error ?  <span className={`${styles.error__text}`}>Please Enter a Valid Mobile Number</span>: ""} */}
                <ul>
                    <li>Rank Ahead of Your Competition</li>
                    <li>Get Access to Ready to Buy Customer Instantly</li>
                    <li>Access to Leads & Competition Trends</li>
                </ul>
            </div>
            <div className={`${styles.businesslistfree__right}`}>
                <Image width={573} height={523} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/advertise_banner_1.png" alt="businesslistfree" />
            </div>
        </div>
    )
}