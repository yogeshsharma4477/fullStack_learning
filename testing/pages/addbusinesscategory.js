import axios from 'axios'
import { parse } from 'cookie';
import MainCategory from "../components/addCategories"
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";


const AddBusinessCategories = (props) => {
 
  const { mobileNumber, IP, userprofile, } = props;

  const [selectedCategoryArr, setSelectedCategoryArr] = useState([])
  const router = useRouter();
    
  
  useEffect(()=>{
    let selectedCategoryArr = router?.query?.selectedCategory || null;
    if(selectedCategoryArr) {
      const decodedData = decodeURIComponent(selectedCategoryArr);

      // Decompress the data
      // const decompressedData = pako.inflate(decodedData, { to: "string" });
      
      // Parse the decompressed JSON string to obtain the original array
      const originalLocalSelectedCategories = JSON.parse(decodedData);
      setSelectedCategoryArr(originalLocalSelectedCategories)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      const isMobile = /Mobi/i.test(userAgent);
      const source = isMobile ? 2 : 7;
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, source },
        },
        undefined,
        { shallow: true }
      );
    }
  }, []);



  return (
    <div>
        <MainCategory 
        //   selectedCategories={selectedCategoryArr}
        //   IP={IP}
        />
    </div>
  )
};

// export async function getServerSideProps(context) {
//   const { res, req } = context;
//   const cookies = parse(req.headers.cookie || '');
//   const userProfileCookie = cookies.userProfile || null;

//   if (!userProfileCookie) {
//     redirectTo('/Free-Listing/');
//   }

//   let IP =
//     req.headers['x-real-ip'] ||
//     req.headers['x-true-client-ip'] ||
//     req.connection.remoteAddress ||
//     req.headers['x-forwarded-for'] ||
//     '';

//   const userProfile = parseJson(userProfileCookie);
//   const mobileNumber = userProfile?.mobile || '';

//   if (!isValidIndianMobileNumber(mobileNumber)) {
//     redirectTo('/Free-Listing/');
//   }

//   if (isDirectLoad(req)) {
//     redirectTo('/Free-Listing/');
//   }

//   return {
//     props: {
//       mobileNumber,
//       IP,
//       userprofile: userProfile,
//     },
//   };

//   function redirectTo(location) {
//     res.setHeader('Location', location);
//     res.statusCode = 302;
//     res.end();
//   }

//   function isDirectLoad(request) {
//     return !request.headers.referer;
//   }

//   function parseJson(jsonString) {
//     try {
//       return JSON.parse(jsonString);
//     } catch (error) {
//       return null;
//     }
//   }

//   function isValidIndianMobileNumber(mobile) {
//     return /^[6-9]\d{9}$/.test(mobile);
//   }
// }

export default AddBusinessCategories;