import React from "react";
import styles from "./successstories.module.scss";
import Image from 'next/image'
import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import VideoPopUp from "./videoPopUp";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { GetVideos } from "./apiCalls";
import { clickTracker, removeRepetitiveQueryParams, sanitizeParams,getRandomIndex, detailsRedirect } from "@/utils/commonFunc";

const bgcolorForImage = ["video_bg1", "video_bg2", "video_bg3"]
let colorIndexForImage = -1

// const priorityVideo = [
//     {
//         area: "Chandni Chowk",
//         city: "Kolkata",
//         client_name: "Mr. Prem Rohira",
//         client_video_id: "479",
//         company_name: "Manohar Radios",
//         docid: "033PXX33.XX33.130326185229.W2M6",
//         flv: "",
//         thumbnail: "Kolkata_Mr.-Prem-Rohira_1695987101kolkata_mr.-prem-rohira_1695987101.png",
//         youtube_link: "https://www.youtube.com/embed/jkdwYlZB1L0",
//     },
//     {
//         area: "Bilekahalli",
//         city: "Bangalore",
//         client_name: "Ms. Varshini",
//         client_video_id: "499",
//         company_name: "V2 Makeover",
//         docid: "080PXX80.XX80.220122121356.F4U4",
//         flv: "",
//         thumbnail: "Bangalore_Ms.-Varshini_1695989278bangalore_ms.-varshini_1695989278.png",
//         youtube_link: "https://www.youtube.com/embed/jyHS2ypYxIg",
//     },
//     {
//         area: "Gandhinagar Jammu",
//         city: "Jammu",
//         client_name: "Mr. Dheeraj Gupta",
//         client_video_id: "467",
//         company_name: "Hitech Motors",
//         docid: "9999PX191.X191.120729172244.D3P1",
//         flv: "",
//         thumbnail: "Jammu_Mr.-Dheeraj-Gupta_1695989457jammu_mr.-dheeraj-gupta_1695989457.png",
//         youtube_link: "https://www.youtube.com/embed/4-WTEi0yxqc",
//     },

// ]


const seeAllStoriesLink = 'https://www.justdial.com/cms/client-success-videos/?jdlite=0&source=77&version=&nh=&investor=0&historyBack=0';

export default function Successstories({ sinceDate,categories, videos }) {

    const [ytUrl, setYturl] = useState(null)
    const [randomVideo ,setRandomVideo] = useState(null)
    const router = useRouter()

    function sinceDateFormat(date, docid) {
        if (docid === "033PXX33.XX33.130326185229.W2M6") {
            return `Customer since 9 years`
        }
        if (docid === "080PXX80.XX80.220122121356.F4U4") {
            return `Customer since 1 year`
        }
        if (docid === "9999PX191.X191.120729172244.D3P1") {
            return `Customer since 8 years`
        }
        if (!date) return ""
        let n = date.length - 1
        if (date[n] === 'y') {
            if (date.slice(0, n) == 1) {
                return `Customer since ${date.slice(0, n)} year`
            } else {
                return `Customer since ${date.slice(0, n)} years`
            }
        } else if (date[n] === 'm') {
            if (date.slice(0, n) == 1) {
                return `Customer since ${date.slice(0, n)} month`
            } else {
                return `Customer since ${date.slice(0, n)} months`
            }
        } else {
            if (date.slice(0, n) == 1) {
                return `Customer since ${date.slice(0, n)} day`
            } else {
                return `Customer since ${date.slice(0, n)} days`
            }
        }
    }

    function fetch_li(index) {
        let li = '';
        switch (index) {
            case 0:
                li = 'nfl_first_video';
                break;
            case 1:
                li = 'nfl_2nd_video';
                break;
            case 2:
                li = 'nfl_3rd_video';
                break;
        }
        return li;
    }

    let sourceCode = sanitizeParams(router?.query?.source) || null;
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
            ll: 'NFL_LP',
        });
    };


    const ImgArr = [
        'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/listingvideo_3_18sep.jpg',
        'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/listingvideo_2_18sep.jpg',
        'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/listingvideo_1_18sep.jpg',
    ]

    const hardCodedYear = ["Customer since 9 years", "Customer since 1 year", "Customer since 8 years"]

    useEffect(()=>{
        setRandomVideo(videos)
    },[])


    return (
        <div className={`${styles.success_wrap}`}>
            <div id={`successstories`} className={`${styles.successstories} section`}>
                <div className={`${styles.successstories__left}`}>
                    <span className={`${styles.openquote} iconwrap`} tabindex="0" role="presentation" />
                    <h2 className={`color1a1 ${styles.subtitle}`}>Success Stories</h2>
                    <span className={`color1a1 ${styles.subtext}`}>5.4 Lakh+ Advertisers</span>
                    <button aria-label="See All Stories" className={`primarybutton animationstop`} onClick={() => {
                        ClickTrackerCall('nfl_sas', 'NFL_LP')
                        let query = new URLSearchParams(router?.query || {}).toString()
                        // query = removeRepetitiveQueryParams(query)
                        router.push({
                            pathname: '/successStories',
                            query: router.query || {}
                        })
                    }}>See All Stories</button>
                </div>
                <div className={`${styles.successstories__right}`}>
                    <div className={`carousel__wrap`}>
                        {
                            randomVideo && randomVideo.slice(0,3).map((video, i) => {
                                const { client_name, company_name, city, youtube_link, thumbnail,docid } = video
                                let uniqueId = youtube_link ? youtube_link?.split('/') : []
                                colorIndexForImage === 2 ? colorIndexForImage = -1 : colorIndexForImage = colorIndexForImage
                                colorIndexForImage++
                                return (
                                    <div role="button" tabIndex="0" aria-label={company_name}  className={`carousel color111 ${styles[bgcolorForImage[colorIndexForImage]]}`} key={i} onClick={() => {
                                        ClickTrackerCall(fetch_li(i), 'NFL_LP')
                                        setYturl(youtube_link); document.body.classList.add('bodyfixed')
                                    }}>
                                        {/* <img width={283} height={230} src={`https://img.youtube.com/vi/${uniqueId ? uniqueId[uniqueId.length - 1] : ""}/sddefault.jpg`} alt="thumbnail" /> */}
                                        {/* <img width={283} height={230} src={`${ImgArr[i]}`} alt="thumbnail" /> */}
                                        <Image width={283} height={230} src={`https://img.jdmagicbox.com/client_videos/${city}/${thumbnail}`} alt={company_name} title={company_name} />
                                        <span className={`play iconwrap`} />
                                        <div className={`carousel__inner`}>
                                            <div>
                                                <b className={`carousel__title`}>{client_name}</b>
                                                <div className={`carousel__subtitle`}>{company_name}</div>
                                                <div className={`${styles.position}`}>{categories[i]}</div>
                                            </div>
                                            {/* <div className={`carousel__year`}>{hardCodedYear[i]}</div> */}
                                            <div>
                                                <div className={`carousel__year`}>{sinceDateFormat(sinceDate[i], docid)}</div>
                                                <a className={`fw500 mt-10 ${styles.visitbusiness}` } onClick={(e)=>{ e.stopPropagation(); detailsRedirect(video,sourceCode)}}>Visit Business</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })

                        }
                    </div>
                </div>
            </div>
            {
                ytUrl ? <VideoPopUp url={ytUrl} setYturl={setYturl} /> : null
            }
        </div>
    )
}