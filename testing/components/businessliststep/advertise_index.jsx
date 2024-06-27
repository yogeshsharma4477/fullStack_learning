import React from "react";
import styles from "./businessliststep.module.scss";
import Image from 'next/image'

export default function Businessliststep() {
    return(
        <div className={`${styles.businessliststep} ${styles.businesslistgoals} section`}>
            <h2 className={`color1a1`}>Justdial Ads Help You to Achieve Your Goals</h2>
            <ul>
                <li>
                    <Image width={242} height={195} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/new_user.svg" alt="step 1" />
                    <span className={`${styles.step__list}`}>
                        <p className={`${styles.step__list_txt} color111`}>Market Your Business <br /> to New Users</p>
                    </span>
                </li>
                <li>
                    <Image width={230} height={195} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/grow_revenue_icon.svg" alt="step 2" />
                    <span className={`${styles.step__list}`}>
                        <p className={`${styles.step__list_txt} color111`}>Grow Your <br /> Revenue</p>
                    </span>
                </li>
                <li>
                    <Image width={277} height={195} src="http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/more_customer.svg" alt="step 3" />
                    <span className={`${styles.step__list}`}>
                        <p className={`${styles.step__list_txt} color111`}>Get More <br /> Walk-in Customers</p>
                    </span>
                </li>
            </ul>
        </div>
    )
}