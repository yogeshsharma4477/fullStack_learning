import { parse } from 'cookie';
import axios from 'axios'
import SuggestedCategory from '@/components/NewCategoryFlow/Suggestions';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { removeCategoryHistoryValues, updateCategoryValues } from '@/store/Slices/newCategorySlice';

 
function SuggestedCategoriesPage(props) {

  useEffect(() => {
    document.cookie = "isFlow = false";
  },[])

  const [suggestedCategoriesData, setSuggestedCategoriesData] = useState([])
  const [currentCatID, setCurrentCatID] = useState('')


  const { } = props;
  const [selectedCategoriesArr, setselectedCategoriesArr] = useState([])
  const router = useRouter();

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
  

  // useEffect(()=>{
  //   let cokkieString = document?.cookie || '';
  //   let cokkieObj = parseCookies(cokkieString);
  //   let isFromPhoto = cokkieObj.fromPhoto=="true";
  //   if(isFromPhoto ){
  //     if(cokkieObj.timminingBack=='true'){
  //       router.back();
  //     }else{
  //       document.cookie = 'timminingBack = true';
  //     }
  //   }
  // },[])

  const suggestedCategoryReduxData = useSelector(state=> state?.newCategoryPageSlice?.suggestedCategoryData);

  const firstTime = useRef(true)
  const dispatch = useDispatch()
  const isBackwardNavigation = useRef(false);

  const [previousRoute, setPreviousRoute] = useState('');

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      // If it's not a shallow route change, update the previous route
      if (!shallow) {
        setPreviousRoute(router.asPath);
      }

      // Check if it's a back navigation
      if (previousRoute && previousRoute !== router.asPath) {
        // Run your logic here, e.g., dispatching a Redux action
        // dispatchReduxAction();
        console.log("prathmesh")
      }
    };

    // Listen for the 'routeChangeComplete' event
    router.events.on('routeChangeComplete', handleRouteChange);

    // Clean up the event listener on component unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.asPath, previousRoute]);




  

  useLayoutEffect(()=> {
    if(suggestedCategoryReduxData.hasOwnProperty('suggestedCatList')){
      setSuggestedCategoriesData([...suggestedCategoryReduxData.suggestedCatList])
      setselectedCategoriesArr([...suggestedCategoryReduxData.selectedCategoryId])
      setCurrentCatID(suggestedCategoryReduxData.currCatID)
    }
  }, [suggestedCategoryReduxData])

  return (
    <div>
        <SuggestedCategory
          SuggestedCategoriesData={suggestedCategoriesData}
          currentCategoryID={currentCatID}
          selectedCategories={selectedCategoriesArr}
        />
    </div>
  )
};


export async function getServerSideProps({ res, req, query }) {
  const { searchTerm, ncid, selectedCount = 0 } = query;

  const cookies = parse(req.headers.cookie || '');
  const userProfileCookie = cookies.userProfile || null;
  const isFlow = cookies['isFlow'] || 'false';
  const isValidUser = validateUser(cookies, userProfileCookie, res);
  if (!isValidUser) return { props: {} };

  const IP =
    req.headers['x-real-ip'] ||
    req.headers['x-true-client-ip'] ||
    req.connection.remoteAddress ||
    req.headers['x-forwarded-for'] ||
    '';

  const userProfile = parseJson(userProfileCookie);
  const mobileNumber = userProfile?.mobile || '';

  const isValidMobileNumber = validateIndianMobileNumber(mobileNumber, res);
  if (!isValidMobileNumber) return { props: {} };
  
  const limitIncrement = 4;
  let limit_count = limitIncrement;

  if (Number(selectedCount)) {
    limit_count += Number(selectedCount);
  } else {
    limit_count += 1;
  }

  const queyParamObj = {
    city: 'mumbai',
    limit: limit_count,
    cname: searchTerm,
    national_catid: ncid,
    all_cat: 1,
  };

  console.log("----------------------")
  console.log(queyParamObj, "queyParamObj")
  console.log("----------------------")

  const response =  []
  // await axios.get(process.env.SUB_CATEGORY, {
  //   params: queyParamObj,
  // });

  const suggetionCategoryArr = response?.data?.results?.length
    ? response?.data?.results
    : [];

    console.log("----------------------")
    console.log(suggetionCategoryArr)

  if (isFlow !== 'true') {
    redirectTo('/Free-Listing/', res);
  }

  return {
    props: {
      mobileNumber,
      IP,
      userprofile: userProfile,
    },
  };


function validateUser(cookies, userProfileCookie, res) {
  if (!userProfileCookie) {
    redirectTo('/Free-Listing/', res);
    return false;
  }
  return true;
}

function validateIndianMobileNumber(mobile, res) {
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    redirectTo('/Free-Listing/', res);
    return false;
  }
  return true;
}

function isDirectLoad(request) {
  return !request.headers.referer;
}

function redirectTo(location, res) {
  res.setHeader('Location', location);
  res.statusCode = 302;
  res.end();
}

function parseJson(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}
}


export default SuggestedCategoriesPage;

