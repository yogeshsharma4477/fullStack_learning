import React from 'react'
import ThankYou from '../components/thankyou/thankyou'

function ThankYouPage() {
    return (
        <div>
            <ThankYou />
        </div>
    )
}

// export async function getServerSideProps(ctx) {
    // try {
    //     const cookieObject = ctx.req?.cookies || {};
    //     let userprofile = cookieObject["userProfile"];
    //     if (!userprofile) {
    //         ctx.res.writeHead(302, {
    //             Location: '/listing'
    //         });
    //         ctx.res.end();
    //     } else {
    //         ctx.res.writeHead(302, {
    //             Location: '/listing/bussinesslist'
    //         });
    //         ctx.res.end();
    //     }
    //     if (userprofile) userprofile = JSON.parse(userprofile)
    //     mobileNumber = userprofile?.mobile || ""
    //     return ({ props: { mobileNumber: mobileNumber, userprofile: userprofile } })
    // }
    // catch (err) {
    //     console.error("error=>", err)
    //     return ({ props: { mobileNumber: '' } })
    // }
// }

export default ThankYouPage
