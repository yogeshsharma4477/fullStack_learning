/**
 * This function returns the component Addnewbusiness to be rendered on the AddNewBussinessPage.
 * @returns The `Addnewbusiness` component is being returned.
 */

/* This code is importing necessary modules and components for the `AddNewBussinessPage` component. */
import React, { useEffect, useRef } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import Addnewbusiness from "../components/addnewbusiness";
import { updateMultipleCommonValues } from "@/store/Slices/commonDataSlice";
import { useDispatch } from "react-redux";
import { hotleadApiCall } from "@/utils/api";
import { sanitizeParams } from "@/utils/commonFunc";

function AddNewBussinessPage({ IP, mobileNumber, JDSID }, props) {
    const router = useRouter()
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(
            updateMultipleCommonValues({
                mobileNumber: mobileNumber
            })
        )
        document.cookie = `sid=${JDSID}`
    }, [])

    const setSourceQuery = () => {
        let userAgent = navigator?.userAgent;
        let sourceVal = '7'
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
            sourceVal = '2';
        }
        let queryObj = router.query;
        queryObj.source = sourceVal;
        router.push({
            pathname: '/addnewbussiness',
            query: queryObj
        },
            undefined, { shallow: true }
        )
    }

    useEffect(() => {
        let isSourcePresent = sanitizeParams(router?.query?.source)?.length || false
        if (isSourcePresent) setSourceQuery();
    }, []);


    return (
        <Addnewbusiness
            userProfile={props}
            IP={props.IP}
        />
    )
}

export async function getServerSideProps(ctx) {

    let userAgent = ctx.req.headers['user-agent'];
    let sourceVal = '7';
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        sourceVal = '2';
    }

    let queryObjTemp = ctx?.query || {};
    if (queryObjTemp.source) {
        sourceVal = queryObjTemp['source'];
    } else {
        queryObjTemp['source'] = sourceVal;
    };
    let queryString = ''
    let count = 0;

    for (let key in queryObjTemp) {
        if (count == 0) {
            queryString += `?`
        } else if (count > 0) {
            queryString += `&`
        }
        queryString += `${key}=${queryObjTemp[key]}`
        count += 1;
    }

    try {
        ctx.req.headers["true-client-ip"] ||
        ctx.req.headers["x-forwarded-for"] ||
        ctx.req.headers["x-real-ip"] ||
        ctx.req.connection.remoteAddress;
        const cookieObject = ctx.req?.cookies || {};

        let userprofile = cookieObject["userProfile"];
        let userprofileObj = {}
        try {
            userprofileObj = JSON.parse(userprofile)
        } catch (error) {
            console.log("error: " + error)
            userprofileObj = {}
        }

        let userMob = userprofileObj?.mobile || '';
        let mobileNumberRegex = new RegExp(/^[6-9]\d{9}$/);
        let isValid = mobileNumberRegex.test(userMob)
        let JDSIDVal = cookieObject["JDSID"];

        if (!isValid) {
            ctx.res.writeHead(302, {
                Location: "/Free-Listing" + queryString,
            });
            ctx.res.end();
        }

        let ip_url = `https://geolocation-db.com/json/`
        let IP = await axios.get(ip_url)
            .then(res => {
                return res?.data?.IPv4 || ""
            })
            .catch(err => {
                return ""
            })

        if (sourceVal == '1' || sourceVal == '3') {
            dc_db.query(`select * from justdial.tbl_dc_number where type='dce' and mobile=${userMob}`).then((result) => {
                if (result?.length) {
                    ctx.res.writeHead(302, {
                        Location: "https://wap.justdial.com/free_listing.php?old=1&m=1" + queryString,
                    });
                    ctx.res.end();
                }
            }).catch((err) => {
                console.error('Error=> ', err)
            })
        }

        return {
            props: {
                mobileNumber: userMob,
                IP: IP,
                JDSID: JDSIDVal
            },
        };
    } catch {
        return ({ props: { mobileNumber: '', IP: '', JDSID: JDSIDVal } })
    }
}

export default AddNewBussinessPage;
