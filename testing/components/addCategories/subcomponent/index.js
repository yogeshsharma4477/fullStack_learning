import React, { useEffect, useRef } from "react";
import modal from "../../../styles/modal.module.scss";
import { useState } from "react";

const doNothingFunc = (e) => {
  if (e) e.preventDefault();
  console.log("do nothong fuction");
};

const Popup = (props) => {
  const {
    closePopup = doNothingFunc,
    msg = "",
    confirmAction = doNothingFunc,
    categoryList = [],
    currentType = null,
  } = props;
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className={`${modal.modal__overlay}`}>
      <div className={`${modal.modal} ${modal['time_popup']}`}>
        <div className={`${modal.modal__header}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              document.body.classList.remove("bodyfixed");
              setIsLoading(false)
              closePopup();
            }}
            className="iconwrap closeicon"
          />
        </div>
        <div className={`${modal.modal__body} color111 mb-30`}>
          <p className='font18'>{msg}</p>
          <ul className='mt-20 mb-20 font14'>
            {
              categoryList.map((catName) => {
                return (
                  <>
                    <li><span className={`${modal.disc} mr-10`}></span>{catName}</li>
                  </>
                )
              })
            }
          </ul>

        </div>
        <div className={`${modal.modal__footer} ${modal.modal__footer__equal}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              document.body.classList.remove("bodyfixed");
              setIsLoading(false)
              closePopup();
            }}
            className="secondarybutton fw500 ripple"
          >
            Cancel
          </button>
          {
            !isLoading ?
              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.body.classList.remove("bodyfixed");
                  confirmAction(currentType);
                  setIsLoading(true)
                }}
                className="primarybutton fw500 ripple"
              >
                Okay
              </button>
              :
              <button disabled className={`primarybutton fw500 ripple`}>
                <span className="btn-loader" />
              </button>
          }

        </div>
      </div>
    </div>
  );
};

export default Popup;
 