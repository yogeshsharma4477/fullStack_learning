import React from 'react'
import axios from 'axios';
import PleaseNote from '../components/copyright_infringement'
import { parse } from 'cookie'
import { dc_db } from './api/lib/dc_db';

const PleasenotePage = (props) => {
    let { mobileNumber, sid, shorturl } = props;
    return (
        <PleaseNote 
        mobile={mobileNumber}
        sid={sid}
        shorturl={shorturl}
        />
    )
}

export async function getServerSideProps(ctx) {

    let userAgent = ctx.req.headers['user-agent'];
    let sourceVal = '7'
    if ( /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent) ) {
        sourceVal = '2';
    }
    
    let queryObjTemp = ctx?.query || {};
    if(queryObjTemp.source){
        sourceVal = queryObjTemp['source'];
    }else{
        queryObjTemp['source'] = sourceVal;
    };
    let queryString = ''
    let count = 0;

    for (let key in queryObjTemp){
        if(count==0){
        queryString+=`?`  
        } else if(count>0){
        queryString+=`&`
        }
        queryString+=`${key}=${queryObjTemp[key]}`
        count+=1;
    }
    
    try {
        ctx.req.headers["true-client-ip"] ||
        ctx.req.headers["x-forwarded-for"] ||
        ctx.req.headers["x-real-ip"] ||
        ctx.req.connection.remoteAddress;
        const cookies = parse(ctx.req.headers.cookie || '');
        const cookieObject = ctx.req?.cookies || {};

        let userprofile = cookieObject["userProfile"];
        let isFlowCheck = cookieObject['isFlow'] || 'false';
        let userprofileObj = {}
        try{
        userprofileObj = JSON.parse(userprofile)
        } catch(error){
        console.log("error: " + error)
        userprofileObj = {}
        }

        let userMob = userprofileObj?.mobile || '';
        let mobileNumberRegex = new RegExp(/^[6-9]\d{9}$/);
        let isValid = mobileNumberRegex.test(userMob)
        let docid = cookies.docid || "";
        let sid = cookies.JDSID || '';

        if(!isValid){
            ctx.res.writeHead(302, {
                Location: "/Free-Listing"+ queryString,
            });
            ctx.res.end();
        }
        if (isFlowCheck != 'true') {
            ctx.res.writeHead(302, {
                Location: '/Free-Listing/bussinesslist'+ queryString,
            });
            ctx.res.end()
        }

        if(sourceVal == '1' || sourceVal=='3'){
        dc_db.query(`select * from justdial.tbl_dc_number where type='dce' and mobile=${userMob}`).then((result) => {
            if(result?.length){
            ctx.res.writeHead(302, {
                Location: "https://wap.justdial.com/free_listing.php?old=1&m=1"+ queryString,
            });
            ctx.res.end();
            }
        }).catch((err) => {
            console.error('Error=> ', err)
        })
        }

        let CompanyDetail = `http://192.168.8.12:9001/web_services/CompanyDetails.php?docid=${docid}`
        let shorturl = await axios.get(CompanyDetail);
        shorturl = shorturl.data[docid]?.shorturl || "";
        if(!shorturl) {
            const compData = await axios.get(`http://192.168.20.59:4000/api/comp/get?mod=mongo&fields=shorturl_with_ctid,shorturl&debug=1&rsrc=iro&type=gen_info_id&docid=${docid}`)
            try{
                shorturl = compData?.data?.results?.data[docid]?.shorturl_with_ctid
            } catch(err) {}
        }
        return {
            props: {
                mobileNumber: userMob,
                sid: sid,
                shorturl: shorturl,
                docid: docid
            },
        };
    } catch (e){
        console.log(e,"=====================error pleasenote =================================");
        return ({ props: { mobileNumber: '' } })
    }
}

export default PleasenotePage
