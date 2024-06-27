import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// import styles from "./suggestedcategories.module.scss";
import styles from "../styles.module.scss";
import axios from "axios";
import Shimmer from "@/components/shimmer";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { updateCategoryHistoryValues, updateCurrCategoryValues, updateSuggestedCategoryValues } from "@/store/Slices/newCategorySlice";
import { updateSuggestedCategory } from "@/store/Slices/categories";

export default function SuggestedCategory(props) {
  const router = useRouter();
  const isAdvertisePage = useRef(false);
  const { SuggestedCategoriesData = [], selectedCategories = [], currentCategoryID, selectedCategoryArr = [] } = props;
  const [loading, setLoading] = useState(true);
  const [localSelectedCategories, setLocalSelectedCategories] = useState([...selectedCategories]);
  const [isShowAll, setIsShowAll] = useState(false);
  const [categoriesArrToRender, setCategoriesArrToRender] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({});
  const dispatch = useDispatch()
  const currCatName = currentCategory?.category_name || ''
  const suggestedCategoryReduxData = useSelector(state => state?.newCategoryPageSlice?.suggestedCategoryData);
  useLayoutEffect(() => {
    isAdvertisePage.current = true//router.pathname.includes("Advertise")
  }, [])


  function selectCategory(event, categoryID, categoryName) {
    let tempCategoryID = categoryID?.toString();
    let tempCategoryName = categoryName?.toString();
    let update_category_arr_render = suggestedCategoryReduxData.suggestedCatList.filter(data => data?.national_catid != categoryID)
    setCategoriesArrToRender(update_category_arr_render)

    let tempData = [];
    if (isSelected(categoryID)) {
      let filterData = localSelectedCategories.filter((item) => item?.key !== tempCategoryID)
      setLocalSelectedCategories(filterData);
      tempData = [...filterData]
    } else {
      let filterData = [...localSelectedCategories, { key: tempCategoryID, label: tempCategoryName }]
      setLocalSelectedCategories(filterData);
      tempData = [...filterData]
    }

    // tempData.unshift({
    //   key: currentCategory?.national_catid?.toString(),
    //   label: currentCategory?.category_name?.toString()
    // })
    const uniqueKeysMap = new Map();
    const deduplicatedData = tempData.filter((item) => {
      if (!uniqueKeysMap.has(item?.key?.toString()) && item?.key?.toString()) {
        uniqueKeysMap.set(item?.key?.toString(), true);
        return true;
      }
      return false;
    });

    let reduxTempObject = {
      selectedCategoryId: [...deduplicatedData],
      searchTerm: suggestedCategoryReduxData.searchTerm,
      suggestedCatList: update_category_arr_render,
      copyselectedCategoryId: suggestedCategoryReduxData.copyselectedCategoryId,
      currCatID: suggestedCategoryReduxData.currCatID
    }

    dispatch(updateCurrCategoryValues(reduxTempObject))
    dispatch(updateSuggestedCategoryValues(reduxTempObject))
    // dispatch(updateSuggestedCategoryValues({...suggestedCategoryReduxData,suggestedCatList : SuggestedCategoriesData.filter(data => data.national_catid != categoryID)}))
  }

  function isSelected(catId) {
    let flag = false;
    if (localSelectedCategories.some((category) => category?.key === catId?.toString())) {
      flag = true;
    }
    return flag;
  }

  async function fetchAllCategories() {
    let tempCategoriesArrToRender = [];
    SuggestedCategoriesData.map((e) => {
      let key = (e?.ncid || e?.national_catid);
      key = key?.toString();
      if (!selectedCategories.some((category) => category?.key === key)) {
        tempCategoriesArrToRender.push(e);
      }
      if (key == currentCategoryID?.toString()) {
        setCurrentCategory({ ...e });
      }
    });
    setCategoriesArrToRender([...tempCategoriesArrToRender])
  }

  // useEffect(() => {
  //   let temp = categoriesArrToRender.filter(obj1 => localSelectedCategories.some(obj2 => obj1.national_catid !== obj2.national_catid));
  //   setCategoriesArrToRender(temp)
  //   //national_catid
  // }, [localSelectedCategories])

  useEffect(() => {
    let tempCategoriesArrToRender = [];
    SuggestedCategoriesData.map((e) => {
      let key = (e?.ncid || e?.national_catid);
      key = key?.toString();
      if (!selectedCategories.some((category) => category?.key === key)) {
        tempCategoriesArrToRender.push(e);
      }
      if (key == currentCategoryID?.toString()) {
        setCurrentCategory({ ...e });
      }
    });
    if (SuggestedCategoriesData?.length) {
      setLocalSelectedCategories(selectedCategories)
      setCategoriesArrToRender(tempCategoriesArrToRender || [])
    }
  }, [SuggestedCategoriesData])

  useEffect(() => {
    let tempCategoriesArrToRender = [];
    SuggestedCategoriesData.map((e) => {
      let key = (e?.ncid || e?.national_catid);
      key = key?.toString();
      // if (!selectedCategories.some((category) => category?.key === key) && key !== currentCategoryID?.toString()) {
      if (!selectedCategories.some((category) => category?.key === key)) {
        tempCategoriesArrToRender.push(e);
      }
      if (key == currentCategoryID?.toString()) {
        setCurrentCategory({ ...e });
      }
    });
    if (SuggestedCategoriesData?.length) {
      setLocalSelectedCategories(selectedCategories)
    }
    setCategoriesArrToRender(tempCategoriesArrToRender || [])
  }, [selectedCategories])

  useEffect(() => {
    setLoading(false);
  }, [categoriesArrToRender])

  useEffect(() => {
    if (isShowAll) {
      fetchAllCategories();
    }
  }, [isShowAll])

  if (!categoriesArrToRender.length) {
    return <></>
  }

  return (
    <>
      <p className={`${styles.subtitle} color111`}>Suggested Categories</p>
      <div className={`form ${styles.suggestedcategories__wrap}`}>
        {(categoriesArrToRender?.length && !loading) ? (
          categoriesArrToRender.map((cats, index) => {
            let categoryID = (cats?.ncid || cats?.national_catid);
            return (
              <label
                key={`label_${index}`}
                className={`color007 ${styles.suggestedcategories} ${styles.suggestedcategories__unchecked} ${isSelected(categoryID)
                  ? ''
                  : styles.suggestedcategories__unchecked
                  }`}
                onClick={(e) => selectCategory(e, categoryID, cats?.category_name)}
              >
                <span className={`${styles.catName}`}> {cats?.category_name}</span>
              </label>
            );
          })
        ) : (
          <Shimmer />
        )}
        {/* {!isShowAll ? (
          <button
            onClick={() => setIsShowAll(true)}
            className={`transparentButton font13`}
          >
            + Show More
          </button>
        ) : null} */}
      </div>
    </>
  );
}
