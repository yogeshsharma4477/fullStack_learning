import axios from 'axios'
import { parse } from 'cookie';
import MainCategory from "../components/addCategories"
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { removeCategoryHistoryValues, updateCategoryValues, updateMultipleCategoryValues } from '@/store/Slices/newCategorySlice';
import clickTracker from '@/utils/clickTracker';
import { updateCommonValues } from '@/store/Slices/commonDataSlice';
import { sanitizeParams } from '@/utils/commonFunc';

const AddCategories = (props) => {

  const { mobileNumber, IP, userprofile, } = props;
  const dispatch = useDispatch()
  const [selectedCategoryArr, setSelectedCategoryArr] = useState([])
  const router = useRouter();
  const sourceCode = sanitizeParams(router?.query?.source)
  const docid = useSelector((state) => state.CommonValues?.docid)
  const isFirstClickTrackerCallled = useSelector((store) => store.CommonValues?.isCategoryPageLoadCtCalled)
  function parseCookies() {
    const cookieString = document.cookie;
    const cookiesArray = cookieString.split('; ');
  
    const cookiesObject = {};
  
    for (const cookie of cookiesArray) {
      const [key, value] = cookie.split('=');
      cookiesObject[key] = value;
    }
  
    return cookiesObject;
  }
  

  useEffect(()=>{
    if(!isFirstClickTrackerCallled){
      clickTracker({
        sourceCode: sourceCode || "7",
        docid: docid || "",
        li: 'Category_PL',
        ll: 'NFL_LP',
      })
      dispatch(updateCommonValues({ key: 'isCategoryPageLoadCtCalled', value: true}))
    }else{
      clickTracker({
        sourceCode: sourceCode || "7",
        docid: docid || "",
        li: 'Category_PL_1',
        ll: 'NFL_LP',
      })
    }
    let cokkieString = document?.cookie || '';
    let cokkieObj = parseCookies(cokkieString);
    let isFromPhoto = cokkieObj.fromPhoto=="true";
    // if(isFromPhoto ){
    //   if(cokkieObj.timminingBack=='true'){
    //     router.back();
    //   }else{
    //     document.cookie = 'timminingBack = true';
    //   }
    // }
  },[])

  const reduxCatData = useSelector(state=> state?.newCategoryPageSlice?.currCategoryData);


  useLayoutEffect(()=> {
    if(reduxCatData?.selectedCategoryId?.length > 0){
      setSelectedCategoryArr([...reduxCatData.selectedCategoryId])
    }
  }, [reduxCatData])
  
  // useLayoutEffect(()=>{
  //   setSelectedCategoryArr([...reduxCatData.selectedCategoryId])      
  // }, [reduxCatData])

  // if(history.length>0){
  //   let tempHistoryArr = [...history];
  //   tempHistoryArr.pop()
  //   dispatch(updateMultipleCategoryValues({
  //     history: tempHistoryArr
  //   }))
  // }


  // useEffect(()=>{
  //   let selectedCategoryArr = router?.query?.selectedCategory || null;
  //   if(selectedCategoryArr) {
  //     const decodedData = decodeURIComponent(selectedCategoryArr);

  //     // Decompress the data
  //     // const decompressedData = pako.inflate(decodedData, { to: "string" });
      
  //     // Parse the decompressed JSON string to obtain the original array
  //     const originalLocalSelectedCategories = JSON.parse(decodedData);
  //     setSelectedCategoryArr(originalLocalSelectedCategories)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const userAgent = window.navigator.userAgent;
  //     const isMobile = /Mobi/i.test(userAgent);
  //     const source = isMobile ? 2 : 7;
  //     router.push(
  //       {
  //         pathname: router.pathname,
  //         query: { ...router.query, source },
  //       },
  //       undefined,
  //       { shallow: true }
  //     );
  //   }
  // }, []);



  return (
    <div>
        <MainCategory 
          selectedCategories={selectedCategoryArr}
          IP={IP}
        />
    </div>
  )
};

export async function getServerSideProps(context) {
  const { res, req } = context;
  const cookies = parse(req.headers.cookie || '');
  const userProfileCookie = cookies.userProfile || null;

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

  if (isDirectLoad(req) || req?.headers?.referer.includes('/suggestedcategory')) { 
    redirectTo('/Free-Listing/');
  }

  return {
    props: {
      mobileNumber,
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