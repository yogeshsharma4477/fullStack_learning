import Getpremium from '@/components/getpremium/getpremium_new'
import axios from 'axios';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { parse } from 'cookie';
import { useRouter } from "next/router";


export default function GetPremiumPage(props) {

  const router = useRouter()
  const handleBackButtonPress = () => {
    router.push(
      {
        pathname: '/bussinesslist',
        query: router?.query || {},
      }
    );
  };

  useEffect(() => {
    window.addEventListener('popstate', handleBackButtonPress);
    return () => {
      window.removeEventListener('popstate', handleBackButtonPress);
    };
  }, []);

  useEffect(() => {
    document.cookie = "isFlow = false";
  }, [])

  let { mobileNumber, sid, shorturl } = props;
  const docid = useSelector((state) => state.CommonValues.docid);
  return (
    <>
      <Getpremium
        mobile={mobileNumber}
        sid={sid}
        shorturl={shorturl}
        docid={docid}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  const { res, req } = context;
  const cookies = parse(req.headers.cookie || '');
  const userProfileCookie = cookies.userProfile || null;
  let sid = cookies.JDSID || '';
  let docid = cookies.docid || "";
  // let isFlowCheck = cookies['isFlow'] || 'false';
  let queryParamsString =  new URLSearchParams(req?.query || {});
  queryParamsString = queryParamsString.toString();


  if (!userProfileCookie) {
    redirectTo('/Free-Listing/');
  }

  let IP =
    req.headers['x-real-ip'] ||
    req.headers['x-true-client-ip'] ||
    req.connection.remoteAddress ||
    req.headers['x-forwarded-for'] ||
    '';

  const userProfile = parseJson(userProfileCookie);
  const mobileNumber = userProfile?.mobile || '';

  if (!isValidIndianMobileNumber(mobileNumber)) {
    redirectTo('/Free-Listing/');
  }

  // if (isDirectLoad(req)) {
  //   redirectTo('/Free-Listing/');
  // }
  
  let CompanyDetail = ''
  let shorturl = await axios.get(CompanyDetail);
  shorturl = shorturl.data[docid]?.shorturl || null;
  if(!shorturl) {
    let reqParamsList = 'docid,addinfo,national_catidlineage,national_catidlineage_block,shorturl,shorturl_with_ctid'
    const url = ''
    let queryObj = {
        mod: 'mongo',
        fields: reqParamsList,
        debug:'1', 
        rsrc: 'iro',
        type:'gen_info_id',
        docid:docid
    }
    const compData = await axios.get(url, {params: queryObj})
    try{
      shorturl = compData?.data?.results?.data[docid]?.shorturl_with_ctid 
    } catch(err) {}
  }



  return {
    props: {
      mobileNumber,
      IP,
      userprofile: userProfile,
      sid: sid,
      shorturl: shorturl,
      docid: docid
    },
  };

  function redirectTo(location) {
    res.setHeader('Location', location+'?'+queryParamsString);
    res.statusCode = 302;
    res.end();
  }

  function isDirectLoad(request) {
    return !request.headers.referer;
  }



  function parseJson(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  }

  function isValidIndianMobileNumber(mobile) {
    return /^[6-9]\d{9}$/.test(mobile);
  }
}
