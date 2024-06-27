import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { clickTracker, sanitizeParams } from "@/utils/commonFunc";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { PostAddressAPI } from "../address/APICalls";
import Businesstype from "../NewCategoryFlow/businesstype";
import Categorycombo from "../NewCategoryFlow/categorycombo";
import { resetCategory, removeCategoryHistoryValues, updateCategoryHistoryValues, updateCurrCategoryValues, updateMultipleCategoryValues, updateSuggestedCategoryValues } from "@/store/Slices/newCategorySlice";
import { updateCommonValues } from "@/store/Slices/commonDataSlice";
import Popup from "./subcomponent";
import { set24hr } from "@/store/Slices/addTiimmingSlice";
import { trackingDashboardAPI } from "@/utils/api";
import SuggestedCategory from "./Suggestions";

var CryptoJS = require("crypto-js");


const MainCategory = (props) => {
  const { selectedCategories = [], IP, logWorker } = props;

  const searchInputRef = useRef();
  const shouldAdd24Hour = useRef(false);
  const router = useRouter();
  const dropDownContainer = useRef();
  const [responceMsg, setResponceMsg] = useState("");
  const dispatch = useDispatch();
  const sourceCode = sanitizeParams(router?.query?.source)
  const StoreCommonInfo = useSelector((state) => state.CommonValues)
  const is24HourChecked = useRef(false);//[is24HourChecked, setIs24HourChecked] = useState(false)
  let lat = sanitizeParams(router?.query?.lat) || ""
  let long = sanitizeParams(router?.query?.long) || ""
  const [categoryData, setCategoryData] = useState({
    searchTerm: "",
    error: {
      isError: false,
    },
    selectedCategoryArr: [],
    dropDownActiveIndex: 0,
    dropdownData: [],
  });

  const [multiparentData, setMultiparentData] = useState([]);
  const tempSelectedArrayList = useRef()

  // useLayoutEffect(() => {
  //   isAdvertisePage.current = true //router.pathname.includes("Advertise")
  // }, [])

  const [timing24HrPopup, setTiming24HrPopup] = useState({
    isShow: false,
    msg: '',
    catList: [],
    allowed: false
  });
  const history = useSelector(state => state?.newCategoryPageSlice?.historyState);


  const parentInfo = useSelector((state) => state.CommonValues);
  const addressInfo = useSelector((state) => state.Address);
  const [isLoading, setIsLoading] = useState(false);
  const comboErrMsg = useRef("");
  const [modal, setModal] = useState(false);
  const [modalcombo, setModalcombo] = useState(false);
  const [genericPopup, setGenericPopup] = useState(false)
  const genericRefCatList = useRef([])
  const genericRefCatNameList = useRef([])
  const sesionId = useSelector((state) => state.CommonValues?.sesionId || '')
  const [suggestedCategoriesData, setSuggestedCategoriesData] = useState([])
  const [currentCatID, setCurrentCatID] = useState('')
  const [selectedCategoriesArr, setselectedCategoriesArr] = useState([])
  const suggestedCategoryReduxData = useSelector(state => state?.newCategoryPageSlice?.suggestedCategoryData);
  const vendor_mobile = useSelector(state => state?.dcLandingSlice?.mobile_number)
  const isDcFlow = router?.pathname?.includes('/dc')
  useEffect(() => {
    if (suggestedCategoryReduxData.hasOwnProperty('suggestedCatList')) {
      setSuggestedCategoriesData([...suggestedCategoryReduxData.suggestedCatList])
      setselectedCategoriesArr([...suggestedCategoryReduxData.selectedCategoryId])
      setCurrentCatID(suggestedCategoryReduxData.currCatID)
    }
    if (suggestedCategoryReduxData?.selectedCategoryId?.length == 0) {
      dispatch(resetCategory())
    }
  }, [suggestedCategoryReduxData])

  const ClickTrackerCall = (li, ll) => {
    let sourceCodeNew = sourceCode
    if (sourceCodeNew == null) {
      let device_userAgent = navigator.userAgent;
      if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          device_userAgent
        )
      ) {
        sourceCodeNew = "2";
      } else {
        sourceCodeNew = "7";
      }
    }
    clickTracker({
      sourceCode: sourceCodeNew,
      docid: parentInfo.docid,
      li: li,
      ll: ll,
    });
  };

  function handleSearchInputChange(event) {
    let searchTerm = event?.target?.value || "";
    setCategoryData((prevState) => ({
      ...prevState,
      searchTerm: searchTerm,
      dropDownActiveIndex: 0,
    }));
  }

  function handleDropDownScrollViaKey(event) {
    let currentDropDownIndex = categoryData?.dropDownActiveIndex;
    let tempDropDownData = categoryData?.dropdownData;
    let keyType = event?.key || null;
    if (!showDropDown("showDropdown")) return;

    switch (keyType) {
      case "ArrowDown":
        if (currentDropDownIndex >= tempDropDownData.length - 1) return;
        if (Number(currentDropDownIndex) + 1 > 3) {
          dropDownContainer.current.scrollBy({ top: 50 });
        }
        setCategoryData((prevState) => ({
          ...prevState,
          dropDownActiveIndex: prevState.dropDownActiveIndex + 1,
        }));
        break;
      case "ArrowUp":
        if (currentDropDownIndex <= 0) return;
        if (Number(currentDropDownIndex) + 1 > 3) {
          dropDownContainer.current.scrollBy({ top: -50 });
        }
        setCategoryData((prevState) => ({
          ...prevState,
          dropDownActiveIndex: prevState.dropDownActiveIndex - 1,
        }));
        break;
      case "Enter":
        SelectCategory(null, tempDropDownData[currentDropDownIndex]);
        break;
    }
  }

  function showDropDown(action) {
    let falg = false;
    let searchTerm = categoryData?.searchTerm || "";
    let errorFlag = categoryData?.error?.isError || false;
    let dropDownData = [...categoryData.dropdownData];
    switch (action) {
      case "isError":
        if (searchTerm?.length >= 3 && dropDownData?.length > 1 && !errorFlag)
          falg = true;
        break;
      case "showDropdown":
        if (searchTerm?.length >= 3 && dropDownData?.length > 1) falg = true;
        break;
      case "notFound":
        if (errorFlag && searchTerm?.length >= 3) falg = true;
        break;
    }
    return falg;
  }

  async function SelectCategory(event, data) {
    if (event) event.preventDefault();
    if (!(data?.ncid && data?.mcn)) {
      setResponceMsg("Something Went Wrong.");
      return;
    }
    if (!categoryData?.error?.isError) {
      let reduxTempObject = {
        selectedCategoryId: [],
        searchTerm: data?.mcn || "",
        suggestedCatList: [],
        currCatID: "",
        copyselectedCategoryId: []
      };
      const url = `/api/v1/subCategory/${data?.mcn}?city=${"mumbai"}&ncid=${data.ncid
        }`;
      const suggestedCatList = await axios
        .get(url)
        .then((res) => {
          return res?.data?.results || [];
        })
        .catch((err) => {
          console.error(err);
          return null;
        });

      if (suggestedCatList && suggestedCatList?.length <= 1) {
        let tempSelectedArray = [...selectedCategories];
        tempSelectedArray.push({
          key: data.ncid,
          label: data?.mcn,
        });
        const uniqueKeysMap = new Map();

        const deduplicatedData = tempSelectedArray.filter((item) => {
          if (!uniqueKeysMap.has(item.key.toString())) {
            uniqueKeysMap.set(item.key.toString(), true);
            return true;
          }
          return false;
        });
        setCategoryData({
          ...categoryData,
          searchTerm: '',
          selectedCategoryArr: [...deduplicatedData],
          dropdownData: [],
        });
      } else {
        let reduxSuggest = suggestedCategoryReduxData?.selectedCategoryId || []
        let tempSelectedArray = [...reduxSuggest];
        tempSelectedArray.push({
          key: data.ncid,
          label: data?.mcn,
        });
        const uniqueKeysMap = new Map();

        const deduplicatedData = tempSelectedArray.filter((item) => {
          if (!uniqueKeysMap.has(item.key.toString())) {
            uniqueKeysMap.set(item.key.toString(), true);
            return true;
          }
          return false;
        });
        reduxTempObject.suggestedCatList = suggestedCatList.filter(suggestion => suggestion?.national_catid?.toString() !== data?.ncid?.toString())
        reduxTempObject.copyselectedCategoryId = suggestedCatList;
        reduxTempObject.currCatID = data.ncid;
        reduxTempObject.selectedCategoryId = deduplicatedData;

        dispatch(updateSuggestedCategoryValues(reduxTempObject));
        setCategoryData({
          ...categoryData,
          searchTerm: '',
          dropdownData: [],
        });
      }
    }
  }

  function UnselectCategory(categoryID, suggestedCatList) {
    let unselectedValueobj = suggestedCategoryReduxData?.copyselectedCategoryId?.find(data => data?.national_catid == categoryID)
    let tempSuggestedList = [...suggestedCategoryReduxData.suggestedCatList];
    if (unselectedValueobj) {
      tempSuggestedList.push(unselectedValueobj);
    }
    const updatedSelectedCategoryArr = suggestedCategoryReduxData?.selectedCategoryId?.filter(
      (item) => item?.key?.toString() !== categoryID?.toString()
    );
    setCategoryData({
      ...categoryData,
      selectedCategoryArr: updatedSelectedCategoryArr,
    });
    dispatch(updateSuggestedCategoryValues({ ...suggestedCategoryReduxData, selectedCategoryId: updatedSelectedCategoryArr, suggestedCatList: tempSuggestedList }));
  }

  //dispatch(updateCurrCategoryValues({ ...reduxObject }));
  //}


  function fetchErrMsg(msg) {
    switch (msg) {
      case "EconomyLuxuryRestriction":
        comboErrMsg.current = "Please add either economy or luxury category.";
        break;
      case "LandlineMandatoryTagged":
        comboErrMsg.current = `Note : This Category ${responce?.data?.data["BLOCK"]["LandlineMandatoryCategory"] || ""
          } is landline tagged category, Please enter landline number.`;
        break;
      case "fastFoodRestRestriction":
        comboErrMsg.current = "";
        let catNameArr = responce?.data?.data["BLOCK"]["rest_catname"] || [];
        catNameArr.map((e, i) => {
          if (catNameArr.length - 1 == i) {
            comboErrMsg.current += ` and ${e}`;
          } else if (catNameArr.length - 2 == i) {
            comboErrMsg.current += e;
          } else {
            comboErrMsg.current += `${e},`;
          }
        });
        comboErrMsg.current += " Categories are not allowed.";
        break;
      case "PurevegNonvegRestriction":
        comboErrMsg.current = "";
        let purcatnameArr = responce?.data?.data["BLOCK"]["PureVegCategory"];
        purcatnameArr.replaceAll(/|~|/g, ",");
        let noncatnameArr = responce?.data?.data["BLOCK"]["NonVegCategory"];
        noncatnameArr.replaceAll(/|~|/g, ",");
        comboErrMsg.current = `You Are Not Allowed To Add Both Pure Veg ${purcatnameArr} And Non Veg ${noncatnameArr} Category. Kindly Remove One Of The Category Of Pure Veg Or Non Veg.`;
        break;
      case "StarRatingTagged":
        comboErrMsg.current =
          "You Are Not Allowed To Add Multiple Star Tagged Category.";
        break;
      case "drySateCatRest":
        comboErrMsg.current =
          "You Are Not Allowed To Add Following Liquor Tagged Category In Dry States.";
        break;
      case "PriceFiltersRestriction":
      case "RestPriceFilterTagged":
        comboErrMsg.current = "";
        if (responce?.data?.data["BLOCK"]["message"] == "PriceFiltersRestriction")
          comboErrMsg.current = "Below price combination is not allowed.";
        else
          comboErrMsg.current =
            "Kindly select any 2 price range from below mentioned categories.";
        break;
      default:
        comboErrMsg.current = "Following category combination is not allowed.";
        break;
    }
  }

  async function proceedToNextPage(catlist) {
    document.body.style.overflow = "unset";
    const {
      docid = null,
      parentid = null,
      sphinx_id = null,
      source = null,
      companyName = null,
    } = parentInfo || {};
    const { city } = addressInfo || {};

    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'click',
      IP: IP || "",
      trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
      mobile: StoreCommonInfo?.mobileNumber || "",
      docid: StoreCommonInfo?.docid || "",
      sessionId: sesionId || "",
      city: addressInfo?.city || ""
    }
    if(!isDcFlow){
      await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    }

    const tempSourceVal = sanitizeParams(router?.params?.source) || '77'
    if (!(docid && parentid && sphinx_id && tempSourceVal && companyName && city)) {
      setResponceMsg("Something Went Wrong.");
      setIsLoading(false);
      return;
    }

    let categoryList = '/';
    categoryList += catlist.replace(/ /g, '');
    categoryList += '/'

    let postAddressObject = {
      docid: docid,
      parentid: parentid,
      sphinx_id: sphinx_id,
      source: sourceCode,
      city: city,
      mobile: isDcFlow ? vendor_mobile?.toString() : StoreCommonInfo.mobileNumber,
      data_city: city,
      legalcompanyname: companyName,
      companyname: companyName,
      national_catidlineage: categoryList,
      IP: IP,
      page: "AddCategory",
    };
    if (shouldAdd24Hour.current) {
      postAddressObject['working_time_start'] = "00:00,00:00,00:00,00:00,00:00,00:00,00:00";
      postAddressObject['working_time_end'] = "23:59,23:59,23:59,23:59,23:59,23:59,23:59";
    }

    shouldAdd24Hour.current = false;

    PostAddressAPI(postAddressObject).then(async (res) => {
      if (res?.data?.success) {
        if (postAddressObject.working_time_start) {
          dispatch(set24hr({}))
        }
        clickTracker({
          sourceCode: sourceCode || "7",
          docid: StoreCommonInfo?.docid || "",
          li: 'Category_Continue',
          ll: 'NFL_LP',
        })
        let routerQuery = router?.query || {};

        const updatedQuery = { ...routerQuery };

        document.cookie = "isFlow=true";

        // let reduxObject = {
        //   selectedCategoryId: [],
        //   searchTerm: "",
        //   suggestedCatList: [],
        //   currCatID: "",
        // };
        // reduxObject.suggestedCatList = [];
        // reduxObject.currCatID = "";
        // reduxObject.selectedCategoryId = categoryData.selectedCategoryArr;
        const contactProgress = parentInfo?.contactDetailProgress > 75 ? parentInfo?.contactDetailProgress : 75
        dispatch(updateCommonValues({ key: "contactDetailProgress", value: contactProgress }))

        // if (sendToAdvertisePage) {
        //   router.push({
        //     pathname: "/advpremium",
        //     query: router?.query || {},
        //   });
        // } else {
        //   // dispatch(updateCurrCategoryValues({ ...reduxObject }));

        //   router.push({
        //     pathname: "/addphoto",
        //     query: updatedQuery,
        //   });
        // }

        if (isDcFlow) {
          try {
            await logWorker('click', StoreCommonInfo?.docid)
          } catch (error) {
            console.log(error.message)
          }

          router.push({
            pathname: "/dc/addphoto",
            query: updatedQuery,
          });
        } else {
          router.push({
            pathname: "/addphoto",
            query: updatedQuery,
          });
        }
      } else {
        setIsLoading(false);
      }
    });
  }

  const multiParentCheck = async (
    parentid,
    catid_list,
    req_data_city,
    data_city,
    companyName
  ) => {
    try {
      const response = await axios.get("/api/v1/multiparentagecheck", {
        params: {
          parentid,
          catid_list,
          req_data_city,
          data_city,
          companyName,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  async function CategoryCombinationCheck(payload) {
    let categoryList = payload?.all_catidlist || null;
    if (categoryList == null) return; // Early return if categoryList is null

    let url = "/api/v1/categorycombinationcheck";

    try {
      const response = await axios.post(url, payload);

      // Define encryption-related variables
      const salt = "zhsmaj3GKL2CulM0v4KQWgumwVCTKOzy";
      const matchString = categoryList + "true";

      // Decrypt the response data
      const encodedString = response?.data?.result || "";
      const decrypt_msg = CryptoJS.AES.decrypt(encodedString, salt).toString(
        CryptoJS.enc.Utf8
      );

      let genericObj = {}
      if (response?.data?.genericData?.CANPROCEED) {
        for (const [key, value] of Object.entries(response?.data?.genericData?.CANPROCEED)) {
          if (value["message"] === "RestMissingCategory") {
            genericObj = value
          }
        }
      }
      // Check if the decrypted message matches the expected string
      if (decrypt_msg === matchString) {
        return {
          status: true,
          msg: null,
          isGeneric: genericObj,
          hr24CatObj: response?.data?.hr24CatObj
        }; // Combination is valid
      } else {
        return {
          status: false,
          msg: response?.data?.data?.BLOCK?.message || null,
          isGeneric: genericObj
        }; // Combination is invalid
      }
    } catch (error) {
      console.error(
        "An error occurred while checking category combination:",
        error
      );
      return {
        status: false,
        msg: null,
      }; // Return false in case of an error
    }
  }

  async function validateSelectedCategory() {
    let tempSelectedCategory = suggestedCategoryReduxData?.selectedCategoryId || [];
    const selectedCategoryStringComma = [...tempSelectedCategory]
      .map((item) => item.key)
      .join(", ");
    const selectedCategoryStringSlash = [...tempSelectedCategory]
      .map((item) => item.key)
      .join("/,/");
    const city = addressInfo?.city;
    const parentId = parentInfo?.parentid;
    const companyName = parentInfo?.companyName || "";

    if (!(city && parentId)) {
      setResponceMsg("Something went wrong.");
      setIsLoading(false);
      return;
    }
    try {
      const responseData = await multiParentCheck(
        parentId,
        selectedCategoryStringComma,
        city,
        city,
        companyName
      );
      if (responseData?.error?.code == 1 && responseData.data?.length == 0) {
        let payload = {
          parentid: parentId,
          city: city,
          all_catidlist: selectedCategoryStringComma,
        };

        const catComboCheckResponceData = await CategoryCombinationCheck(payload);
        if (catComboCheckResponceData?.hr24CatObj?.type == "24HrCat" && !is24HourChecked.current) {
          Via24HrFlow(catComboCheckResponceData?.hr24CatObj?.catListName || []);
          setIsLoading(false);
          return
        }
        if (catComboCheckResponceData?.status) {
          if (!catComboCheckResponceData?.isGeneric?.RestaurantMissingCategory) {
            proceedToNextPage(selectedCategoryStringSlash);
          } else {
            genericRefCatList.current = `${selectedCategoryStringSlash}/,/${catComboCheckResponceData?.isGeneric?.RestaurantMissingCatid?.replaceAll('|~|', '/,/')}`
            genericRefCatNameList.current = catComboCheckResponceData?.isGeneric?.RestaurantMissingCategory.replaceAll('___0', "").split('|~|')
            setGenericPopup(true)
            setIsLoading(false);
          }
        } else {
          fetchErrMsg(catComboCheckResponceData?.msg || null);
          document.body.style.overflow = "hidden";
          setModalcombo(true);
          setIsLoading(false);
        }

      } else {
        let multiParentErrorDataArr = responseData?.data?.parentage_info || [];
        setMultiparentData(multiParentErrorDataArr);
        document.body.style.overflow = "hidden";
        setModal(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setResponceMsg("Something went wrong.");
      setIsLoading(false);
    }
  }

  function Via24HrFlow(CatList24Hr) {
    let popUpMsg = 'You have selected 24 Hours business category(s) due to which your business hours will be changed to 24 hours.'


    setTiming24HrPopup({
      isShow: true,
      msg: popUpMsg,
      catList: CatList24Hr,
      allowed: false
    });

  }


  async function saveAndContinue() {
    setIsLoading(true);
    await validateSelectedCategory();
  }

  function clearSearchInput(event) {
    setCategoryData((prevState) => ({
      ...prevState,
      searchTerm: "",
      dropDownActiveIndex: 0,
    }));
  }

  const setResponceToDefault = () => {
    setResponceMsg("");
  };

  const showToast = () => {
    if (!responceMsg?.length) return;
    setTimeout(() => {
      setResponceToDefault();
    }, 3000);
    return (
      <div
        className={`toastmessage font11 colorfff`}
        style={{ zIndex: "10000000000000" }}
      >
        <span className={`toastmessage__text`}>{responceMsg}</span>
        <span
          onClick={setResponceToDefault}
          className={`iconwrap closeiconwhite ripple`}
        />
      </div>
    );
  };

  async function fetchDropDownData(searchTerm) {
    if (!searchTerm) return null;
    try {
      const response = await axios.post(`/api/v1/mainCategory/${searchTerm}`, {
        data_city: addressInfo.city || 'mumbai'
      });
      return response.data; // Assuming the response contains data
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  const searchKeyDebounce = useDebounce(categoryData?.searchTerm, 100);

  const closeModal = () => {
    document.body.style.overflow = "unset";
    setModal(false);
  };

  const closeCategoryComboPopup = () => {
    document.body.style.overflow = "unset";
    setModalcombo(false);
  };
  useEffect(() => {
    setCategoryData((prevState) => ({
      ...prevState,
      selectedCategoryArr: selectedCategories,
    }));
  }, [selectedCategories]);

  useEffect(() => {
    const fetchData = async () => {
      let tempSearchTerm = categoryData?.searchTerm;
      if (tempSearchTerm?.length >= 3) {
        const responseData = await fetchDropDownData(tempSearchTerm);
        if (responseData?.result?.length) {
          setCategoryData((prevState) => ({
            ...prevState,
            dropdownData: [...responseData?.result],
            error: { isError: false },
          }));
        } else {
          setCategoryData((prevState) => ({
            ...prevState,
            dropdownData: [],
            error: {
              isError: true,
            },
          }));
        }
      }
    };

    // Call the async function
    fetchData();
  }, [searchKeyDebounce]);

  useEffect(() => {
    let trackingDataPayload = {
      source: sourceCode,
      clickType: 'load',
      IP: IP || "",
      trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
      mobile: StoreCommonInfo?.mobileNumber || "",
      docid: StoreCommonInfo?.docid || "",
      sessionId: sesionId || "",
      city: addressInfo?.city || ""
    }
    if(!isDcFlow){
      trackingDashboardAPI(trackingDataPayload, window.location.href || "");
    }
  }, [])

  const isSearchInputError =
    categoryData?.error?.isError && categoryData?.searchTerm?.length >= 3;
  const dropdownDataArr = categoryData?.dropdownData || [];

  async function handleMultiparentDataUpdate(CategoriesIDArr = []) {
    setIsLoading(true);
    if (CategoriesIDArr?.length) {
      setModal(false);
      document.body.style.overflowY = "unset";
      const newState = {
        ...categoryData,
        selectedCategoryArr: suggestedCategoryReduxData.selectedCategoryId.filter((item) => {
          return CategoriesIDArr.includes(item.key.toString());
        }),
      };
      let tempSelectedCategory = [...newState?.selectedCategoryArr] || [];
      tempSelectedArrayList.current = [...tempSelectedCategory];

      setCategoryData({
        ...categoryData,
        selectedCategoryArr: [...tempSelectedCategory]
      });

      dispatch(updateSuggestedCategoryValues({ ...suggestedCategoryReduxData, selectedCategoryId: [...tempSelectedCategory] }));
      const selectedCategoryStringComma = [...tempSelectedCategory]
        .map((item) => item.key)
        .join(", ");
      const selectedCategoryStringSlash = [...tempSelectedCategory]
        .map((item) => item.key)
        .join("/,/");
      const city = addressInfo?.city;
      const parentId = parentInfo?.parentid;

      if (!city || !parentId) {
        console.error('city or parentid not fount')
        setResponceMsg("Something Went Wrong.");
        setIsLoading(false);
        return;
      }

      try {
        const payload = {
          parentid: parentId,
          city: city,
          all_catidlist: selectedCategoryStringComma,
        };

        const catComboCheckResponceData = await CategoryCombinationCheck(payload);
        if (catComboCheckResponceData?.hr24CatObj?.type == "24HrCat" && !is24HourChecked.current) {
          Via24HrFlow(catComboCheckResponceData?.hr24CatObj?.catListName || []);
          setIsLoading(false);
          return
        }

        if (catComboCheckResponceData.status) {
          let catlist = selectedCategoryStringSlash

          if (catComboCheckResponceData?.isGeneric?.RestaurantMissingCategory) {
            genericRefCatList.current = `${selectedCategoryStringSlash}/,/${catComboCheckResponceData?.isGeneric?.RestaurantMissingCatid?.replaceAll('|~|', '/,/')}`
            genericRefCatNameList.current = catComboCheckResponceData?.isGeneric?.RestaurantMissingCategory.replaceAll('___0', "").split('|~|')
            setGenericPopup(true)
            setIsLoading(false);
            // catlist = genericRefCatList.current
            return
          }

          document.body.style.overflow = "unset";

          const {
            docid = null,
            parentid = null,
            sphinx_id = null,
            companyName = null,
          } = parentInfo || {};
          const { city } = addressInfo || {};

          if (!docid || !parentid || !sourceCode || !companyName || !city) {
            console.error("docid, parentid, sphinx_id, source, companyName, city not found")
            setResponceMsg("Something Went Wrong.");
            setIsLoading(false);
            return;
          }

          let categoryList = '/';
          categoryList += catlist.replace(/ /g, '');
          categoryList += '/'

          let postAddressObject = {
            docid: docid,
            parentid: parentid,
            sphinx_id: sphinx_id,
            source: sourceCode,
            city: city,
            data_city: city,
            legalcompanyname: companyName,
            companyname: companyName,
            mobile: isDcFlow ? vendor_mobile.toString() : StoreCommonInfo.mobileNumber,
            national_catidlineage: categoryList,
            IP: IP,
            page: "AddCategory",
          };
          if (shouldAdd24Hour.current) {
            postAddressObject['working_time_start'] = "00:00,00:00,00:00,00:00,00:00,00:00,00:00";
            postAddressObject['working_time_end'] = "23:59,23:59,23:59,23:59,23:59,23:59,23:59";
          }
          shouldAdd24Hour.current = false
          PostAddressAPI(postAddressObject).then(async (res) => {
            if (res?.data?.success) {
              try {
                let trackingDataPayload = {
                  source: sourceCode,
                  clickType: 'click',
                  IP: IP || "",
                  trace: JSON.stringify({ "useragent": navigator.userAgent, lat, long }),
                  mobile: StoreCommonInfo?.mobileNumber || "",
                  docid: StoreCommonInfo?.docid || "",
                  sessionId: sesionId || "",
                  city: addressInfo?.city || ""
                }
                if(!isDcFlow){
                  await trackingDashboardAPI(trackingDataPayload, window.location.href || "");
                }
              } catch (error) {
                console.log(error.message)
              }

              if (postAddressObject.working_time_start) {
                dispatch(set24hr({}))
              }
              clickTracker({
                sourceCode: sourceCode || "7",
                docid: StoreCommonInfo?.docid || "",
                li: 'Category_Continue',
                ll: 'NFL_LP',
              })
              let routerQuery = router?.query || {};

              const updatedQuery = { ...routerQuery };

              document.cookie = "isFlow=true";

              // let reduxObject = {
              //   selectedCategoryId: [],
              //   searchTerm: "",
              //   suggestedCatList: [],
              //   currCatID: "",
              // };
              // reduxObject.suggestedCatList = [];
              // reduxObject.currCatID = "";
              // reduxObject.selectedCategoryId = [...tempSelectedCategory];
              // if (sendToAdvertisePage) {
              //   router.push({
              //     pathname: "/advpremium",
              //     query: router?.query || {},
              //   });
              // } else {
              // dispatch(updateCurrCategoryValues({ ...reduxObject }));

              //   router.push({
              //     pathname: "/addphoto",
              //     query: updatedQuery,
              //   });
              // }
              if (router.pathname.includes('dc')) {
                try {
                  await logWorker('click', StoreCommonInfo?.docid)
                } catch (error) {
                  console.log(error.message)
                }

                router.push({
                  pathname: "/dc/addphoto",
                  query: updatedQuery,
                });
              } else {
                router.push({
                  pathname: "/addphoto",
                  query: updatedQuery,
                });
              }
            } else {
              setIsLoading(false);
            }
          });
        } else {
          fetchErrMsg(catComboCheckResponceData?.msg || null);
          document.body.style.overflow = "hidden";
          setModalcombo(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("error:", err);
        setResponceMsg("Something went wrong.");
        setIsLoading(false);
      }

    } else {
      setResponceMsg("Select the appropriate category for your business.");
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* <div className={category.isLoading ? "loader__page" : ""}>
            <span className="loader" />
          </div> */}
      <div className={`container__inner`}>
        {genericPopup &&
          <Popup
            confirmAction={() => proceedToNextPage(genericRefCatList.current)}
            categoryList={genericRefCatNameList.current}
            msg="The following category(s) will be automically added to your business listing profile"
            closePopup={() => { setGenericPopup(false); setIsLoading(false) }}
          />
        }
        <div className={`container__inner__left`}>
          <div className="left__img">
            <Image
              fill
              src={
                "https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/business_listed_2x_new.png"
              }
              alt={"Business Listing Image"}
              title="Business Listing Image"
            />
          </div>
        </div>
        <div className={`container__inner__right ${styles.categories}`}>
          <form onSubmit={(e) => { e.preventDefault() }}>
            <progress className={`${styles.progressbar}`} value={parentInfo?.contactDetailProgress > 75 ? parentInfo?.contactDetailProgress : 75} max="100" />
            <div className={`form-wrapper`}>
              <p className={`${styles.title} color111 fw600`}>Add business category</p>
              <p className={`${styles.content} color111`}>
                {isDcFlow
                  ? "Allow customers to find the business when they search by Category keywords"
                  : `Choose the right business categories so your customer can easily find you`}
              </p>
              <div className={`form ${styles.selected__form}`}>
                <div
                  className={`inputwrap mb-10 ${isSearchInputError ? "inputwrap__error" : ""
                    }`}
                >
                  <span className={`iconwrap ${styles.searchicon}`} />
                  {categoryData?.searchTerm && (
                    <span
                      className={`iconwrap closeicon__grey`}
                      onClick={clearSearchInput}
                    />
                  )}
                  <input
                    ref={searchInputRef}
                    value={categoryData?.searchTerm}
                    placeholder="Type Business Category"
                    onChange={handleSearchInputChange}
                    className={`input ${styles.textsearch} pr-30`}
                    onKeyDownCapture={handleDropDownScrollViaKey}
                    title="Type Business Category"
                  />

                  <ul
                    className={`dropdown color111 customscroll ${showDropDown("isError") ? "" : "dn"
                      }`}
                    id="ab"
                    ref={dropDownContainer}
                  >
                    {showDropDown("showDropdown")
                      ? dropdownDataArr.map((data, i) => {
                        return (
                          <li role="button" tabIndex="0" aria-label="Select Category"
                            className={`${categoryData?.dropDownActiveIndex === i ? "active" : ""
                              } ripple`}
                            key={data.ncid}
                            dangerouslySetInnerHTML={{
                              __html: data.v,
                            }}
                            onClick={(e) => {
                              SelectCategory(e, data);
                            }}
                          />
                        );
                      })
                      : null}
                  </ul>
                  {showDropDown("notFound") ? (
                    <div className="error__message mt-5">Cannot Find Category</div>
                  ) : null}
                  <p className={`${styles.subtitle} color111`}>
                    {suggestedCategoryReduxData.selectedCategoryId?.length ? "Selected Categories" : ""}
                  </p>
                </div>
              </div>
              <div className={styles.suggestedcategories__wrap}>
                {suggestedCategoryReduxData.selectedCategoryId && suggestedCategoryReduxData.selectedCategoryId.map((data) => {
                  return (
                    <label key={data.key} className={`${styles.suggestedcategories} font14 colorfff`}
                      onClick={() => {
                        UnselectCategory(data.key, suggestedCategoryReduxData.suggestedCatList);
                      }}>
                      <span className={styles.catName}>{data.label}</span>
                      <span
                        className={`ml-10`}
                        style={{ cursor: "pointer" }}
                      >
                        <Image
                          alt={data.label}
                          src={
                            "//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/closeblue.svg"
                          }
                          width={15}
                          height={15}
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {
              suggestedCategoryReduxData.suggestedCatList?.length ?
                <SuggestedCategory
                  SuggestedCategoriesData={suggestedCategoryReduxData.suggestedCatList}
                  currentCategoryID={currentCatID}
                  selectedCategories={selectedCategoriesArr}
                  selectedCategoryArr={categoryData.selectedCategoryArr}
                />
                :
                null
            }

            {/* {categoryData?.selectedCategoryArr?.length ? (
              !isLoading ? (
                <button aria-label="Save and Continue"
                  className="primarybutton fw500 ripple mt-10"
                  onClick={saveAndContinue}
                >
                  Save and Continue
                </button>
              ) : (
                <button aria-label="Button Loader" disabled className={`primarybutton mt-10`}>
                  <span className="btn-loader" />
                </button>
              )
            ) : null} */}

          </form>
        </div>
      </div>
      {showToast()}
      {!modal ? null : (
        <Businesstype
          majorCatsDetails={multiparentData}
          handleUpdateClick={handleMultiparentDataUpdate}
          closeModal={closeModal}
        />
      )}
      {!modalcombo ? null : (
        <Categorycombo
          selectedCategory={categoryData.selectedCategoryArr}
          categoryComboErrMsg={comboErrMsg.current}
          closeModal={closeCategoryComboPopup}
        />
      )}
      {timing24HrPopup?.isShow &&
        <Popup
          msg={timing24HrPopup?.msg}
          categoryList={timing24HrPopup?.catList}
          confirmAction={async () => {
            is24HourChecked.current = true;
            setIsLoading(true);
            setTiming24HrPopup((prev) => ({
              ...prev,
              isShow: false,
              msg: '',
              catList: [],
              allowed: true
            })
            )
            shouldAdd24Hour.current = true;
            await validateSelectedCategory();
          }}
          closePopup={() => {
            setTiming24HrPopup((prev) => ({
              ...prev,
              isShow: false,
              msg: '',
              catList: [],
              allowed: false
            })
            )
            setIsLoading(false)

          }}

        />}
      {suggestedCategoryReduxData.suggestedCatList?.length || suggestedCategoryReduxData.selectedCategoryId?.length ? (
        <div className={`fixed__div`}>
          <div></div>
          {!isLoading ? <button className={`primarybutton`} onClick={saveAndContinue}>
            <span>Save and Continue</span>
            <span className={`iconwrap whitearrow`} />
          </button> : <button disabled className={`primarybutton loder-outer`}>
            <span className="btn-loader" />
          </button>}
        </div>
      ) : null}
    </>
  );
};

export default MainCategory;