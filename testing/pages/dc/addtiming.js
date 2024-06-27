import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios';
import AddTimming from '@/components/addtiming_new';
import { useDispatch, useSelector } from 'react-redux'
import { updateCommonValues } from '@/store/Slices/commonDataSlice';
import { useRouter } from 'next/router';
import { sanitizeParams } from '@/utils/commonFunc';
import { handleDcLogData } from '@/components/DC/commonAPI';


function AddtimingPage(props) {
    const { mobileNumberVal, IP } = props
    const dispatch = useDispatch()

    const router = useRouter();

    let lat = sanitizeParams(router?.query?.lat) || ""
    let long = sanitizeParams(router?.query?.long) || ""
    let sourceCode = sanitizeParams(router?.query?.source) || ""
    const docid = useSelector((state) => state.CommonValues?.docid || '')
    const city = useSelector(state => state?.dcLandingSlice?.city || '')
    async function logWorker(type, docid = "") {
        let postLogValue = {
            sourceCode,
            lat,
            long,
            clickType: type,
            IP,
            mobile: mobileNumberVal,
            docid: docid,
            city: city || "",
            current_url: window.location.href,
            navigator: navigator.userAgent,
        }
        try {
            await handleDcLogData(postLogValue)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        logWorker("load", docid || "").then(() => { }).catch(e => { console.log(e.message) })
    }, [])

    const handleBackButtonPress = () => {
        if (router?.pathname?.includes('/dc')) {
            window.location.href = '/Free-Listing/dc' + window.location.search
        }
    };

    useEffect(() => {
        window.addEventListener('popstate', handleBackButtonPress);
        return () => {
            window.removeEventListener('popstate', handleBackButtonPress);
        };
    }, []);

    useEffect(() => {
        dispatch(updateCommonValues({ key: 'isCategoryPageLoadCtCalled', value: false }))
        document.cookie = "fromPhoto = false";
        document.cookie = 'timminingBack = false';
        document.cookie = 'isFlow = true';
    }, [])

    return (
        <AddTimming
            IP={IP}
            logWorker={logWorker}
        />
    )
}

export async function getServerSideProps(ctx) {
    const { req, res } = ctx
    function isDirectLoad(request) {
        return !request.headers.referer;
    }
    function redirectTo(location) {
        res.setHeader('Location', location);
        res.statusCode = 302;
        res.end();
    }
    let userAgent = ctx.req.headers['user-agent']
    let sourceVal = '77'
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        sourceVal = '2';
    }
    let queryObjTemp = ctx?.query || {};
    let queryString = ''
    let count = 0;
    for (let key in queryObjTemp) {
        if (count == 0) {
            queryString += `?`
        } else if (count > 0) {
            queryString += `&`
        }
        if (key === 'source') {
            if (queryObjTemp[key]) {
                queryString += `${key}=${queryObjTemp[key]}`
            } else {
                queryString += `${key}=${sourceVal}`
            }
        }
        count += 1;
    }

    const cookieObject = ctx.req?.cookies || {};
    let userprofile = cookieObject["userProfile"];
    let isFlowCheck = cookieObject['isFlow'] || 'false'

    /* This code is checking if the `userProfile` cookie is present in the request object (`ctx.req`) and
    if it is not present, it redirects the user to the `/Free-Listing` page. */
    if (!ctx.req?.cookies?.userProfile) {
        ctx.res.writeHead(302, {
            Location: '/Free-Listing/dc' + queryString
        });
        ctx.res.end()
    }
    // if (isFlowCheck == 'false') {
    //     ctx.res.writeHead(302, {
    //         Location: '/Free-Listing/bussinesslist' + queryString
    //     });
    //     ctx.res.end()
    // }

    if (isDirectLoad(req)) {
        redirectTo('/Free-Listing/dc/' + queryString);
    }


    let IP = ctx.req.headers["true-client-ip"] || ctx.req.headers["x-forwarded-for"] || ctx.req.headers["x-real-ip"] || ctx.req.connection.remoteAddress;
    try {
        let ip_url = `https://geolocation-db.com/json/`
        if (!IP) {
            IP = await axios.get(ip_url)
                .then(res => {
                    return res?.data?.IPv4 || ""
                })
                .catch(err => {
                    return ""
                })
        }

        if (userprofile) userprofile = JSON.parse(userprofile)
        let mobileNumber = userprofile?.mobile || ""
        return ({ props: { mobileNumberVal: mobileNumber, userprofile: userprofile, IP: IP } })
    }
    catch (err) {
        console.error("error=>", err)
        return ({ props: { mobileNumber: '' } })
    }
}

export default AddtimingPage;