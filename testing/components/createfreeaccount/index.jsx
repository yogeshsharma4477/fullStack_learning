import React from "react";
import styles from "./createfreeaccount.module.scss";
import Image from "next/image";
import EnterMobileNumber from "../enterMobileNumber";
import TermsPrivacyInfringement from "../termsPrivacyInfringement";
// import { useState } from "react";

export default function Createfreeaccount({city="", LoggedInMobileNumber, page="", index=""}) {
 return (
  <div className={`section`}>
   <div className={`${styles.createfreeaccount} commonAccount`}>
    <div className={`${styles.createfreeaccount__left}`}>
     <h1 className={`color1a1`}>List Your Business for FREE on Justdial Today</h1>
     <span className={`color1a1`}>India's No. 1 Local Search Engine</span>
     <EnterMobileNumber styles={styles} buttnTxt={'Create FREE Account'} isFlag={true} city={city} index={index ? index : 3} page={page} LoggedInMobileNumber={LoggedInMobileNumber}/>
         <TermsPrivacyInfringement StyleProperty={styles.createfreeaccount_note}/> 
    </div>
    <div className={`${styles.createfreeaccount__right}`}>
     <Image
      width={370}
      height={197}
      src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/list.svg"
      alt="Create Free Account"
      title="Create Free Account"
     />
    </div>
   </div>
  </div>
 );
}
