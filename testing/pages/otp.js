import Otp from "@/components/otp";
import { useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import { sanitizeParams } from "@/utils/commonFunc";

export default function OTP() {

  const router = useRouter()
  const setSourceQuery = () => {
    let userAgent = navigator?.userAgent;
    let sourceVal = '7'
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      sourceVal = '2';
    }
    let queryObj = router.query;
    queryObj.source = sourceVal;
    router.push({
      pathname: '/otp',
      query: queryObj
    },
      undefined, { shallow: true }
    )
  }


  useEffect(() => {
    let isSourcePresent = sanitizeParamValue(sanitizeParams(router?.query?.source))?.length || false
    if (!isSourcePresent) setSourceQuery();
  }, []);


  useEffect(() => {
    if ("OTPCredential" in window) {
      window.addEventListener("DOMContentLoaded", (e) => {
        const input = document.querySelector(
          'input[autocomplete="one-time-code"]'
        );
        if (!input) return;
        const ac = new AbortController();
        const form = input.closest("form");
        if (form) {
          form.addEventListener("submit", (e) => {
            ac.abort();
          });
        }
        navigator.credentials
          .get({
            otp: { transport: ["sms"] },
            signal: ac.signal,
          })
          .then((otp) => {
            alert("apple", otp);
            //   input.value = otp.code;
            //   if (form) form.submit();
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  }, []);

  return <Otp />;
}

export async function getServerSideProps(ctx) {

  let IP = "";
  let mobileNumber = "";
  try {

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
          if (key !== undefined) {
            queryString += `${key}=${sourceVal}`
          }
        }
      } else {
        if (key !== undefined) {
          queryString += `${key}=${queryObjTemp[key]}`
        }
      }
      count += 1;
    }


    IP =
      ctx.req.headers["x-forwarded-for"] ||
      ctx.req.headersqueryString["x-true-client-ip"] ||
      ctx.req.headers["x-real-ip"] ||
      ctx.req.connection.remoteAddress;
    const cookieObject = ctx.req?.cookies || {};
    let userprofile = cookieObject["userProfile"];
    if (!userprofile) {
      ctx.res.writeHead(302, {
        Location: "/Free-Listing",
      });
      ctx.res.end();
    }
    if (userprofile) userprofile = JSON.parse(userprofile);

    if (userprofile && JSON.stringify(queryString) !== '{}') {
      ctx.res.writeHead(302, {
        Location: "/Free-Listing/bussinesslist" + queryString,
      });
      ctx.res.end();
    }

    mobileNumber = userprofile?.mobile || "";

    const url = `http://${process.env.BUSSINESS_LIST_BASE_URL}/web_services/PhoneSearch.php?phone_nos=${mobileNumber}&lme=1&limit=200`;

    const bussinessListData = await axios
      .get(url)
      .then((res) => {
        if (res?.data?.error?.code == 1) throw res;
        return res?.data?.results || [];
      })
      .catch((error) => {
        throw error;
      });
    return {
      props: {
        businessList: bussinessListData,
        mobileNumber: mobileNumber,
        IP: IP,
      },
    };
  } catch (err) {
    console.error("error=>", err);
    return { props: { businessList: [], mobileNumber: mobileNumber, IP: IP } };
  }
}
