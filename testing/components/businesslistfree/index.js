import React, { useEffect, useReducer, useState } from "react";
import styles from "./businesslistfree.module.scss";
import Image from 'next/image'
import EnterMobileNumber from "../enterMobileNumber";
import { useRouter } from "next/router";
import TermsPrivacyInfringement from "../termsPrivacyInfringement";
import { sanitizeParams } from "@/utils/commonFunc";


function doNothing(e, functionName) {
    e.preventDefault();
    console.error(`${functionName} not found`)
}

export default function Businesslistfree(props) {
    const { city="", LoggedInMobileNumber } = props;
    const router = useRouter();

    function fetchRedirectionUrl(type) {
        let sourceCode = sanitizeParams(router?.query?.source) || '7';
        let url = ""
        switch (type) {
            case 'terms':
                url = sourceCode == '7' ? 'https://www.justdial.com/Terms-of-Use' : 'https://www.justdial.com/mobileTC?wap=2';
                break;
            case 'privacy':
                url = sourceCode == '7' ? 'https://www.justdial.com/Privacy-Policy' : 'https://www.justdial.com/mobileTC?wap=2#Privacy-Policy';
                break;
            case 'infrigment':
                url = sourceCode == '7' ? 'https://www.justdial.com/Infringement-Policy' : 'https://www.justdial.com/mobileTC?wap=2#infringement';
                break;
        }
        return url;
    }


    function handleRedirectScroll(id) {
        let element = document.getElementById(id)
        if (element) {
            let topHeight = element.offsetTop - 120
            if (id === "businessliststepid") topHeight -= 20
            window.scroll({
                top: id === 'listyourbusiness' ? 0 : topHeight + 50,
                behavior: 'smooth',
            })
        }
    }

    const TERMS_REDIRECTION_LINK = fetchRedirectionUrl('terms');
    const PRIVACY_REDIRECTION_LINK = fetchRedirectionUrl('privacy');
    const INFRIGMENT_REDIRECTION_LINK = fetchRedirectionUrl('infrigment');

    return (
        <div id={`listyourbusiness`} className={`${styles.businesslistfree} section`}>
            <div className={`${styles.businesslistfree__left}`}>
                <h1 className={`color111`}>List Your Business <span className={`color007`}>for FREE</span></h1>
                <span className={`color111 fw500 ${styles.businesssubtxt1}`}>with India’s No. 1 Local Search Engine</span>
                <EnterMobileNumber 
                    styles={styles}
                    city={city}
                    index={1}
                    LoggedInMobileNumber={LoggedInMobileNumber}
                />
                <ul>
                    <li>Get Discovered and Create Your Online Business</li>
                    <li>Respond to Customer Reviews and Questions</li>
                    <li>Showcase Your Product and Service Offerings</li>
                </ul>
                <TermsPrivacyInfringement StyleProperty={styles.businesslistfree_note} />
            </div>
            <div className={`${styles.businesslistfree__right}`}>
                <Image priority={true} loading="eager" width={573} height={523} src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/man_new_2x.png" alt="Business List Free" title="Business List Free" />
                <span className={`${styles.value} ${styles.buyers}`}>
                    17.1 Crore+ <br />Buyers*
                </span>
                <span className={`${styles.value} ${styles.business}`}>
                    3.8 Crore+ <br /> Businesses <br /> Listed
                </span>
                <span className={`${styles.value} ${styles.happycustomer}`}>
                    5.4 Lakh+ <br /> Happy <br /> Customers
                </span>
            </div>
        </div>
    )
}
