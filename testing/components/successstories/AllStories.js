import React, { useState, useEffect,useRef } from 'react'
import styles from "./successstories.module.scss";
import { GetVideos } from './apiCalls'
import Createfreeaccount from '../createfreeaccount';
import VideoPopUp from './videoPopUp';
import { useRouter } from "next/router";
import axios from 'axios';
import { sanitizeParams ,detailsRedirect } from '@/utils/commonFunc';
import SuccessShimmer from "./shimmer"

export default function AllStories({ videos, sinceDate, mobileNumber=null ,categories}) {
    const [ytUrl, setYturl] = useState(null)
    const router = useRouter();
    let signUpIndex = useRef(1)
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
    signUpIndex.current = 1
    return (
        <div className={`${styles.allstory_wrp}`}>
            <div className={`section`}>
                <div className={`${styles.sucessHeading}`}>Success Stories</div>
            </div>
            <div className={`section ${styles.allstories}`}>
                <div className={`${styles.successstories__right}`}>
                    <div className={`carousel__wrap`}>
                        {
                            videos?.length > 0 ? videos.map((video, i) => {
                                console.log("details",video)
                                const { client_name, company_name, city, docid, youtube_link, thumbnail } = video
                                let uniqueId = youtube_link ? youtube_link?.split('/') : []
                                return (
                                    <>
                                        {
                                            (sanitizeParams(router?.query?.source) === '7' || sanitizeParams(router?.query?.source) === '77' || sanitizeParams(router?.query?.source) === undefined)
                                                ?
                                                <>
                                                    {i === 4 ? <Createfreeaccount LoggedInMobileNumber={mobileNumber} index={signUpIndex.current++} page="successStories" /> : null}
                                                    {(i !== 0 && (i + 4) % 8 === 0 && i !== 4 && i !== 4) ? <Createfreeaccount LoggedInMobileNumber={mobileNumber} index={signUpIndex.current++} page="successStories" /> : null}
                                                </>
                                                :
                                                <>
                                                    {i === 1 ? <Createfreeaccount LoggedInMobileNumber={mobileNumber} index={signUpIndex.current++} page="successStories" /> : null}
                                                    {(i !== 0 && (i + 3) % 4 === 0 && i !== 1) ? <Createfreeaccount LoggedInMobileNumber={mobileNumber}  index={signUpIndex.current++} page="successStories"/> : null}
                                                </>
                                        }
                                        <div role="button" tabIndex="0" aria-label={company_name} className={`carousel curs_pointer color111`} key={i} onClick={() => { setYturl(youtube_link); document.body.classList.add('bodyfixed') }}>
                                            {/* <img width={283} height={230} src={`https://img.youtube.com/vi/${uniqueId ? uniqueId[uniqueId.length - 1] : ""}/sddefault.jpg`} alt="thumbnail" /> */}
                                            <img height={230} src={`https://img.jdmagicbox.com/client_videos/${city}/${thumbnail}`} alt={company_name} title={company_name} />
                                            {/* <img height={230} src={`${thumbnail}`} alt="thumbnail" /> */}
                                            <span className={`play iconwrap`} />
                                            <div className={`carousel__inner`}>
                                                <div>
                                                    <b className={`carousel__title`}>{client_name}</b>
                                                    <div className={`carousel__subtitle`}>{company_name}</div>
                                                    <div className={`${styles.position}`}> {categories[i]}</div>
                                                </div>
                                                <div>
                                                    <div className={`carousel__year`}>{sinceDateFormat(sinceDate[i], docid)}</div>
                                                    <span className={`fw500 mt-10 ${styles.visitbusiness}`} onClick={(e)=>{e.stopPropagation(); detailsRedirect(video,router?.query?.source)}}>Visit Business</span>
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            (sanitizeParams(router?.query?.source) === '7' || sanitizeParams(router?.query?.source) === '77' || sanitizeParams(router?.query?.source) === undefined)
                                                ?
                                                <>
                                                    {(i === videos.length - 1 && (i + 5) % 8 === 0) ? <Createfreeaccount LoggedInMobileNumber={mobileNumber} index={signUpIndex.current++} page="successStories" /> : null}
                                                </>
                                                :
                                                <>
                                                    {(i === videos.length - 1 && (i + 4) % 4 === 0) ? <Createfreeaccount LoggedInMobileNumber={mobileNumber} index={signUpIndex.current++} page="successStories" /> : null}
                                                </>
                                        }
                                    </>
                                )
                            }) : <><SuccessShimmer /></>
                        }
                    </div>
                    {
                        ytUrl ? <VideoPopUp url={ytUrl} setYturl={setYturl} /> : null
                    }
                </div>
            </div>
        </div>
    )
}
