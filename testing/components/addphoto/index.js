import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "./addphoto.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateMultipleAddPhotoValues } from "@/store/Slices/AddPhotoSlice";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import { checkForCameraPermissions, getImageResolution } from "@/utils/validations";
import { Android_CODE_ARR, IOS_CODE_ARR, clickTracker, sanitizeParams, setCookie, set_cookie } from "@/utils/commonFunc";
import { trackingDashboardAPI } from "@/utils/api";

let imageValidationErrorMessage = {
  1: "Maximum 10 Images Can be Uploaded in One Instance",
  2: "Please Upload a Photo with Maximum File Size of 10 MB",
  3: "Please Upload a Photo with Minimum Resolution of 650 px X 650 px",
  4: "Invalid File Upload. Please Upload Photo File Ending with JPG, JPEG, PNG, WEBP and HIEC Format Only"
}

export default function Addphoto(props) {
  const MobileCookie = props?.userProfile?.mobileNumber;
  const { logWorker } = props
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState({
    errFlag: false,
    errMsg: "",
  });
  const source = router.query.source;
  const commonValues = useSelector((state) => state.CommonValues);
  const cityRedux = useSelector((state) => state.Address.city);
  const imageUploadStatusArr = useRef([])
  const imagesArr = useRef([])
  const imgReducerData = useSelector(state => state.AddPhotoData)
  const [toastErrMsg, setToastErrMsg] = useState('')
  const imageUploadRef = useRef(null)
  const dispatch = useDispatch()
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [triggerUpdate, setTriggerUpdate] = useState(0)
  const StoreCommonInfo = useSelector((state) => state.CommonValues);
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [imgErrorIndex, setImgErrorIndex] = useState([])
  const [minimumResolutionIndex, setMinimumResolutionIndex] = useState([])
  const sourceCode = sanitizeParams(router?.query?.source)
  const isCopyright_infringement = useSelector((state) => state.CommonValues?.isCopyright_infringement)
  const cityParams = router?.query?.city
  const cityCookie = props?.userProfile?.city
  const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
  const IP = useSelector((state) => state.CommonValues?.ip || '')
  const city = useSelector((state) => state.Address.city);
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  const vendor_mobile = useSelector(state => state?.dcLandingSlice?.mobile_number)
  const isDcFlow = router?.pathname?.includes('/dc')
  const ExampleImageArr = [
    {
      id: 1,
      caption: "Example 1",
      imageUrl: "http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/sample1.png"
    },
    {
      id: 2,
      caption: "Example 2",
      imageUrl: "http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/sample2.png"
    },
    {
      id: 3,
      caption: "Example 3",
      imageUrl: "http://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/sample3.png"
    },
  ]

  const saveAndContinue = async (event) => {
    setLoader(true);
    event.preventDefault();

    //click tracker implementaion
    const sourceCode = sanitizeParams(router?.query?.source)
    clickTracker({
      sourceCode: sourceCode,
      docid: StoreCommonInfo?.docid,
      li: 'FL_Photo_Submit',
      ll: 'FL_StoreImages'
    })
    dispatch(updateCommonValues({ key: "contactDetailProgress", value: 100 }))
    await onSubmit(event);
  };

  const removeImages = (e, index) => {
    e.preventDefault()
    //click tracker implementaion
    clickTracker({
      sourceCode: sourceCode,
      docid: StoreCommonInfo?.docid,
      li: 'FL_DeleteImage',
      ll: 'FL_StoreImages'
    })

    imagesArr.current[index] = null;
    forceUpdate();
  };

  useEffect(() => {
    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'load',
      IP: IP || "",
      trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
      mobile: StoreCommonInfo?.mobileNumber || "",
      docid: StoreCommonInfo?.docid || "",
      sessionId: sesionId || "",
      city: city || cityCookie || cityParams || ""
    }
    if(!isDcFlow){
      trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    }
    document.cookie = "isFlow= false"
    clickTracker({
      sourceCode: sourceCode,
      docid: StoreCommonInfo?.docid,
      li: 'Add_Photos_Pageload',
      ll: 'NFL_LP'
    })
  }, [])

  const onSubmit = async (e) => {
    let isCheck = imageUploadStatusArr.current.includes(false);
    if (isCheck) {
      setLoader(false)
      setToastErrMsg("Wait photo is uploading.");
    } else {
      let trackingDataPayload = {
        source: sourceCode,
        clickType: 'click',
        IP: IP || "",
        trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
        mobile: StoreCommonInfo?.mobileNumber || "",
        docid: StoreCommonInfo?.docid || "",
        sessionId: sesionId || "",
        city: city || cityCookie || cityParams || ""
      }
      if(!isDcFlow){
        await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
      }

      dispatch(
        updateMultipleAddPhotoValues({
          "imageArr": imagesArr.current || [],
          "imageStatusArr": imageUploadStatusArr.current || []
        })
      )
      if (isNoImage()) {
        clickTracker({
          sourceCode: sourceCode,
          docid: StoreCommonInfo?.docid,
          li: 'Add_Photos_Skip',
          ll: 'NFL_LP'
        })
      } else {
        clickTracker({
          sourceCode: sourceCode,
          docid: StoreCommonInfo?.docid,
          li: 'Add_Photos_Submit',
          ll: 'NFL_LP'
        })
      }
      document.cookie = "isFlow= true"
      let query = router?.asPath || ''
      query = query.split('?')
      if (query.length) query = '?' + query[1]
      if (isDcFlow) {
        try {
          await logWorker('click', StoreCommonInfo?.docid)
        } catch (error) {
          console.log(error.message)
        }

        router.push('/dc/thankyou' + query)
      } else if (isCopyright_infringement) {
        router.push('/pleasenote' + query)
      } else {
        router.push("/getpremium" + query);
      }

    }
  };

  useEffect(() => {
    if (!isImageUploaded) return;
    imageValidation()
    setIsImageUploaded(false);
  }, [isImageUploaded])


  useEffect(() => {
    document.cookie = "isFlow = false"
    if (commonValues.docid) {
      setCookie('docid', commonValues.docid)
    }
    setData()
  }, [])

  const setData = () => {
    let tempImgArr = []
    let tempImgStatusArr = []
    imgReducerData.imageArr.map((e) => {
      tempImgArr.push(e)
    })
    imgReducerData.imageStatusArr.map((e) => {
      tempImgStatusArr.push(e)
    })
    imagesArr.current = tempImgArr;
    imageUploadStatusArr.current = tempImgStatusArr;
    forceUpdate()
  }

  const callUploadApi = async (data, index) => {
    let tempImageUploadStatusArr = imageUploadStatusArr.current;
    let tempImageArr = imagesArr.current;
    try {
      const form = new FormData();
      form.append("docid", commonValues?.docid);
      form.append("insta", "0");
      form.append("sid", encodeURIComponent(decodeURIComponent(decodeURIComponent(props?.sid))));
      form.append("source", "mcatalogue");
      form.append("city", `${cityRedux ? cityRedux : cityCookie ? cityCookie : cityParams ? cityParams : "Mumbai"}`);
      form.append("verified", "1");
      form.append("gallery", "1");
      form.append("catalogue_id", "0");
      form.append("module_type", '7');
      form.append("mod", "1");
      form.append("upload_by", isDcFlow ? vendor_mobile[0] : MobileCookie);
      form.append("files", data);


      let url = "/api/v1/addphoto";
      axios.post(url, form, { headers: { "Content-Type": "multipart/form-data" }, })
        .then((res) => {
          if (res?.data?.error_code == 1) {
            tempImageArr[index] = null;
            tempImageUploadStatusArr[index] = true;
          } else {
            tempImageUploadStatusArr[index] = true;
            forceUpdate()
          }
        })
        .catch((err) => {

          throw (err);
        });
    } catch (err) {
      tempImageArr[index] = null;
      tempImageUploadStatusArr[index] = true;
      setTriggerUpdate(!triggerUpdate);
      setToastErrMsg("Something went wrong!!");
    }
  }

  async function imageValidation() {
    let fileListData = imageUploadRef.current.files;
    let tempImageArr = imagesArr.current;
    let tempImageUploadStatusArr = imageUploadStatusArr.current;
    let n = 10
    let uploadCount = 0

    if (fileListData.length > 10) {
      n = 10
    } else {
      n = fileListData.length
    }

    for (let i = 0; i < n + imgErrorIndex.length + minimumResolutionIndex.length; i++) {
      if (imgErrorIndex.includes(i)) {
        continue
      }
      if (minimumResolutionIndex.includes(i)) {
        continue
      }
      let file = fileListData.item(i)
      let ten_mb = 10485760 //in binary
      if ((file?.type && !['image/jpeg', 'image/png', 'image/heif', 'image/webp'].includes(file?.type)) || file?.size > ten_mb) {
        continue
      }

      if (uploadCount === 10) {
        break;
      }
      uploadCount++

      tempImageArr.push(file);
      tempImageUploadStatusArr.push(false);
      let currentInsertIndex = tempImageArr.length - 1;
      imageUploadStatusArr.current = tempImageUploadStatusArr;
      imagesArr.current = tempImageArr;
      callUploadApi(file, currentInsertIndex)

    }
    imageUploadRef.current.value = null;
  }

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setToastErrMsg('')
    let imgPromiseArr = []
    let errorIndex = []
    let resolutionIndex = []
    let imageErrorPriority = []
    let isError = false
    let fileListData = imageUploadRef.current.files
    if (fileListData.length > 10) {
      isError = true
      imageErrorPriority.push(1)
    }
    for (let i = 0; i < fileListData.length; i++) {
      let file = fileListData.item(i)
      let ten_mb = 10485760 //in binary
      if (file?.size > ten_mb) {
        isError = true
        imageErrorPriority.push(2)
      }
      if (!['image/jpeg', 'image/png', 'image/heif', 'image/webp'].includes(file?.type)) {
        isError = true
        imageErrorPriority.push(4)
      }
      let resp = await getImageResolution(fileListData.item(i))
      imgPromiseArr.push(resp)
    }


    Promise.all(imgPromiseArr).then(files => {
      files.map((file, i) => {
        if (file.error) {
          errorIndex.push(i)
          isError = true
          if (!imageErrorPriority.includes(4)) {
            imageErrorPriority.push(4)
          }
        } else {
          if (file.width <= 450 && file.height <= 450) {
            resolutionIndex.push(i)
            isError = true
            imageErrorPriority.push(3)
          }
        }
      })

      if (isError) {
        let sortPrioritywise = imageErrorPriority.sort((a, b) => a - b)
        if (sortPrioritywise?.length > 0) {
          setToastErrMsg(imageValidationErrorMessage[sortPrioritywise[0]])
        }
      }
      setMinimumResolutionIndex(resolutionIndex)
      setImgErrorIndex(errorIndex)
    }).catch(e => {
      console.log(e)
    }).finally(() => {
      setIsImageUploaded(true)
      isError = false
      imageErrorPriority = []
    })


    //click tracker implementaion
    const sourceCode = sanitizeParams(router?.query?.source)
    clickTracker({
      sourceCode: sourceCode,
      docid: StoreCommonInfo?.docid,
      li: 'FL_AddPhoto',
      ll: 'FL_StoreImages'
    })
  }

  const showToast = () => {
    if (!toastErrMsg?.length) return;
    setTimeout(() => {
      setToastErrMsg('')
    }, 8000);
    return (
      <div className={`toastmessage font11 colorfff`}>
        <span className={`toastmessage__text`}>
          {toastErrMsg}
        </span>
        <span
          onClick={() => { setToastErrMsg('') }}
          className={`iconwrap closeiconwhite ripple`}
        />
      </div>
    )
  }

  const isNoImage = () => {
    if (!imagesArr.current?.length) return true;
    let check = true;

    imagesArr.current.map((data) => {
      if (!Object.is(data, null)) check = false;
    })

    return check;
  }

  function handlePermision() {
    if (Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) {
      checkForCameraPermissions()
    }
  }

  const handleOuterClick = (e) => {
    if (e.target.id === 'files') {
      handlePermision()
    }
  };

  return (
    <>
      <div className="container__inner">
        <div className={`container__inner__left`}>
          <div className='left__img' >
            <Image
              fill
              src={'https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/business_addphot_2x_new.png'}
              alt={"Business Listing Image"}
              title="Business Listing Image"
            />
          </div>
        </div>
        <div className={`container__inner__right`}>
          <progress className={`${styles.progressbar}`} value="100" max="100" />
          <div className={`form-wrapper`}>
            <p className={`${styles.title} color111 fw600`}>Add photos</p>
            <p className={`${styles.content} color111`}>
              {
                isDcFlow ?
                  "Showcase business photos to increase credibility" :
                  "Showcase photos of your business to look authentic"
              }
            </p>
            <div
              className={`form`}
              onClickCapture={handleOuterClick}
            >
              <ul className={`${styles.gallery}`}>
                <li className={`${styles.photoupload}`}>
                  <input
                    ref={imageUploadRef}
                    name="files"
                    id="files"
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    aria-label="Add Photo"
                  />
                  <span className="font12 fw500 color007 mt-5">Add Photo</span>
                </li>

                {isNoImage() ? (
                  <>
                    {ExampleImageArr.map((data, index) => {
                      {
                        return (<li key={`image_list_${index}`}>
                          {
                            <Image
                              key={`image_${index}`}
                              fill
                              priority={true}
                              src={data.imageUrl}
                              alt={data.caption}
                              title={data.caption}
                            />
                          }
                        </li>)
                      }
                    })}
                  </>
                ) :
                  imagesArr.current.map((file, index) => {
                    if (file == null) return null
                    return (
                      <li key={`image_list_${index}`}>
                        {!imageUploadStatusArr.current[index] ? <span className="loader__img">
                          <span className="loader" />
                        </span> : null}

                        <Image
                          id={index}
                          fill
                          alt={file.name}
                          src={URL.createObjectURL(file)}
                          title={file.name}
                        />
                        {imageUploadStatusArr.current[index] ? <span
                          onClick={(e) => { removeImages(e, index) }}
                          className={`iconwrap ${styles.delete}`}
                        /> : null}
                      </li>
                    );
                  })}
              </ul>
              {message.errFlag ? (
                <div className={`${styles.toastmessage} font11 colorfff`}>
                  <span className={`${styles.toastmessage__text}`}>
                    {message.errMsg}
                  </span>
                  <span
                    onClick={() => setMessage({ errFlag: false, errMsg: "" })}
                    className={`iconwrap ${styles.closeiconwhite} ripple`}
                  />
                </div>
              ) : null}
            </div>
          </div>
          {!loader ?
            <button aria-label={isNoImage() ? "Skip" : "Submit"}
              className='primarybutton fw500 ripple mt-10'
              onClick={saveAndContinue}
            >
              {isNoImage() ? "Skip" : "Submit"}
            </button>
            :
            <button aria-label="Loader Button"
              disabled
              className={`primarybutton mt-10`}
            >
              <span className='btn-loader' />
            </button>
          }

        </div>
        {showToast()}
      </div>
    </>
  );
}
