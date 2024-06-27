import React from "react";
import styles from "./businessliststep.module.scss";
import Image from "next/image";

export default function Businessliststep() {
 return (
  <div id="businessliststepid" className={`${styles.businessliststep} section`}>
   <h2 className={`color1a1`}>Get a FREE Business Listing in 3 Simple Steps</h2>
   <ul>
    <li>
     <Image
      width={242}
      height={195}
      src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/createaccount@2x.png"
      alt="step 1"
     />
     <span className={`${styles.step__list}`}>
      <span className={`${styles.step}`}>Step 1</span>
      <b className={`color111`}>Create Account</b>
      <p className={`color111`}>Enter your mobile number to get started</p>
     </span>
    </li>
    <li>
     <Image
      width={230}
      height={204}
      src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/enterbusinessdetails@2x.png"
      alt="step 2"
     />
     <span className={`${styles.step__list}`}>
      <span className={`${styles.step}`}>Step 2</span>
      <b className={`color111`}>Enter Business Details</b>
      <p className={`color111`}>Add name, address, business hours and photos</p>
     </span>
    </li>
    <li>
     <Image
      width={277}
      height={164}
      src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/selectcat@2x.png"
      alt="step 3"
     />
     <span className={`${styles.step__list}`}>
      <span className={`${styles.step}`}>Step 3</span>
      <b className={`color111`}>Select Categories</b>
      <p className={`color111`}>
       Add relevant categories to your free listing page
      </p>
     </span>
    </li>
   </ul>
  </div>
 );
}
