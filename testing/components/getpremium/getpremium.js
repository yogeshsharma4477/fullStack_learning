import styles from '../../styles/getpremium.module.scss'
import Image from 'next/image'
import { currentPage } from '@/store/Slices/CurrentCompoentSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import clickTracker from '@/utils/clickTracker'
import { delete_cookie, sanitizeParams } from '@/utils/commonFunc'
import Prcing from '../pricing'
import Features from '../features'

export default function Getpremium({ sid, mobile, shorturl, docid }) {
    const router = useRouter()
    const dispatch = useDispatch()
    const StoreCommonInfo = useSelector((state) => state.CommonValues)
    const sourceCode = sanitizeParams(router?.query?.source)

    const clickTrackerCall = (li) => {
        //click tracker implementaion

        const sourceCode = sanitizeParams(router?.query?.source)
        clickTracker({
            sourceCode: sourceCode,
            docid: StoreCommonInfo?.docid,
            li: li,
            ll: 'FL_GetPremium_Page',
        })
    }

    function RedirectGetPremiumPlan() {
        const sourceCode = sanitizeParams(router?.query?.source)

        clickTrackerCall('FL_GetPremium_Plan')

        let baseurl =
            location.host && location.host.match(/\.jdsoftware\.jd/)
                ? 'http://project01.anilkumar.jdsoftware.jd'
                : (location.host && location.host.match(/2\.justdial/) ? 'https://staging2.justdial.com':'')
        let premiumPageUrl = baseurl + `/E-OCSD-${shorturl}`
        let query = '?'
        query += 'module=freelisting'
        query += `&docid=${StoreCommonInfo.docid}`
        query += '&jdlite='
        // query += `&mobile=${mobile}`
        // query += `&sid=${sid}`
        query += `&source=${sourceCode}`
        premiumPageUrl += query
        window.location.href = premiumPageUrl
    }

    const RedirectJdBusinessFunctionCall = async (
        e,
        sourceCode = null,
        docid
    ) => {
        e.preventDefault()
        let url = ''
        if (window.location.host.includes('www.justdial.com')) {
            url = 'https://www.justdial.com/jd-business'
        } else {
            url =
                'https://development:lBYxltGQ95VAs@staging2.justdial.com/jd-business'
        }
        let queryParams = `?source=${sourceCode}&wap=${sourceCode}&docid=${docid}&module=free_listing`
        url += queryParams
        // console.log(url);

        router.push(url)
    }

    return (
        <>
            <div className={`${styles.congratulation}`}>
                <div className={`${styles.congratulation__box}`}>
                    <div className={`section`}>
                        <header className={`${styles.header}`}>
                            <button
                                className={`iconwrap backicon ripple`}
                                onClick={() => {
                                    router.back()
                                }}
                            />
                        </header>
                        {/* <span onClick={() => { window.location.href = window.location = 'https://www.justdial.com/' }} className={`${styles.congratulation__skip}`}>SKIP</span> */}
                        <span role="button" tabIndex="0" aria-label="Skip"
                            onClick={(e) =>
                                RedirectJdBusinessFunctionCall(
                                    e,
                                    sourceCode,
                                    StoreCommonInfo?.docid
                                )
                            }
                            className={`${styles.congratulation__skip}`}
                        >
                            SKIP
                        </span>
                        <div className={`${styles.congratulation__wrap}`}>
                            <div>
                                <Image
                                    className={`${styles.congratulation__icon}`}
                                    src="//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/congratulation_white.svg"
                                    width={45}
                                    height={45}
                                    alt="Congratulation"
                                    title='Congratulation'
                                />
                            </div>
                            <div className={`${styles.congratulation__hd}`}>
                                Congratulations!
                            </div>
                        </div>
                        <div className={`${styles.congratulation__sub}`}>
                        Your business is now registered with Justdial
                        </div>
                    </div>
                </div>
                <div className={`${styles.congratulation__boxwrp}`}>
                    <div className={`${styles.congratulation__prembox}`}>
                        <div
                            className={`${styles.congratulation__prembox_left}`}
                        >
                            <Image
                                className={`${styles.congratulation__premiumicon}`}
                                src="//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_yellow.svg"
                                width={100}
                                height={100}
                                alt="Upgrade Premium Plan"
                                title="Upgrade Premium Plan"
                            />
                            <div>
                                <div
                                    className={`${styles.congratulation__premiumtxt}`}
                                >
                                    Get Premium
                                </div>
                                <div
                                    className={`${styles.congratulation__premiumsubtxt}`}
                                >
                                    Upgrade to Premium Listing Plan to rank
                                    higher on search results and get more
                                    customers to contact you.
                                </div>
                            </div>
                        </div>
                        <div>
                            <button aria-label="Request Call Back FREE Consultation"
                                onClick={() => {
                                    console.log('inside')
                                    clickTrackerCall('FL_Request_Call_Back')
                                    let query = router?.asPath || ''
                                    query = query.split('?')
                                    if (query.length) query = '?' + query[1]
                                    router.push({
                                        pathname: '/thankyou',
                                        query: router.query || {}
                                    })                                    
                                    // dispatch(currentPage('thank_you'))
                                }}
                                className={`${styles.congratulation__requestbtn}`}
                            >
                                <i
                                    className={`${styles.congratulation_requesticon}`}
                                />
                                Request Call Back{' '}
                                <span>(FREE Consultation)</span>
                            </button>
                        </div>
                    </div>
                    <Prcing />
                    <Features />
                </div>
                {/* <ul className={`${styles.premiumlist}`}>
          <li>
            <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_rank.svg" alt="" />
            <span className={`${styles.premiumlist__txt}`}>Rank Higher than Free Listing</span>
          </li>
          <li>
            <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_verified_trusted.svg" alt="" />
            <span className={`${styles.premiumlist__txt}`}>Verified and Trusted Seal</span>
          </li>
          <li>
            <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_business_leads.svg" alt="" />
            <span className={`${styles.premiumlist__txt}`}>Business Leads</span>
          </li>
          <li>
            <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_digital_catalogue.svg" alt="" />
            <span className={`${styles.premiumlist__txt}`}>Digital Catalogue</span>
          </li>
          <li>
            <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_payment_solutions.svg" alt="" />
            <span className={`${styles.premiumlist__txt}`}>Payment Solutions</span>
          </li>
          <li>
            <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_own_website.svg" alt="" />
            <span className={`${styles.premiumlist__txt}`}>Own Business Website</span>
          </li>
        </ul>
        <div className={`${styles.buttons}`}>
          <button className={`${styles.buttons__default} ripple`} onClick={() => {
            clickTrackerCall('FL_Request_Call_Back')
            let query = router?.asPath || ''
            query = query.split('?')
            if (query.length) query = '?' + query[1]
            router.push('/thankyou' + query)
            // dispatch(currentPage('thank_you'))
          }}>Request Call Back <span>(FREE Consultation)</span></button>
          <button className={`primarybutton ${styles.buttons__primary}`}
            onClick={() => RedirectGetPremiumPlan()}
          >Get Premium Plan <span>(Grow your Business)</span></button>
        </div>
        <div onClick={() => {
          window.location.href = 'https://www.justdial.com/';
        }}
          className={`${styles.mobileskip} ripple`}>SKIP</div> */}
            </div>
        </>
    )
}
