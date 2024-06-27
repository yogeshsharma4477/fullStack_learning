import styles from '../../styles/congratulation.module.scss';
import Image from "next/image";
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { editListingApiCall, trackingDashboardAPI } from "@/utils/api";
import { clickTracker, sanitizeParams } from '@/utils/commonFunc';

export default function Congratulation() {
  const router = useRouter()
  const commonVal = useSelector((state) => state?.CommonValues);
  const addressData = useSelector((state) => state.Address);
  const [loader, setLoader] = useState(false);
  const sourceCode = sanitizeParams(router?.query?.source) || ''
  const IP = useSelector((state) => state.CommonValues?.ip || '')
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  const city = useSelector((state) => state.Address.city);
  const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
  const setSourceQuery = () => {
    let userAgent = navigator?.userAgent;
    let sourceVal = '7'
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      sourceVal = '2';
    }
    let queryObj = router.query;
    queryObj.source = sourceVal;
    router.push({
      pathname: '/bussinesslist',
      query: queryObj
    })
  }
  const handlePopState = () => {
    setSourceQuery()
  }
  useEffect(() => {
    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'load',
      IP: IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile: commonVal?.mobileNumber || "",
      docid: commonVal?.docid || docid || "",
      sessionId: sesionId || "",
      city: city || ""
    }
    trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    clickTracker({
      sourceCode: sourceCode,
      docid: commonVal?.docid,
      li: "Buiness_Created_PL_Non-masked",
      ll: 'NFL_LP'
    })
    document.cookie = "isFlow=false";
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
  const handleSubmit = async () => {
    //click tracker implementaion
    setLoader(true)
    try {
      let trackingDataPayload = {
        source: sourceCode,
        clickType: 'click',
        IP: IP || "",
        trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
        mobile: commonVal?.mobileNumber || "",
        docid: commonVal?.docid || docid || "",
        sessionId: sesionId || "",
        city: city || ""
      }
      await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    } catch (error) {
      console.log(error?.message)
    }
    clickTracker({
      sourceCode: sourceCode,
      docid: commonVal?.docid,
      li: "Buiness_Created_Continue",
      ll: 'NFL_LP'
    })
    clickTracker({
      sourceCode: sourceCode,
      docid: commonVal.docid,
      li: 'FL_Congratulations_Click',
      ll: 'FL_Congratulations'
    })
    let query = new URLSearchParams(router?.query || {}).toString()
    let url = editListingApiCall({
      city: addressData.city,
      compname: commonVal.companyName,
      docid: commonVal.docid,
      source: sourceCode || ''
    })
    // if (addressData.city == "Bangalore" || addressData.city == "bangalore") {
    //   url = `https://development:lBYxltGQ95VAs@staging2.justdial.com/jd-business?source=${sourceCode}&wap=${sourceCode}&docid=${commonVal.docid}`
    // }
    document.cookie = 'isFlow=true'
    router.push({
      pathname: '/addcontact',
      query: router.query || {}
    })
    // const isV2Flow = router?.query?.v2 || false;
    // if (isV2Flow) {
    //   document.cookie = 'isFlow=true'
    //   router.push('/addcontact' + query)
    // } else {
    //   window.location.assign(url)
    // }
  }
  return (
    <>
      {/* <div className={`form-wrapper`}> */}
      <div className={`container__inner flex__item__center flex__col ${styles.congratulation}`}>
        <span className={`iconwrap ${styles.success}`}>
          <Image width={59} height={59}
            src={"//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/success.svg"}
            alt={"Congratulation Logo Image."}
            title="Congratulation Logo Image"
          />
        </span>
        <span className={`${styles.congratulation} fw500 mt-15`}>Congratulations!</span>
        <span className={`${styles.register__text} color1a1 mt-10`}>Your business is now registered with Justdial.</span>
        <span className={`iconwrap ${styles.register__img}`}>
          <Image width={100} height={100}
            src={"//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/businessregister.svg"}
            alt={"Congratulation Image."}
            title="Congratulation Image"
          />
        </span>
        <p className={`${styles.content} color1a1`}>We need a few more details from you <br/>to complete your business profile</p>
        {/* </div> */}
        {!loader ? (
          <button aria-label="Continue to Add Contact Details" className={`primarybutton ${styles.continue__button}`} onClick={handleSubmit}
          >Continue to Add Contact Details</button>
        ) : (
          <button className={`primarybutton ${styles.continue__button}`} disabled={true}>
            <span className='btn-loader' />
          </button>
        )}
        {/* {!loader ?
                            <button
                                className={`primarybutton ${styles.continue__button}`} fw500 ripple mt-10`}
                                onClick={handleSubmit}
                            >
                                Continue
                            </button>
                            :
                            <button
                                disabled
                                classNam e={`primarybutton mt-10`}
                            >
                                <span className='btn-loader' />
                            </button>
                        } */}
      </div>
    </>
  )
}
