import React, { useState, useEffect } from "react";
import styles from "./suggestedcategories.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  addRemoveSelectedCategory,
  setCurrentSuggestion,
  setSuggestionScreen,
} from "@/store/Slices/category";
import Shimmer from "../../shimmer";

export default function Suggestedcategories() {
  const [showAll, setShowAll] = useState(false);
  const getSuggestions = useSelector(
    (state) => state?.category?.suggestedCategory || []
  );
  const selectedCategoryList = useSelector((state) => state?.category?.selectedCategory || {});

  const selectedCategoryListArr = Object.keys(selectedCategoryList) || [];

  let suggestedCategory = [];

  if(Array.isArray(getSuggestions)){
    suggestedCategory=[]
    getSuggestions.map((e)=>{
      let key = e?.national_catid || e?.ncid || null;
      if(!selectedCategoryListArr.includes(key.toString())){
        suggestedCategory.push(e)
      }
    })
  } else {
    suggestedCategory = getSuggestions
  }

  
  const loading = useSelector((state) => state.category.loading);
  const selectedCats = useSelector((state) => state.category.selectedCategory);
  const currentMainCategory = useSelector(
    (state) => state.category.currentSelectedCategory
  );

  useEffect(() => {
    if (!selectedCats[currentMainCategory.ncid]) {
      dispatch(addRemoveSelectedCategory(currentMainCategory));
    }
  }, []);

  const dispatch = useDispatch();

  function addRemoveCategory(maincat) {
    dispatch(addRemoveSelectedCategory(maincat));
    if (maincat.ncid === currentMainCategory.ncid) {
      dispatch(setCurrentSuggestion({}));
      dispatch(setSuggestionScreen({ flag: false }));
    }
  }
  const saveAndContinue = () => {
    dispatch(setSuggestionScreen({ flag: false }));
    dispatch(setCurrentSuggestion({}));
  };

  return (
    <>
      <div className={`${styles.containersuggess__inner}`}>
        <div className={`container__inner__left`}>
          <div className={`left__img ${styles.left__img}`} />
        </div>
        <div className={`container__inner__right`}>
          <progress className={`${styles.progressbar}`} value="75" max="100" />
          <p className={`${styles.title} color111 fw600`}>
            Suggested categories
          </p>
          <label className={`${styles.suggestedcategories} mb-20 mt-20`}>
            <span
              onClick={() => addRemoveCategory(currentMainCategory)}
              className={`iconwrap ${styles.bluecheck} mr-10`}
            />
            <span className={`color414 font14`}>
              {currentMainCategory.mcn || currentMainCategory.catname}
            </span>
          </label>
          <p className={`${styles.content} color111`}>
            Based on your selected category we are suggesting following
            categories which would help you in getting more exposure.
          </p>
          <div className={`form`}>
            {suggestedCategory.length > 0 && !loading ? (
              suggestedCategory
                .slice(0, showAll ? suggestedCategory.length : 4)
                .map((cats, index) => {
                  if (currentMainCategory.ncid !== cats.national_catid) {
                    return (
                      <label
                        key={`label_${index}`}
                        className={`${styles.suggestedcategories} ${
                          !selectedCats[cats.national_catid]
                            ? styles.suggestedcategories__unchecked
                            : ""
                        }`}
                        onClick={() => {
                          addRemoveCategory({ ...cats });
                        }}
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
            {!showAll ? (
              <button
              onClick={() => setShowAll(!showAll)}
                className={`transparentButton font13`}
              >
                + Show More
              </button>
            ) : null}
            <button
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
