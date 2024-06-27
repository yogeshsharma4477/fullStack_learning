import React, { useEffect, useState } from "react";
import styles from "./businesslistfree.module.scss";
import Image from 'next/image'
import EnterMobileNumber from "../enterMobileNumber";


function doNothing(e, functionName) {
    e.preventDefault();
    console.error(`${functionName} not found`)
}
export default function Businesslistfree(props) {

    return(
        <div id={`listyourbusiness`} className={`${styles.businesslistfree} section`}>
            <div className={`${styles.businesslistfree__left}`}>
                <h1 className={`color111`}>List Your Business <span className={`color007`}>for FREE</span></h1>
                <span className={`color111 fw500 ${styles.businesssubtxt1}`}>with India’s No. 1 Local Search Engine</span>
                <EnterMobileNumber 
                city={props?.city}
                    styles={styles}
                />
                <ul>
                    <li>Get Discovered and Create Your Online Business</li>
                    <li>Respond to Customer Reviews and Questions</li>
                    <li>Showcase Your Product and Service Offerings</li>
                </ul>
            </div>
            <div className={`${styles.businesslistfree__right}`}>
                <Image width={573} height={523} src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/man@2x.png" alt="businesslistfree" />
            </div>
        </div>
    )
}