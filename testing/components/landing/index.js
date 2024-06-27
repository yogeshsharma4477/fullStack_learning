import React from 'react'
import Image from 'next/image'
import styles from "./landing.module.scss"
import Businesslistfree from '../businesslistfree'
import Successstories from '../successstories'
import Businessliststep from '../businessliststep'
import Growbusiness from '../growbusiness'
import Gotquestion from '../gotquestion'
import Businessprofessional from '../businessprofessional'
import Createfreeaccount from '../createfreeaccount'
import Otppopup from '../otppopup'
import Landingfooter from '../landingFooter'
function Landingpage() {
    return (
        <>
            <div className={`${styles.landing}`}>
                <Businesslistfree />
                <Successstories />
                <Businessliststep />
                <Growbusiness />
                <Gotquestion />
                <Businessprofessional />
                <Createfreeaccount />
                {/* <Otppopup /> */}
            </div>
            <Landingfooter />
        </>
    )
}
export default Landingpage;