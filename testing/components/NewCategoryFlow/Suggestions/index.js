import React, { useState, useEffect } from "react";
import styles from "./suggestedcategories.module.scss";
import axios from "axios";
import Shimmer from "@/components/shimmer";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { updateCategoryHistoryValues, updateCurrCategoryValues } from "@/store/Slices/newCategorySlice";

export default function SuggestedCategory(props) {
  const router = useRouter();
  const { SuggestedCategoriesData = [], selectedCategories = [], currentCategoryID } = props;
  const [loading, setLoading] = useState(true);
  const [localSelectedCategories, setLocalSelectedCategories] = useState([...selectedCategories]);
  const [isShowAll, setIsShowAll] = useState(false);
  const [categoriesArrToRender, setCategoriesArrToRender] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({});



  function selectCategory(event, categoryID, categoryName) {
    let tempCategoryID = categoryID.toString();
    let tempCategoryName = categoryName.toString();
    if (isSelected(categoryID)) {
      setLocalSelectedCategories((prevArray) =>
        prevArray.filter((item) => item.key !== tempCategoryID)
      );
    } else {
      setLocalSelectedCategories((prevArray) => [...prevArray, { key: tempCategoryID, label: tempCategoryName }]);
    }
  }

  function isSelected(catId) {
    let flag = false;
    if (localSelectedCategories.some((category) => category.key === catId.toString())) {
      flag = true;
    }
    return flag;
  }

  useEffect(() => {
    let tempCategoriesArrToRender = [];
    SuggestedCategoriesData.map((e) => {
      let key = (e?.ncid || e?.national_catid);
      key = key.toString();
      if (!selectedCategories.some((category) => category.key === key) && key !== currentCategoryID.toString()) {
        tempCategoriesArrToRender.push(e);
      }
      if (key == currentCategoryID.toString()) {
        setCurrentCategory({ ...e });
      }
    });
    if (SuggestedCategoriesData?.length) {
      setLocalSelectedCategories(selectedCategories)
      setCategoriesArrToRender(tempCategoriesArrToRender.slice(0, 4) || [])
    }
  }, [SuggestedCategoriesData])

  useEffect(() => {
    let tempCategoriesArrToRender = [];
    SuggestedCategoriesData.map((e) => {
      let key = (e?.ncid || e?.national_catid);
      key = key.toString();
      if (!selectedCategories.some((category) => category.key === key) && key !== currentCategoryID.toString()) {
        tempCategoriesArrToRender.push(e);
      }
      if (key == currentCategoryID.toString()) {
        setCurrentCategory({ ...e });
      }
    });
    if (SuggestedCategoriesData?.length) {
      setLocalSelectedCategories(selectedCategories)
    }
    setCategoriesArrToRender(tempCategoriesArrToRender.slice(0, 4) || [])
  }, [selectedCategories])

  const dispatch = useDispatch()

  const currCatName = currentCategory?.category_name || ''

  function saveAndContinue() {
    let tempData = [...localSelectedCategories];

    tempData.unshift({
      key: currentCategory?.national_catid?.toString(),
      label: currentCategory?.category_name?.toString()
    })
    const uniqueKeysMap = new Map();

    const deduplicatedData = tempData.filter((item) => {
      if (!uniqueKeysMap.has(item.key.toString())) {
        uniqueKeysMap.set(item.key.toString(), true);
        return true;
      }
      return false;
    });

    let reduxTempObject = {
      selectedCategoryId: [],
      searchTerm: '',
      suggestedCatList: [],
      currCatID: ''
    }

    reduxTempObject.selectedCategoryId = [...deduplicatedData];
    dispatch(updateCurrCategoryValues(reduxTempObject))
    // const jsonData = JSON.stringify(deduplicatedData);
    // // const compressedData = pako.deflate(jsonData, { to: "string" });
    // const safeQueryParam = encodeURIComponent(jsonData);
    const pathname = '/addcategories';
    let routerQuery = router?.query || {}
    // routerQuery = {
    //   ...routerQuery,
    //   selectedCategory: safeQueryParam
    // }
    router.replace({
      pathname,
      query: routerQuery,
    });
  }

  async function fetchAllCategories() {
    // setLoading(true);
    // const url = `/api/v1/subCategory/${currCatName}?city=${"mumbai"}&ncid=${currentCategoryID}`;
    // const responce = await axios.get(url);
    // const categoryArr = responce?.data?.results || [];
    // if (categoryArr?.length) {
    //   let tempCategoriesArrToRender = [];

    //   categoryArr.map((e) => {
    //     let key = (e?.ncid || e?.national_catid);
    //     key = key.toString();

    //     if (!selectedCategories.some((category) => category.key === key) && key !== currentCategoryID.toString()) {
    //       tempCategoriesArrToRender.push(e);
    //     }
    //   });
    //   setCategoriesArrToRender(tempCategoriesArrToRender)
    // }
    let tempCategoriesArrToRender = [];
    SuggestedCategoriesData.map((e) => {
      let key = (e?.ncid || e?.national_catid);
      key = key.toString();
      if (!selectedCategories.some((category) => category.key === key) && key !== currentCategoryID.toString()) {
        tempCategoriesArrToRender.push(e);
      }
      if (key == currentCategoryID.toString()) {
        setCurrentCategory({ ...e });
      }
    });
    setCategoriesArrToRender([...tempCategoriesArrToRender])
  }

  useEffect(() => {
    setLoading(false);
  }, [categoriesArrToRender])

  useEffect(() => {
    if (isShowAll) {
      fetchAllCategories();
    }
  }, [isShowAll])

  return (
    <>
      <div className={`${styles.containersuggess__inner} container__inner`}>
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
        <div className={`container__inner__right`}>
          <progress className={`${styles.progressbar}`} value="75" max="100" />
          <div className={`form-wrapper`}>
            <p className={`${styles.title} color111 fw600`}>
              Suggested categories
            </p>
            <label tabIndex="0" aria-label={currCatName} className={`${styles.suggestedcategories} mb-20 mt-20`}>
              <span
                onClick={(e) => selectCategory(e, currentCategoryID, currCatName)}
                className={`iconwrap ${styles.bluecheck} mr-10`}
              />
              <span className={`color414 font14`}>
                {currCatName}
              </span>
            </label>
            <p className={`${styles.content} color111`}>
              Here are a few more categories to consider based on your selected category.
            </p>
            <div className={`form`}>
              {(categoriesArrToRender.length > 0 && !loading) || true ? (
                categoriesArrToRender.map((cats, index) => {
                  let categoryID = (cats?.ncid || cats?.national_catid);
                  if (true) {
                    return (
                      <label tabIndex="0" aria-label={cats.category_name}
                        key={`label_${index}`}
                        className={`${styles.suggestedcategories} ${isSelected(categoryID)
                          ? ''
                          : styles.suggestedcategories__unchecked
                          }`}
                        onClick={(e) => selectCategory(e, categoryID, cats.category_name)}
                      >
                        <span
                          className={`iconwrap ${styles.bluecheck} mr-10`}
                        />
                        <span className={`color414 font14`}>
                          {cats.category_name}
                        </span>
                      </label>
                    );
                  }
                })
              ) : (
                <Shimmer />
              )}
              {!isShowAll ? (
                <button aria-label="Show More"
                  onClick={() => setIsShowAll(true)}
                  className={`transparentButton font13`}
                >
                  + Show More
                </button>
              ) : null}
            </div>
            <button aria-label="Save and Continue"
              onClick={saveAndContinue}
              className={`${styles.primarybutton} primarybutton`}
            >
              Save and Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
