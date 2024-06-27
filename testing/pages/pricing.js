import Features from '@/components/features'
import Getpremium from '@/components/getpremium/getpremium'
import Growbusiness from '@/components/growbusiness'
import Pricing from '@/components/pricing'
import axios from 'axios'
import React from 'react'

export default function GetPremiumPage(props) {
    let { mobile, sid, shorturl, docid } = props
    return (
        <div>
            <Getpremium />
            {/* <Pricing /> */}
            {/* <Getpremium
                mobile={mobile}
                sid={sid}
                shorturl={shorturl}
            /> */}
            {/* <Features /> */}
        </div>
    )
}

export async function getServerSideProps(ctx) {
    try {
        const cookieObject = ctx.req?.cookies || {}
        let sid = cookieObject.JDSID || ''
        let mobile = JSON.parse(cookieObject.userProfile)
            ? JSON.parse(cookieObject.userProfile).mobile
            : ''
        let docid = cookieObject.docid ? cookieObject.docid : ''

        let userprofile = cookieObject['userProfile']
        let isFlowCheck = cookieObject['isFlow'] || 'false'
        if (!userprofile) {
            ctx.res.writeHead(302, {
                Location: '/Free-Listing',
            })
            ctx.res.end()
        }
        // if (isFlowCheck == 'false') {
        //     ctx.res.writeHead(302, {
        //         Location: '/Free-Listing/bussinesslist'
        //     });
        //     ctx.res.end()
        // }

        let CompanyDetail = `http://192.168.8.12:9001/web_services/CompanyDetails.php?docid=${docid}`
        let shorturl = await axios
            .get(CompanyDetail)
            .then((res) => {
                return res.data[docid]?.shorturl || ''
            })
            .catch((err) => {
                return ''
            })
        // if (userprofile) userprofile = JSON.parse(userprofile)
        // let mobileNumber = userprofile?.mobile || ""
        return {
            props: {
                sid: sid,
                mobile: mobile,
                shorturl: shorturl,
                docid: docid,
            },
        }
    } catch (err) {
        console.error('error=>', err)
        return { props: { mobileNumber: '' } }
    }
}
