import React, { useEffect, useState } from "react";
import styles from "./suggestedcategories.module.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { currentPage } from "@/store/Slices/CurrentCompoentSlice";
import {
  setSuggestedSubCatsList,
  updateMainCategory,
  updateSuggestedCategory,
  updateHashTable,
} from "@/store/Slices/categories";
import { addSuggestedCategories } from "@/store/Slices/categories";
import { useRouter } from "next/router";
import Link from "next/link";
import Shimmer from "../shimmer";

async function fetchSuggestedCategory(keyword) {
  try {
    const categories = await axios.get(`/api/v1/subCategory/${keyword}`);
    return categories.data;
  } catch (error) {
    return error;
  }
}

export default function Suggestedcategories({
  currentSelected,
  setShowSuggested,
  suggestions,
  setSelectedSuggestions,
}) {
  // const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  // const mainCategory = useSelector((state) => state.categories.mainCategory);
  // const router = useRouter();
  // const suggestedCats = useSelector(
  //   (state) => state.categories.suggestedCategory
  // );
  const categoryHashTable = useSelector((state) => state.categories.hashCats);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   fetchSuggestedCategory(currentSelected.mcn || currentSelected.catname)
  //     .then((data) => {
  //       // setListSuggestions(data.results);
  //       console.log(data);
  //       setSelectedSuggestions(() => {
  //         if (data.results.length > 14) {
  //           return data.results
  //             .slice(0, 15)
  //             .map((cats) => ({ ...cats, selected: true }));
  //         }
  //         return data.results.map((cats) => ({ ...cats, selected: true }));
  //       });
  //       // dispatch(
  //       //   updateSuggestedCategory(
  //       //     data.results
  //       //       .slice(0, 3)
  //       //       .map((cats) => ({ ...cats, selected: true }))
  //       //   )
  //       // );
  //       dispatch(setSuggestedSubCatsList(data.results));
  //     })
  //     .catch((e) => console.log(e));
  // }, []);

  // const deSelectCategory = (category) => {
  //   setSelectedSuggestions((suggestions) =>
  //     suggestions.map((cats, index) => {
  //       if (cats.national_catid === category.national_catid) {
  //         return {
  //           ...cats,
  //           selected: !cats.selected,
  //         };
  //       }
  //       return { ...cats };
  //     })
  //   );
  //   dispatch(updateSuggestedCategory(category));
  // };

  // const unSelectMainCategory = () => {
  //   dispatch(updateMainCategory(""));
  //   router.replace("/addmaincategory");
  // };

  const selectDeSelect = (category) => {
    dispatch(updateHashTable(category));
  };
  const saveAndContinue = () => {
    setIsLoading(true);
    setShowSuggested(false);
    setSelectedSuggestions([]);
  };

  return (
    <>
      <div className="container__inner">
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
              onClick={() => unSelectMainCategory()}
              className={`iconwrap ${styles.bluecheck} mr-10`}
            />
            <span className={`color414 font14`}>
              {currentSelected.mcn || currentSelected.catname}
            </span>
          </label>
          <p className={`${styles.content} color111`}>
            Based on your selected category we are suggesting following
            categories which would help you in getting more exposure.
          </p>
          <div className={`form`}>
            {suggestions ? (
              suggestions.map((cats, index) => {
                if (
                  // !categoryHashTable[
                  //   `${cats.national_catid}/${cats.associate_national_catid}`
                  // ]
                  true
                ) {
                  return (
                    // console.log(cats.national_catid)
                    <label
                      key={`label_${index}`}
                      className={`${styles.suggestedcategories} ${
                        !categoryHashTable[
                          `${cats.national_catid}/${cats.associate_national_catid}`
                        ]
                          ? styles.suggestedcategories__unchecked
                          : ""
                      }`}
                    >
                      <span
                        onClick={() => {
                          selectDeSelect({ ...cats });
                        }}
                        className={`iconwrap ${styles.bluecheck} mr-10`}
                      />
                      <span className={`color414 font14`}>{cats.catname}</span>
                    </label>
                  );
                }
              })
            ) : (
              <Shimmer />
            )}
{            !isLoading ?
                    <button
                        className='primarybutton fw500 ripple mt-10'
                        onClick={saveAndContinue}
                        >
                        Save and Continue
                    </button>
                    :
                    <button
                        disabled
                        className={`primarybutton mt-10`}
                    >
                        <span className='btn-loader' />
                    </button>}
            
          </div>
        </div>
      </div>
    </>
  );
}
