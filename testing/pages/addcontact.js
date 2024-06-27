import React from 'react'
import axios from 'axios';
import AddContact from '../components/addcontact/index'

const AddContactPage = (props) => {
    return (
        <AddContact
            userProfile={props}
        />
    )
}


export async function getServerSideProps(ctx) {
    let mobileNumber = ""
    let IP = ctx.req.headers["true-client-ip"] || ctx.req.headers["x-forwarded-for"] || ctx.req.headers["x-real-ip"] || ctx.req.connection.remoteAddress;
    try {
        const cookieObject = ctx.req?.cookies || {};
        let userprofile = cookieObject["userProfile"];
        let isFlowCheck = cookieObject['isFlow'] || 'false';
        if (userprofile) userprofile = JSON.parse(userprofile)
        if (!userprofile) {
            ctx.res.writeHead(302, {
                Location: '/Free-Listing'
            });
            ctx.res.end();
        }
        if (isFlowCheck == 'false') {
            ctx.res.writeHead(302, {
                Location: '/Free-Listing/bussinesslist'
            });
            ctx.res.end()
        }

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

        mobileNumber = userprofile?.mobile || ""
        return ({ props: { mobileNumber: mobileNumber, userprofile: userprofile, IP: IP } })
    }
    catch (err) {
        console.error("error=>", err)
        return ({ props: { mobileNumber: mobileNumber } })
    }
}

export default AddContactPage
