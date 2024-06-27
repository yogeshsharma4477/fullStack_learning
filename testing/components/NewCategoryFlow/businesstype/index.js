import React, { useEffect, useReducer, useRef, useState } from "react";
import modal from "../../../styles/modal.module.scss";
import styles from "./businesstype.module.scss";

const Businesstype = ({
  majorCatsDetails,
  handleUpdateClick,
  closeModal,
}) => {

  let parentCategoryArr = Object.keys(majorCatsDetails) || [];
  let categoryArr = Object.values(majorCatsDetails) || [];
  let allSelectedCatIDArr = [];
  const [showMore, setShowMore] = useState([])
  const [updatedCategoryArr, setUpdatedCategoryArr] = useState([])

  function trimStringWithEllipsis(inputString, maxLength) {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength - 3) + '...';
    }
  }
  

  useEffect(()=>{
    let tempShowMoreArr = []
    categoryArr = categoryArr.map(item => {
      const catNameArr = item.catname.split('|~|');
      const newCatName = catNameArr.join(', ') || '';
      const initialCatName = trimStringWithEllipsis(newCatName, 100) || '';
      const newCatid = item.catid.split('|~|').join(', ') || '';
      const tempCatIdArr = newCatid.split(', '); 
      
      if(newCatName.length>100){
        tempShowMoreArr.push(true);
      } else {
        tempShowMoreArr.push(false);
      }
      allSelectedCatIDArr=[...allSelectedCatIDArr, ...tempCatIdArr];
      return { catname: newCatName, initialCatName: initialCatName, catid: newCatid }
    });
    console.log(tempShowMoreArr)
    setUpdatedCategoryArr([...categoryArr])
    console.log("tempShowMoreArr", tempShowMoreArr)
    setShowMore([...tempShowMoreArr])
  }, [])

  function handleCategorySelect(selectedCatID='') {
    let tempSelectedArr = selectedCatID.split(', ');
    allSelectedCatIDArr = tempSelectedArr;
  }

  return (
    <div className={`${modal.modal__overlay}`}>
      <div className={`${modal.modal} ${styles.category__modal}`}>
        <div className={`${modal.modal__header}`}>
          <button className="iconwrap closeicon" onClick={closeModal} />
        </div>
        <div className={`${modal.modal__body} ${styles.modal__body} customscroll`}>
          <div className={`${styles.percentage} mt-20 mb-20 p-10`}>
            <span className={`iconwrap mr-10 mt-3 ${styles.infopercentage}`} />
            <p className="font15">
              The categories you have selected belong to a different parentage
            </p>
          </div>
          <div className="color777 font15 mb-20">
            Please select an appropriate business type
          </div>
          {parentCategoryArr.map((name, index) => (
            <label className="radio">
              <input
                onChange={(e) => {
                  if (e.target?.checked) {
                    handleCategorySelect(updatedCategoryArr[index]?.catid);
                  }
                }}
                name="businesstype"
                type="radio"
              />
              <span className="iconwrap uncheck" />
              <span className={`${styles.labeltext} ml-15`}>
                <span className="color111 font17">{name}</span>
                <span className="line_clamp_1">
                  <span className="color777 font15">
                    {!showMore[index]?
                      updatedCategoryArr[index]?.catname
                      :
                      updatedCategoryArr[index]?.initialCatName
                    }
                  </span>
                  {showMore[index]?
                  (
                    <button 
                    className={`transparentButton ml-10`}
                    style={{ fontWeight: '400' }}
                    onClick={(e)=>{
                      e.preventDefault();
                      let tempShowMore = [...showMore];
                      tempShowMore[index] = false;
                      setShowMore([...tempShowMore])
                    }}>
                      + View More
                    </button>
                  )
                  :null}
                </span>
              </span>
            </label>
          ))}
        </div>
        <div className={`${modal.modal__footer}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleUpdateClick(allSelectedCatIDArr);
            }}
            className="primarybutton fw500 ripple"
          >
            {"Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Businesstype;
