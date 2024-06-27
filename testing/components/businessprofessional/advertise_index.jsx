import React from "react";
import styles from "./businessprofessional.module.scss";
import Image from 'next/image'

export default function Businessprofessional() {
    return(
        <div className={`${styles.businessprofessional} section`}>
            <h2 className={`color1a1`}>Learn How to Maximise Justdial Ads for Your Business</h2>
            <ul>
                <li>
                    <Image width={421} height={231} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/rightcat@2x.png" alt="essintial business" />
                    <span>
                        <b className={`color111`}>The Art of Selecting the Right Categories</b>
                        <a className={`color007`}>Learn More <span className={`${styles.rightbluearrow} iconwrap`} /></a>
                    </span>
                </li>
                <li>
                    <Image width={421} height={231} src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/customerreview@2x.png" alt="step 1" />
                    <span>
                        <b className={`color111`}>How to Respond to Customer Reviews and Questions</b>
                        <a className={`color007`}>Learn More <span className={`${styles.rightbluearrow} iconwrap`} /></a>
                    </span>
                </li>
                <li>
                    <Image width={421} height={231} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/leads_management_img.png" alt="customer review" />
                    <span>
                        <b className={`color111`}>How to Effectively Use Leads Management System</b>
                        <a className={`color007`}>Learn More <span className={`${styles.rightbluearrow} iconwrap`} /></a>
                    </span>
                </li>
            </ul>
        </div>
    )
}