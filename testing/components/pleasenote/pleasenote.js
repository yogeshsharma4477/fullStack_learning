import clickTracker from "@/utils/clickTracker";
import styles from '../../styles/congratulation.module.scss';
import Image from "next/image";
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { delete_cookie, sanitizeParams } from "@/utils/commonFunc";

export default function Pleasenote() {
  const router = useRouter()
  const docid = useSelector((state) => state?.CommonValues?.docid);
  const sourceCode = sanitizeParams(router?.query?.source)

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
    clickTracker({
      sourceCode: sourceCode,
      docid: docid || "",
      li: "Buiness_Created_PL_masked",
      ll: 'NFL_LP'
    })
    window.addEventListener("popstate", handlePopState);
    delete_cookie("docid")
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const handleClick = async () => {
    await clickTracker({
      sourceCode: sourceCode,
      docid: docid || "",
      li: "Masked_Business_BTH",
      ll: 'NFL_LP'
    })
    window.location.href = 'https://www.justdial.com/';
  }

  return (
    <>
      <div className="container__inner flex__item__center flex__col">
        <span className={`iconwrap ${styles.success}`}>
          <Image
            fill
            priority={true}
            src={"//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/pleasenote.svg"}
            alt={"congratulation logo image."}
          />
        </span>
        <span className={`${styles.congratulation} fw500 colord43 mt-15`}>Please Note</span>
        <span className={`${styles.register__text} ${styles.account__text} color1a1 mt-20`}>Your account details has been flagged for possible copyright infringement. It will go for audit and will take upto 2 working days before the account can be activated.</span>

        <span className={`iconwrap ${styles.register__img}`}>
          <Image
            fill
            priority={true}
            src={"//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/thankyou_call1.svg"}
            alt={"congratulation center image."}
          />
        </span>
        <p className={`${styles.content} color1a1`}>You will be informed about successful activation via email.</p>
        {/* dispatch(currentPage('add_contact')) */}
        <button className={`primarybutton ${styles.continue__button}`} onClick={handleClick}
        >Back to Homepage</button>
      </div>
    </>
  )
}
