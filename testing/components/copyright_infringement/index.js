import styles from './copyright_infringement.module.scss';
import Image from 'next/image'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import { Android_CODE_ARR, IOS_CODE_ARR, TOUCH_CODE_ARR, clickTracker, generateHotLead, sanitizeParams } from '@/utils/commonFunc';
import { useEffect, useState } from 'react';
import GetaHaedCompetition from '../getaheadcompetition' 
import { appRedirection } from '@/utils/appFunctions';
import { trackingDashboardAPI } from '@/utils/api';

const data = [
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_rank.svg',
    name: 'Rank Higher in Search Results',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_own_website.svg',
    name: 'Transactional Enabled Website',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_business_leads.svg',
    name: 'Business Leads',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_management_system.svg',
    name: 'Smart Lead Management System',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_payment_solutions.svg',
    name: 'Payment Solutions',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_competitor_analysis.svg',
    name: 'Competitor Analysis',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_verified_trusted.svg',
    name: 'Verified and Trusted Seal',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_category_banner.svg',
    name: 'Category Banner on Desktop Site',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_digital_catalogue.svg',
    name: 'Online Catalogue',
    alt: '',
  },
  {
    imgURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_customer_support_new.svg',
    name: 'Premium Customer Support',
    alt: '',
  }       
]
export default function PleaseNote({ sid, mobile, shorturl }) {
  const [image,setImage] =useState({
    google:false,
    apple:false,
    web:true
  })

  const docid = useSelector((state) => state?.CommonValues?.docid);
  const router = useRouter()
  const source = sanitizeParams(router?.query?.source);
  const userSelectedCategory = useSelector((state) => state?.newCategoryPageSlice?.currCategoryData?.selectedCategoryId) || [];
  const city = useSelector((state) => state.Address.city);
  const StoreCommonInfo = useSelector((state) => state.CommonValues);
  const pincode =  useSelector((state) => state.Address.pincode);
  const getSource = useSelector((state) => state.CommonValues?.getSource || '' )
  const jdlite = sanitizeParams(router?.query?.jdlite)
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
  const IP = useSelector((state) => state.CommonValues?.ip || '')
  
  
  const handlePopState = () => {
    let query = router?.asPath || ''
    query = query.split('?')
    if (query.length) query = '?' + query[1]
    router.push('/bussinesslist' + query)
  }
  useEffect(() => {
    let trackingDataPayload = {
      source: source,
      clickType: 'load',
      IP: IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile: StoreCommonInfo?.mobileNumber || "",
      docid: StoreCommonInfo?.docid || "",
      sessionId: sesionId || "",
      city: city || ""
    }
    trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])


  function getSoruceNamefunction() {
    if (jdlite == 1 && source == 2) {
      return "jdlite"
    } else {
      return getSource[source]
    }
  }

  const hotleadCall = async (ll, iswarm = false) => {
    let payload = {
      number: StoreCommonInfo?.mobileNumber || "",
      docid:StoreCommonInfo?.docid || docid || "",
      g_queue: '1',
      data_city: city ? city : '',
      pincode:pincode,
      platform: getSoruceNamefunction(),
      campaign_name: 'promote_now_campaign',
      data_source: "PROMOTE NOW CAMPAIGN",
      link_location: ll,
      message_template: router?.query?.message_template || '',
      communication_channel: router?.query?.communication_channel || '',
      customer_segment: router?.query?.customer_segment || '',
  }
  generateHotLead(payload, iswarm).then((resp) => {
  })
  }

  async function RedirectGetPremiumPlan(isLeaderBoard=false,isLeaderBoardCta=false) {
    let trackingDataPayload = {
      source: source,
      clickType: 'click',
      IP: IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile: StoreCommonInfo?.mobileNumber || "",
      docid: StoreCommonInfo?.docid || "",
      sessionId: sesionId || "",
      city: city || "",
      li: "advertise_now"
    } 
    if(isLeaderBoard){
      if(isLeaderBoardCta){
        trackingDataPayload.li = "leaderboard_advertise_now"
        clickTracker({
          sourceCode:source,
          docid:StoreCommonInfo?.docid,
          li:"promotenow_freelisting_leaderboard",
          ll:"free_listing_upgrade"
        })
      }else{
        trackingDataPayload.li = "category_advertise_now"
        clickTracker({
          sourceCode:source,
          docid:StoreCommonInfo?.docid,
          li:"promotenow_freelisting_leadscount",
          ll:"free_listing_upgrade"
        })
      }
      await hotleadCall('free_listing_upgrade', false)
    }
    await trackingDashboardAPI(trackingDataPayload, window.location.href || "");

    const currDomain = window.location.host;
    let url = currDomain.includes('.justdial.com')?
      `https://${currDomain}/Advertise/plans-${shorturl}`:
      `https://www.justdial.com/Advertise/plans-${shorturl}`
    let query= window?.location?.search || '?'
    url+=query;
    if(query?.length>1){
      url+='&module=freelisting';
    } else {
      url+='module=freelisting';
    }
    
    if(Android_CODE_ARR.includes(source) || IOS_CODE_ARR.includes(source)) {
      setTimeout(()=>{
        appRedirection(url+'&hide_header=1&wkwebview=1', source)
      }, 500)
      return
    } else {
      if(TOUCH_CODE_ARR.includes(source)){
        url+='&touch=1&wkwebview=1'
      } 
      window.location.assign(url)
    }
  }

  useEffect(() =>{
    if(typeof window !== "undefined"){
      checkDeviceType(window.navigator.userAgent)
    }
  },[])

  const checkDeviceType = (device) =>{
    if (/android/i.test(device)) {
      setImage(prev => ({ google:true,apple:false,web:false }))
    } else if (/iphone|ipad|ipod/i.test(device)) {
      setImage(prev => ({ google:false,apple:true,web:false }))
    } else {
      setImage(prev => ({ google:false,apple:false,web:true }))
      clickTracker({
        sourceCode: source,
        docid: StoreCommonInfo?.docid,
        li: "app-download-web",
        ll: 'NFL_LP'
      })
    }
  }



  // const checkDeviceType =() =>{
  //   if(typeof window !== 'undefined'){

  //     const userAgent = window.navigator.userAgent 
  //     let isAndroid = /android/i.test(userAgent)
  //     let isIOS = /iPad|iPhone|iPod/.test(userAgent) 
  //     let img = "https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/G7ny.png"
  //     let message = `Scan QR Code to Download the Justdial App Instantly`
  //     let device = {type : "desktop" ,width:"150" ,height: "150"}
      
  //     if (isAndroid) {
  //       message = "Get the JD app instantly"
  //       img = "https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/googleplay.png"
  //       device = {type: "android" ,width:"163",height:"48"}
  //     } else if (isIOS) {
  //       message = "Get the JD app instantly"
  //       img = "https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/appstore.png"
  //    device = {type: "ios" ,width:"170",height:"47"}
  //     }

  //     if(!(isAndroid ||isIOS)){
  //       clickTracker({
  //         sourceCode: source,
  //         docid: StoreCommonInfo?.docid,
  //         li: "app-download-web",
  //         ll: 'NFL_LP'
  //       })
  //     }

  //     setDeviceValue({img : img, device : device,message : message})

  //   }
  // }

  return (
    <>
      <div className={`${styles.congratulation} container__inner flex__col flex__item__center`}>
        <GetaHaedCompetition categorySearch={userSelectedCategory[0]} city={city} RedirectGetPremiumPlan={RedirectGetPremiumPlan}/>
          <div className={`${styles.contract_status_top}`}>
            <Image 
              src={"//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/pleasenote.svg"}
              alt={"congratulation logo image."} 
              width={100}
              height={100} />
            <div className={`${styles.contract_status_top_right} pl-30 color111`}>
              <span className={`fw600 font26`}>Please Note</span>
              <p className={`mt-5 font20`}>Your account details has been flagged for possible copyright infringement. It will go for audit and will take upto 2 working days before the account can be activated.</p> 
              <p className={`mt-20 font20`}>You will be informed about successful activation via email.</p> 
            </div>
          </div>
          { ![...Android_CODE_ARR,...IOS_CODE_ARR].includes(source) ?   <div className={`${styles.banner}`}>
            <div className={`${styles.banner__left}`}>
              <b className={`fw600`}>Download the Jd App for :</b>
              <ul>
                <li>
                  <span className={`iconwrap ${styles.zerocosticon}`} />
                  <span className={`color111`}>Get Access to Buyer Leads at ZERO Cost</span>
                </li>
                <li>
                  <span className={`iconwrap ${styles.potentialcustomericon}`} />
                  <span className={`color111`}>Connect with Potential Customers</span>
                </li>
                <li>
                  <span className={`iconwrap ${styles.competitiontrendicon}`} />
                  <span className={`color111`}>View Competition Trends</span>
                </li>
              </ul>
            </div>
            <div className={styles.divider} />
           <div className={`${styles.banner__right}`} onClick={() => { 
              let li = ""
              
              if(image.google) {
                li = "app-download-android"
                window.location.href = "https://go.justdial.com/G7ny"
              }else if(image.apple){
                li = "app-download-ios"
                window.location.href = "https://go.justdial.com/G7ny"
              }

              clickTracker({
                sourceCode: sourceCode,
                docid: StoreCommonInfo?.docid,
                li: li,
                ll: 'NFL_LP'
              })

            } } >
           
             { image?.web ? <Image className={styles.qr} width={150} height={150} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/G7ny.png" alt="qr code" />
             : image?.google ? <Image className={styles.googleplay} width={163} height={48} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/googleplay.png" alt="Google Play" />
             : <Image className={styles.appstore} width={170} height={49} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/appstore.png" alt="App Store" />}
              <div className={`color111 fw600 ${styles.qr__text} ${styles.qr__text__desktop}`}>Scan QR Code to Download <br/>the Justdial App Instantly</div>
              <div className={`color111 fw600 ${styles.qr__text} ${styles.qr__text__mobile}`}>Get the JD app instantly</div>
            </div> 
          </div>: null}
        <div className={`${styles.congratulation__prembox}`}>
          <Image className={`${styles.congratulation__premiumicon}`} src="//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_yellow.svg" width={100} height={100} />
          <div className={`${styles.congratulation__prembox_right}`}>
            <div className={`${styles.congratulation__premiumtxt}`}>Upgrade to Premium Listing Plan</div>
            <div className={`${styles.congratulation__premiumsubtxt}`}>Rank higher on search results and get more customers to contact you.</div>
          </div>
        </div>
        <ul className={`${styles.premiumlist}`}>
            {
              data.map((dataVal, index)=>{
                return (
                  <li key={`contentListItem${index}`}>
                    <img src={dataVal.imgURL} alt={dataVal.alt} />
                    <span className={`${styles.premiumlist__txt}`}>{dataVal.name}</span>
                  </li>
                ) 
              })
            }
        </ul>
        <div className={`${styles.buttons}`}>
          <button className={`primarybutton ${styles.buttons__primary}`}
            onClick={() => RedirectGetPremiumPlan()}
          >Upgrade to Paid Plan<span> (Grow your Business)</span></button>
        </div>
      </div>
    </>
  )
}