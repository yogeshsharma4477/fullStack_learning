import React, { useState } from 'react'
import Image from 'next/image'
import styles from '../styles/landing.module.scss'
import Businesslistfree from '../components/businesslistfree/advertise_index'
// import Successstories from '../components/successstories'
import Businessliststep from '../components/businessliststep/advertise_index'
import Gotquestion from '../components/gotquestion/advertise_index'
import Businessprofessional from '../components/businessprofessional/advertise_index'
import Createfreeaccount from '../components/createfreeaccount/advertise_index'
import Landingfooter from '../components/landingFooter'
import Prcing from '../components/pricing'
import Features from '../components/features'
import { useRouter } from 'next/router'
import { isValidMobileNumber } from '@/utils/validations'

function Advertise() {
    const router = useRouter()
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState(false)

    const checkMobileNum = (e) => {
        e.preventDefault()
        const valid = isValidMobileNumber(mobile)
        if (!valid) {
            setError(true)
        } else {
            router.push('/')
        }
    }

    return (
        <>
            <div className={`${styles.landing}`}>
                <Businesslistfree
                    mobile={mobile}
                    checkMobileNum={checkMobileNum}
                    error={error}
                    setMobile={setMobile}
                />
                {/* <Successstories /> */}
                <Businessliststep />
                <Prcing />
                <Features />
                <Businessprofessional />
                <Gotquestion />
                <Createfreeaccount
                    mobile={mobile}
                    checkMobileNum={checkMobileNum}
                    error={error}
                    setMobile={setMobile}
                />
            </div>
            <Landingfooter />
        </>
    )
}
export default Advertise
