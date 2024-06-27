import { parse } from 'cookie';
import MainCategory from "@/components/addCategories"
import { useEffect, useLayoutEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import { sanitizeParams } from '@/utils/commonFunc';
import { handleDcLogData } from '@/components/DC/commonAPI';

const AddCategories = (props) => {

  const { mobileNumberVal, IP } = props;
  const [selectedCategoryArr, setSelectedCategoryArr] = useState([])
  const reduxCatData = useSelector(state => state?.newCategoryPageSlice?.currCategoryData);

  const router = useRouter();

  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  let sourceCode = sanitizeParams(router?.query?.source) || ""
  const docid = useSelector((state) => state.CommonValues?.docid || '')
  const city = useSelector(state => state?.dcLandingSlice?.city || '')
  async function logWorker(type, docid = "") {
    let postLogValue = {
      sourceCode,
      lat,
      long,
      clickType: type,
      IP,
      mobile: mobileNumberVal,
      docid: docid,
      city: city || "",
      current_url: window.location.href,
      navigator: navigator.userAgent,
    }
    try {
      await handleDcLogData(postLogValue)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    logWorker("load", docid || "").then(() => { }).catch(e => { console.log(e.message) })
  }, [])


  useLayoutEffect(() => {
    if (reduxCatData?.selectedCategoryId?.length > 0) {
      setSelectedCategoryArr([...reduxCatData.selectedCategoryId])
    }
  }, [reduxCatData])


  return (
    <div>
      <MainCategory
        selectedCategories={selectedCategoryArr}
        IP={IP}
        logWorker={logWorker}
      />
    </div>
  )
};

export async function getServerSideProps(context) {
  const { res, req } = context;
  const cookies = parse(req.headers.cookie || '');
  const userProfileCookie = cookies.userProfile || null;

  if (!userProfileCookie) {
    redirectTo('/Free-Listing/dc');
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
    redirectTo('/Free-Listing/dc');
  }

  if (isDirectLoad(req)) {
    redirectTo('/Free-Listing/dc');
  }

  return {
    props: {
      mobileNumberVal: mobileNumber,
      IP,
      userprofile: userProfile,
    },
  };

  function redirectTo(location) {
    res.setHeader('Location', location);
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

export default AddCategories;