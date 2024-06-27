import React, { useEffect } from 'react'
import Image from 'next/image'
import styles from "../styles/landing.module.scss"
import Businesslistfree from '../components/businesslistfree'
import Successstories from '../components/successstories'
import Businessliststep from '../components/businessliststep'
import Growbusiness from '../components/growbusiness'
import Gotquestion from '../components/gotquestion'
import Businessprofessional from '../components/businessprofessional'
import Createfreeaccount from '../components/createfreeaccount'
import Otppopup from '../components/otppopup'
import Landingfooter from '../components/landingFooter'
import { useSelector } from 'react-redux'

function Landingpage() {

  const landingPageReduxData = useSelector((state) => {
    const { isShowOTP = false, moblieNumber = "" } = state?.landinfPageSlice || {};
    return {
      isShowOTP, moblieNumber
    }
  })

  const { isShowOTP, moblieNumber } = landingPageReduxData;

  return (
    <>
      <div className={`${styles.landing}`}>
        <Businesslistfree />
        <Successstories />
        <Businessliststep />
        <Growbusiness />
        <Gotquestion />
        <Businessprofessional />
        <Createfreeaccount />
        {
          isShowOTP ?
            <Otppopup
              moblieNumber={moblieNumber}
            /> :
            null
        }
      </div>
      <Landingfooter />
    </>
  )


}

export async function getServerSideProps(ctx) {

  let IP = "";
  try {



    IP =
      ctx.req.headers["x-forwarded-for"] ||
      ctx.req.headersqueryString["x-true-client-ip"] ||
      ctx.req.headers["x-real-ip"] ||
      ctx.req.connection.remoteAddress;
    const cookieObject = ctx.req?.cookies || {};
    let userprofile = cookieObject["userProfile"];
    if (userprofile) {
      ctx.res.writeHead(302, {
        Location: "/Free-Listing/bussinesslist" + queryString,
      });
      ctx.res.end();
    }
    return {
      props: {

      },
    };
  } catch (err) {
    console.error("error=>", err);
    return { props: {} };
  }
}
export default Landingpage;