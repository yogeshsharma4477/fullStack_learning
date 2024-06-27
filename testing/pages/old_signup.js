import Landingfooter from "@/components/landingFooter";
import Signup from "@/components/signup";
var CryptoJS = require("crypto-js");
import { useRouter } from 'next/router';
import { useEffect } from "react";
import Landingpage from "../components/landing";
import { sanitizeParams } from "@/utils/commonFunc";



function Home(props) {

    const router = useRouter()

    const setSourceQuery = () => {
        let userAgent = navigator?.userAgent;
        let sourceVal = '7'
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
            sourceVal = '2';
        }
        let queryObj = router.query;
        if (!queryObj.source) queryObj.source = sourceVal;
        router.push({
            pathname: '/',
            query: queryObj
        },
            undefined, { shallow: true }
        )
    }


    useEffect(() => {
        let isSourcePresent = sanitizeParamValue(sanitizeParams(router?.query?.source))?.length || false
        if (!isSourcePresent) setSourceQuery();
    }, []);


    return (
        <>
            <Signup {...props} />
        </>
    );
}

export async function getServerSideProps(ctx) {

    /* This code is checking the user agent string of the incoming request and setting the `sourceVal`
    variable to either `'7'` or `'2'` based on whether the user agent string matches a regular
    expression pattern that identifies mobile devices. If the user agent string matches the pattern,
    `sourceVal` is set to `'2'`, otherwise it is set to `'7'`. */
    let userAgent = ctx.req.headers['user-agent']
    let sourceVal = '7'
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        sourceVal = '2';
    }

    /* This code is creating a query string based on the `ctx.query` object. It first initializes an
    empty object `queryObjTemp` if `ctx.query` is undefined or null. Then it initializes an empty
    string `queryString`. It then loops through each key in `queryObjTemp` and checks if the key is
    equal to `'source'`. If it is, it adds the key-value pair to the `queryString`. If the value of
    `'source'` is not defined, it uses the `sourceVal` variable instead. The resulting `queryString`
    will be used in a redirect later in the code. */
    let queryObjTemp = ctx?.query || {};
    let queryString = ''
    queryString = new URLSearchParams(queryObjTemp).toString()


    /* This code is checking if the user has a `userProfile` cookie and if it contains a `mobile`
    property. If it does, it redirects the user to the `/Free-Listing/bussinesslist` page with a query
    string `queryString`. The `ip` variable is set to the IP address of the incoming request, and the
    `cookieObject` variable is set to the cookies of the incoming request. The `userprofile` variable
    is set to the value of the `userProfile` cookie. */
    const ip = ctx.req.headers["x-real-ip"] || ctx.req.connection.remoteAddress;
    let cookieObject = ctx.req.cookies || {};
    let userprofile = cookieObject["userProfile"];

    if (userprofile && JSON.stringify(queryString) !== '{}') {
        ctx.res.writeHead(302, {
            Location: "/Free-Listing/bussinesslist?" + queryString,
        });
        ctx.res.end();
    }

    /* This code is extracting information from the incoming request's cookies and query parameters to
    create a `userInfo` object. */
    let queryObj = ctx.query;
    let source = queryObj?.source || sourceVal;

    let deviceid =
        source == "2" || source == "52"
            ? cookieObject["deviceId"]
            : cookieObject["_ctok"];
    let usersid = cookieObject["sid"] || cookieObject["JDSID"];
    let userInfo = null;
    let city = null;

    let usermobile = "";
    if (userprofile !== undefined && userprofile !== null && userprofile !== "") {
        userprofile = decodeURIComponent(userprofile);
        var logresponse = JSON.parse(userprofile);
        if (
            logresponse &&
            logresponse != "" &&
            logresponse.mobile !== undefined &&
            logresponse.mobile !== ""
        ) {
            usermobile = logresponse.mobile;
        }
    }
    if (usermobile && usersid && deviceid) {
        userInfo = {
            sid: decodeURIComponent(usersid),
            mobile: usermobile,
            userprofile: userprofile,
            deviceId: deviceid,
            version: "",
            source,
        };
    }

    city = cookieObject.main_city ? cookieObject.main_city : null

    return {
        props: {
            IP: ip,
            userInfo: userInfo,
            source: source,
            city: city
        },
    };
}

export default Home;
