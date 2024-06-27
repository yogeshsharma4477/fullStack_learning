import React, { useEffect, useState } from "react";
import styles from "./businessprofessional.module.scss";
import Image from 'next/image'
import VideoPopUp from "../successstories/videoPopUp";
import { clickTracker, sanitizeParams } from "@/utils/commonFunc";
import { useRouter } from "next/router";


const DataArray = [
    {
        id: 'essential_business',
        title: 'How to Fill in the Essential Business Information',
        webLearnMoreURL: 'https://videos.jdmagicbox.com/video/tutorial/04506ca07c8cb91ba0cb43ac85542c5b.mp4',
        touch_appLearnMoreURL: 'https://videos.jdmagicbox.com/video/tutorial/32c59ca2b55f6767c352cbf0441e996e.mp4',
        imageURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/essintialbusiness2x.png',
        imageAlt: 'essintial business',
        isPlayer: true
    },
    {
        id: 'step_1',
        title: 'The Art of Selecting the Right Categories',
        webLearnMoreURL: 'https://videos.jdmagicbox.com/video/tutorial/3e649496ef5a52343434e29da99eb1c1.mp4',
        touch_appLearnMoreURL: 'https://videos.jdmagicbox.com/video/tutorial/6801bcbf3c861f2ee8d332363f8cb26a.mp4',
        imageURL: 'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/rightcat@2x.png',
        imageAlt: 'step 1',
        isPlayer: true
    },
    {
        id: 'customer_review',
        title: 'How to Respond to Customer Reviews and Questions',
        webLearnMoreURL: 'https://videos.jdmagicbox.com/justdial/rating_review/reply-to-reviews-english.mp4',
        touch_appLearnMoreURL: 'https://videos.jdmagicbox.com/justdial/rating_review/reply-to-reviews-english.mp4',
        imageURL: 'http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/customerreview@2x.png',
        imageAlt: 'customer review',
        isPlayer: true
    }
]

const WEB_SOURCE_CODES = ['7', '77', 'null'];


export default function Businessprofessional() {
  
  const [currVideoURl, setCurrentVideoURl] = useState("");
  const router = useRouter()
  let sourceCode = sanitizeParams(router?.query?.source) || null;


  useEffect(()=>{
    if(currVideoURl?.length){
      document.body.classList.add('bodyfixed')
    } else {
      document.body.classList.remove('bodyfixed')
    }
  },[currVideoURl])

  function showPlayer() {
    if(!currVideoURl?.length){
        return null;
    }
    return (
      <VideoPopUp url={currVideoURl} setYturl={setCurrentVideoURl}/>
    )   
  }


  const ClickTrackerCall = (li, ll) => {
    if (sourceCode == null) {
        let device_userAgent = navigator.userAgent;
        if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        device_userAgent
        )
        ) {
        sourceCode = "2";
        } else {
        sourceCode = "7";
        }
    }
    clickTracker({
        sourceCode: sourceCode,
        li: li,
        ll: ll,
    });
  };
      
  function fetch_li(index){
    let li='';
    switch(index){
        case 0:
            li = 'nfl_learn_more_1';
            break;
        case 1:
            li = 'nfl_learn_more_2';
            break;
        case 2:
            li = 'nfl_learn_more_3';
            break;
    }
    return li;
  }

  function handleLearnMoreClick(data, index) {

    ClickTrackerCall(fetch_li(index), 'NFL_LP')

    const isPlayer =  data?.isPlayer || null;
    
    if(isPlayer===null) console.error("Please Check there is someerror.");

    let sourceCode = (sanitizeParams(router?.query?.source) || 'null').toString();
    
    let isWeb  = WEB_SOURCE_CODES.includes(sourceCode);
    let videoUrl = isWeb ? data.webLearnMoreURL : data.touch_appLearnMoreURL;
    if(isPlayer && videoUrl){
      setCurrentVideoURl(videoUrl);
    }
  }
      
  return (
    <div className={`${styles.businessprofessional} section`}>
      <h2 className={`color1a1`}>
        Learn How to Make Your Business Profile Look More Professional
      </h2>
      <ul>
        {DataArray.map((data, index) => {
          const { id = null, title = "", imageURL = "", imageAlt = `${index}` } = data;
          return (
            <li onClick={()=>{handleLearnMoreClick(data, index)}} key={id || index}>
              <Image width={421} height={231} src={imageURL} alt={imageAlt} title={imageAlt} tabindex="0" role="presentation" />
              <span>
                <b tabindex="0" role="presentation" className={`color111`}>{title}</b>
                <a role="button" aria-label="Learn More" tabIndex="0" className={`color007 font20`}>
                  Learn More{" "}
                  <span className={`${styles.rightbluearrow} iconwrap`} />
                </a>
              </span>
            </li>
          );
        })}
      </ul>
      {showPlayer()}
    </div>
  );
}