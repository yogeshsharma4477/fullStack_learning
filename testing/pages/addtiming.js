import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios';
import AddTimming from '@/components/addtiming_new';
import { useDispatch } from 'react-redux'
import { updateCommonValues } from '@/store/Slices/commonDataSlice';


function AddtimingPage(props) {
    const { IP } = props
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(updateCommonValues({ key: 'isCategoryPageLoadCtCalled', value: false}))
        document.cookie = "fromPhoto = false";
        document.cookie = 'timminingBack = false';
        document.cookie = 'isFlow = true';
    },[])

    return (
        <AddTimming
            IP={IP}
        />
    )
}

export async function getServerSideProps(ctx) {
    const {req, res} = ctx
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
            Location: '/Free-Listing' + queryString
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
        redirectTo('/Free-Listing/bussinesslist' + queryString);
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
        return ({ props: { mobileNumber: mobileNumber, userprofile: userprofile, IP: IP } })
    }
    catch (err) {
        console.error("error=>", err)
        return ({ props: { mobileNumber: '' } })
    }
}

export default AddtimingPage;