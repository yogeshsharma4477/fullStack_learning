import React, { useLayoutEffect, useRef } from 'react'
import AllStories from '@/components/successstories/AllStories'
import { useRouter } from 'next/router';
import { useEffect } from "react";
import Otppopup from '../components/otppopup';
import axios from 'axios'
import FormData from 'form-data';
import { parse } from 'cookie';
import { sanitizeParamValue, sanitizeParams, verifyUserSID } from '@/utils/commonFunc';
import { updateCommonValues } from '@/store/Slices/commonDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import excuteQuery from './api/lib/db_success_stories';

const successStories = ({ videos, sinceDate, mobileNumber,isBussiness ,categories}) => {


    const isAdvertisePage = useRef(false);
    const router = useRouter()
    const landingPageReduxData = useSelector((state) => {
        const { isShowOTP = false, moblieNumber = "" } = state?.landinfPageSlice || {};
        return {
            isShowOTP, moblieNumber
        }
    })
    const dispatch = useDispatch()
    const { isShowOTP, moblieNumber } = landingPageReduxData;

    function handlePopState(){
        document.body.classList.remove('bodyfixed')
    }
    
    useEffect(() => {
        dispatch(updateCommonValues({ key: "isBussiness", value: isBussiness }));
        dispatch(updateCommonValues({ key: "isVerified", value: mobileNumber })); 
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    useLayoutEffect(()=>{
        isAdvertisePage.current = router.pathname.includes("Advertise")
    }, [])

    const setSourceQuery = () => {
        let userAgent = navigator?.userAgent;
        let sourceVal = '7'
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
            sourceVal = '2';
        }
        let queryObj = router.query;
        if (!queryObj.source) queryObj.source = sourceVal;
        router.replace({
            pathname: '/successStories',
            query: queryObj
        },
            undefined, { shallow: true }
        )
    }


    useEffect(() => {
        let isSourcePresent = sanitizeParams(router?.query?.source)?.length || false
        if (!isSourcePresent) setSourceQuery();
    }, []);
    return (
        <>
            <AllStories
                videos={videos}
                sinceDate={sinceDate}
                mobileNumber={mobileNumber}
                categories={categories}
            />
            {
                isShowOTP ?
                    <Otppopup
                        moblieNumber={moblieNumber}
                    /> :
                    null
            }
        </>
    )
}

export async function getServerSideProps(ctx) {
    const {req} = ctx;
    function getDate(obj) {
        let Since = [];
        for (const [key, value] of Object.entries(obj)) {
            const date1 = new Date(value.original_date);
            const date2 = new Date();
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const year = Math.floor(diffDays / 365);
            const month = Math.floor(Math.floor(diffDays % 365) / 30);
            if (year !== 0) {
                // month !== 0 ? SinceDate.push(year.toString() + '.' + month.toString() + 'y') : SinceDate.push(year + 'y')
                Since.push(year + 'y')
            } else if (month !== 0) {
                Since.push(month + 'm')
            } else {
                Since.push(diffDays + 'd')
            }
        }
        return Since
    }



    function getCategory(obj) {
        let cat =[]
        for (const [key, value] of Object.entries(obj)) {
            let category = value?.hot_cat_info?.name ?? value?.new_catidlineage?.val[0][1] ?? ""
            cat.push(category)
        }
        return cat
    }


    let Videos = []
    let SinceDate = []
    let categories = []
    let mobileNumber = null;
    let isBussiness = null;
    try {
        const cookies = parse(req.headers.cookie || '');
        const Curr_JDSID = cookies?.JDSID || cookies?.sid || null;
  const refererLink = ctx?.req?.headers?.host || null;
  const isProduction = refererLink ? refererLink.includes('www.justdial.com') : false;
        let userprofile = cookies["userProfile"];
        let userProfileCookieObj = {}
        try {
            userProfileCookieObj = JSON.parse(userprofile)
        } catch (e) {
            console.log('error', e)
        }

        mobileNumber = userProfileCookieObj?.mobile || null;
        let mobileNumberRegex = new RegExp(/^[6-9]\d{9}$/);
        let isValid = mobileNumberRegex.test(mobileNumber)
        if (!isValid) {
            mobileNumber = null;
        } else {
            const isVerified = await verifyUserSID(Curr_JDSID, mobileNumber);
            if (!isVerified) {
                mobileNumber = null
            }
        }
        let data = new FormData();
            
        let cityUrl = sanitizeParamValue(ctx?.query?.city) || ""
        

        let videoCity = cookies?.main_city || cookies?.scity || cookies?.MP_city ||  cityUrl || "Mumbai"
        const languageQuery = await excuteQuery({query:`SELECT * from tbl_success_stories_language where data_city= ?`,values:[videoCity]} )
             

            const value = languageQuery[0]
            let languages =[value?.priority_lng_1,value?.priority_lng_2,value?.priority_lng_3] // || ["English","Hindi","Bangali"]
            languages = languages.join()

            data.append('hname', 'Success Videos');
            data.append('limit', 'all');
            data.append('debug', '0');
            data.append('city',videoCity)
            data.append('priority_flag', '1')
            data.append('language', `${languages}`)
        
        const videoUrl = `http://snehamalvankar.jdsoftware.jd/cms_api/cms/cms/successStories` 
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${videoUrl}`,
            headers: {
                ...data.getHeaders()
            },
            data: data
        };

        let response = await axios.request(config)
        Videos = await response?.data?.results?.data


        let docid_list = []
        Videos.map((video) => {
            docid_list.push(video.docid)
        })
        
        const splitArr = (arr, chunkSize) => {
            if (chunkSize <= 0) return [];
        
            let i, j, temporary, splitArr = [];
            for (i = 0, j = arr.length; i < j; i += chunkSize) {
                temporary = arr.slice(i, i + chunkSize);
                splitArr.push([...temporary])
            }
            return splitArr;
        
        }
        const splitDocIDArr = splitArr(docid_list, 15)
        const promiseArr = splitDocIDArr.map((docidArr)=> {
            return (async () => {
                const docidStr = docidArr.join(",");
                const resp = await axios.get(``);
                return resp.data;
            })()
        })
        const allResp = await Promise.all(promiseArr)
        allResp.forEach(resp => {
            let date_arr = getDate(resp) || [];
            let category_arr = getCategory(resp) || [];
            date_arr.map((value) =>{
                SinceDate.push(value)
            })
            category_arr.map((value) => {
                categories.push(value)
            })
        })

        if(mobileNumber){    
            const url = `http://${process.env.BUSSINESS_LIST_BASE_URL}/web_services/PhoneSearch.php?phone_nos=${mobileNumber}&lme=1&limit=2000`;
            const bussinessListData = await axios
              .get(url)
              .then((res) => {
                let bussinessListArr = res?.data?.results || [];
                if (!bussinessListArr.length) {
                  isBussiness = false
                }else{
                  isBussiness = true
                }
              })
              .catch((error) => {
                if (error?.data?.results?.length == 0 || error?.data?.error?.msg == 'No Data Found') {
                  isBussiness = false
                }
              });
            }

    } catch (error) {
        console.log(error);

    }
    return {
        props: {
            videos: Videos,
            sinceDate: SinceDate,
            mobileNumber: mobileNumber || null,
            isBussiness : isBussiness,
            categories :categories
        },
    };
}


export default successStories