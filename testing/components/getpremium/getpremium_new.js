import styles from '../../styles/getpremium.module.scss';
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import clickTracker from "@/utils/clickTracker";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Android_CODE_ARR, IOS_CODE_ARR, TOUCH_CODE_ARR, generateHotLead, sanitizeParams } from '@/utils/commonFunc';
import { appRedirection } from '@/utils/appFunctions';
import { trackingDashboardAPI } from '@/utils/api';
import GetaHaedCompetition from '../getaheadcompetition'

export default function Getpremium({ sid, mobile, shorturl, docid }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const StoreCommonInfo = useSelector((state) => state.CommonValues);
  const sourceCode = sanitizeParams(router?.query?.source)
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  const getSource = useSelector(
    (state) => state.CommonValues?.getSource || ''
)
  const [profileScore, setProfileScore] = useState({
    val : '0%',
    text: '',
    barColor: '',
    barBGColor: '',
    barScore : ''  
  })
  const [image,setImage] =useState({
    google:false,
    apple:false,
    web:true
  })
  const IP = useSelector((state) => state.CommonValues?.ip || '')
  const city = useSelector((state) => state.Address.city);
  const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
  const cityParams = router?.query?.city; 
  const jdlite = router?.query?.jdlite
  const pincode =  useSelector((state) => state.Address.pincode);
  const userSelectedCategory = useSelector((state) => state?.newCategoryPageSlice?.suggestedCategoryData?.selectedCategoryId);
  let localStorageCity = null;
  if(typeof window !== 'undefined'){
    localStorageCity =Array.isArray(JSON.parse(window?.localStorage?.getItem("recentLocation"))) ? JSON.parse(window?.localStorage?.getItem("recentLocation"))[0]?.city : null
  }
  const clickTrackerCall = (li) => {
    //click tracker implementaion

    clickTracker({
      sourceCode: sourceCode,
      docid: StoreCommonInfo?.docid,
      li: li,
      ll: 'FL_GetPremium_Page'
    })
  }


  async function fetchScoreData(){
    const url = '/api/v2/fetchprofilescore';
    const responce = await axios.post(url, {
      docid: docid //'022PXX22.XX22.230712185508.H2Q6'
    })
    if(responce?.data?.results?.final_score) {
      let scorePercentage = Math.floor(responce?.data?.results?.final_score) || "";
      let barValue = 175 * (100 - scorePercentage) / 100
      scorePercentage+='%'
      let score = Math.floor(responce?.data?.results?.final_score);
      let profileScoreText = '';
      let profileScoreBarColor = {};
      let profileScoreBarBgColor = '';
      
      if(score >=0 && score <=35) { 
        profileScoreText ='Poor'; 
        profileScoreBarColor = {color:'#f87b7b'}; 
        profileScoreBarBgColor = '#f87b7b'; 
      } else if(score > 35 && score <= 70){ 
        profileScoreText ='Fair'; 
        profileScoreBarColor = {color:'#f59718'}; 
        profileScoreBarBgColor = '#f59718'; 
    } else if(score > 70 && score <=100){ 
      profileScoreText = 'Good'; 
      profileScoreBarColor = {color:'#00c200'}; 
      profileScoreBarBgColor = '#00c200'; 
    }
    
      setProfileScore((prev)=>({
        ...prev,
        val: scorePercentage,
        text: profileScoreText,
        barColor: profileScoreBarColor.color,
        barBGColor: profileScoreBarBgColor,
        barScore : barValue
      }))
    }
  }

  useEffect(()=>{
    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'load',
      IP: IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile: StoreCommonInfo?.mobileNumber || "",
      docid: StoreCommonInfo?.docid || docid || "",
      sessionId: sesionId || "",
      city: city || ""
    }
    trackingDashboardAPI(trackingDataPayload, window.location.href || "");

    clickTracker({
      sourceCode: sourceCode,
      docid: StoreCommonInfo?.docid,
      li: "Final_Page_PL",
      ll: 'NFL_LP'
    })
    fetchScoreData()
  }, [])

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
        sourceCode: sourceCode,
        docid: StoreCommonInfo?.docid,
        li: "app-download-web",
        ll: 'NFL_LP'
      })
    }

  }


  const hotleadCall =async (ll, iswarm=false) => {
    let payload = {
      number: StoreCommonInfo?.mobileNumber || "",
      docid:StoreCommonInfo?.docid || docid || "",
      g_queue: '1',
      data_city: city
          ? city
          : cityParams
          ? cityParams
          : localStorageCity
          ? localStorageCity
          : '',
      pincode:pincode,
      platform: getSoruceNamefunction(),
      campaign_name: 'promote_now_campaign',
      data_source: "PROMOTE NOW CAMPAIGN",
      link_location: ll,
      message_template: router?.query?.message_template || '',
      communication_channel:
          router?.query?.communication_channel || '',
      customer_segment: router?.query?.customer_segment || '',
      session:sesionId
  }
  generateHotLead(payload, iswarm).then((resp) => {
  })
  }

  function getSoruceNamefunction() {
    if (jdlite == 1 && sourceCode == 2) {
      return "jdlite"
    } else {
      return getSource[sourceCode]
    }
  }



  async function RedirectGetPremiumPlan(isLeaderBoard=false,isLeaderBoardCta=false) {
    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'click',
      IP: IP || "",
      trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
      mobile: StoreCommonInfo?.mobileNumber || "",
      docid: StoreCommonInfo?.docid || docid || "",
      sessionId: sesionId || "",
      city: city || "",
      li: "advertise_now"
    }
    if(!isLeaderBoard){
      clickTrackerCall('FL_GetPremium_Plan')
      clickTracker({
        sourceCode: sourceCode,
        docid: StoreCommonInfo?.docid,
        li: "Final_Page_Advertise_Click",
        ll: 'NFL_LP'
      })
      clickTracker({
        sourceCode:sourceCode,
        docid:StoreCommonInfo?.docid,
        li:"promotenow_freelisting",
        ll:"free_listing_upgrade"
      })
      await hotleadCall('freelisting_cta', false)
    }else{
      if(isLeaderBoardCta){
        trackingDataPayload.li = "leaderboard_advertise_now"
        clickTracker({
          sourceCode:sourceCode,
          docid:StoreCommonInfo?.docid,
          li:"promotenow_freelisting_leaderboard",
          ll:"free_listing_upgrade"
        })
      }else{
        trackingDataPayload.li = "category_advertise_now"
        clickTracker({
          sourceCode:sourceCode,
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
    
    if(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) {
      setTimeout(()=>{
        appRedirection(url+'&hide_header=1&wkwebview=1', sourceCode)
      }, 500)
      return
    } else {
      if(TOUCH_CODE_ARR.includes(sourceCode)){
        url+='&touch=1&wkwebview=1'
      }
      window.location.assign(url)
    }
  }

  const RedirectJdBusinessFunctionCall = async (e, sourceCode = null, docid) => {
    e.preventDefault();
    try {
      let trackingDataPayload = {
        source: sourceCode,
        clickType: 'click',
        IP: IP || "",
        trace : JSON.stringify({"useragent" : navigator.userAgent, lat, long}),
        mobile: StoreCommonInfo?.mobileNumber || "",
        docid: StoreCommonInfo?.docid || docid || "",
        sessionId: sesionId || "",
        city: city || "",
        li: "jd_Business_cta"
      }
      await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    } catch (error) {
      console.log(error?.message)
    }

    clickTracker({
      sourceCode: sourceCode,
      docid: StoreCommonInfo?.docid,
      li: "Final_Page_Profile_Score",
      ll: 'NFL_LP'
    })

    let url = '';
    if (window.location.host.includes('www.justdial.com')) {
      url = 'https://www.justdial.com/jd-business';
    } else {
      url = 'https://development:lBYxltGQ95VAs@staging2.justdial.com/jd-business';
    }
    let queryParams = `?source=${sourceCode}&wap=${sourceCode}&docid=${docid}&module=free_listing`
    url += queryParams;
    // console.log(url);
    if(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) {
      appRedirection(url+'&hide_header=1', sourceCode)
      return
    }

    router.push(url)
  }


  return (
    <>
      <div className={`${styles.congratulation} container__inner flex__col`}>
          <div className={`${styles.congratulation_top_left}`}>
            <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/Successful.svg" alt="" />
            <div className={`${styles.congratulation_top_left_data} fw600`}>
              Congratulations - Your business is now registered with Justdial
              {/* <span className={`${styles.congratulation_top_left_data_txt}`}>Congratulations! </span> */}
              {/* <span className={`${styles.congratulation_top_left_data_txt2}`}>Your business is now registered with Justdial</span> */}
            </div>
          </div>
          <GetaHaedCompetition categorySearch={userSelectedCategory ? userSelectedCategory[0] : null} city={city} RedirectGetPremiumPlan={RedirectGetPremiumPlan}/>
          { ![...Android_CODE_ARR,...IOS_CODE_ARR].includes(sourceCode) ?   <div className={`${styles.banner}`}>
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
          <Image className={`${styles.congratulation__premiumicon}`} src="//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_yellow.svg" width={100} height={100} alt="Premium" title="Premium" />
          <div className={`${styles.congratulation__prembox_right}`}>
            <div className={`${styles.congratulation__premiumtxt}`}>Upgrade to Premium Listing Plan</div>
            <div className={`${styles.congratulation__premiumsubtxt}`}>Rank higher on search results and get more customers to contact you.</div>
          </div>
        </div>

        <ul className={`${styles.premiumlist}`}>
          <li>
            <Image width={44} height={44} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_rank.svg" alt="Premium Rank" title="Premium Rank" />
            <span className={`${styles.premiumlist__txt}`}>Rank Higher than Free Listing</span>
          </li>
          <li>
            <Image width={44} height={44} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_verified_trusted.svg" alt="Verified and Trusted Seal" title="Verified and Trusted Seal" />
            <span className={`${styles.premiumlist__txt}`}>Verified and Trusted Seal</span>
          </li>
          <li>
            <Image width={44} height={44} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_business_leads.svg" alt="Business Leads" title="Business Leads" />
            <span className={`${styles.premiumlist__txt}`}>Business Leads</span>
          </li>
          <li>
            <Image width={44} height={44} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_digital_catalogue.svg" alt="Digital Catalogue" title="Digital Catalogue" />
            <span className={`${styles.premiumlist__txt}`}>Digital Catalogue</span>
          </li>
          <li>
            <Image width={44} height={44} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_payment_solutions.svg" alt="Payment Solutions" title="Payment Solutions" />
            <span className={`${styles.premiumlist__txt}`}>Payment Solutions</span>
          </li>
          <li>
            <Image width={44} height={44} src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_own_website.svg" alt="Own Business Website" title="Own Business Website" />
            <span className={`${styles.premiumlist__txt}`}>Own Business Website</span>
          </li>
        </ul>
        <div className={`${styles.buttons}`}>
          <button className={`primarybutton ${styles.buttons__primary}`}
            onClick={() => RedirectGetPremiumPlan()}
          >Get Premium Plan <span> (Grow your Business)</span></button>
        </div>
        <div className={`${styles.congratulation_top_right}`}>
          <div className={`${styles.congratulation_top_right_progress}`}>
          <svg width="100%" height="100%" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" strokeWidth="4px" style={{ fill: 'none', stroke: '#e4eaef' }}></circle>
            <circle
              cx="30" cy="30" r="28" strokeWidth="4px"
              style={{
                fill: 'none',
                stroke: '#00c202',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                animation: 'circle-chart-fill 1s reverse',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center center 0px',
                strokeDasharray: '175.929',
                strokeDashoffset:  profileScore.barScore,
                transition: 'all 1s',
              }}
            ></circle>
            <text x="50%" y="50%" dy=".3em" textAnchor="middle" className={`${styles.progressbartext} fw600`}>
              {profileScore.val}
            </text>
          </svg>
          </div>
            <div className={`${styles.congratulation_top_right_bottom}`}>
              <div className={`${styles.congratulation_top_right_txt}`}>Your Current Business Profile Score</div>
              <div className={`${styles.congratulation_top_right_bottom_txt}`}>
                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/black_analytics.svg" alt="" />
                <div className={`${styles.congratulation_top_right_bottom_txt_inner}`}>Increase your profile score and reach out to more users on Justdial</div>
              </div>
              <button aria-label="Click Here to Increase Your Score" 
                  onClick={(e) => RedirectJdBusinessFunctionCall(e, sourceCode, docid)} 
                  className={`btnprimary`}
                >Click Here to Increase Your Score</button>
            </div>
          </div>
      </div>
    </>
  )
}