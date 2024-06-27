import React from "react";
import styles from "./growbusiness.module.scss";
import Image from "next/image";
import EnterMobileNumber from "../enterMobileNumber";
import { useRouter } from "next/router";
import { clickTracker } from "@/utils/commonFunc";
import TermsPrivacyInfringement from "../termsPrivacyInfringement";

// import { useState } from "react";

export default function Growbusiness(props) {

   const { LoggedInMobileNumber=null, city="" } = props;
 const router = useRouter();
let sourceCode =router?.query?.source || null;
 const ClickTrackerCall = (li, ll) => {
    if (sourceCode == null) {
        let device_userAgent = navigator.userAgent;
        if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        device_userAgent
        )
        ) {
        sourceCode = "2";
        } else {
        sourceCode = "7";
        }
    }
    clickTracker({
        sourceCode: sourceCode,
        li: li,
        ll: ll,
    });
    };
 return (
  <div className={`${styles.growbusiness} section`}>
   <h2 className={`color1a1`}>
    Connect with New Customers & Grow Your Business
   </h2>
   <div className={`${styles.listpage} ${styles.pb80}`}>
    <div className={`${styles.listpage__left}`}>
     <Image
      width={520}
      height={517}
      src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/freebusinesslisting@2x.png"
      alt="Free Business Listing"
      title="Free Business Listing"
     />
    </div>
    <div className={`${styles.listpage__right}`}>
     <b>FREE BUSINESS LISTING PAGE</b>
     <p className={`color111`}>
      Having a presence on Justdial helps you build trust with your potential
      customers
     </p>
     <ul>
      <li>
       Enrich your business details so that people can find you online easily
      </li>
      <li>
       Increase customer engagement by responding to their reviews and questions
      </li>
      <li>Upload photos and videos to showcase your business online</li>
     </ul>
     <b>Register Your Business Today</b>
     <EnterMobileNumber styles={styles} isFlag={true} index={2} LoggedInMobileNumber={LoggedInMobileNumber} page="landing" city={city}/>
     <TermsPrivacyInfringement StyleProperty={styles.growbusiness_note}/> 
    </div>
   </div>
   <div className={`${styles.listpage}`}>
    <div className={`${styles.listpage__left}`}>
     <Image
      width={520}
      height={517}
      src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/justdialads@2x.png"
      alt="Justdial Ads"
      title="Justdial Ads"
     />
    </div>
    <div className={`${styles.listpage__right}`}>
     <b>JUSTDIAL ADS</b>
     <p className={`color111`}>
      Get prominent display over your competitors and reach out to more
      customers.
     </p>
     <ul>
      <li>
       Rank higher in search and get more exposure in front of your potential
       customers.
      </li>
      <li>Get customer details over SMS, email and push notification</li>
      <li>Get full access to competition trends and analytics dashboard</li>
     </ul>
     <button aria-label="Advertise Now"
      className={`primarybutton animationstop ${styles.primarybutton}`}
      onClick={() => {
        ClickTrackerCall('nfl_advertise', 'NFL_LP')
        let url = "https://www.justdial.com/Advertise"
        if(window.location.href.includes('staging2.justdial.com')){
            url = "https://staging2.justdial.com/Advertise"
        }
        let query = window.location.search;
        url+=query
        window.location.assign(url)
        // router.push(url)
      }}
     >
      Advertise Now
     </button>
    </div>
   </div>
  </div>
 );
}
