import React, { useEffect, useRef } from "react";
import modal from "../../../styles/modal.module.scss";

const doNothingFunc = (e) => {
 if (e) e.preventDefault();
 console.log("do nothong fuction");
};

const Popup = (props) => {
 const {
  closePopup = doNothingFunc,
  msg = "",
  confirmAction = doNothingFunc,
  currentType = null,
 } = props;
 return (
  <div className={`${modal.modal__overlay}`}>
   <div className={`${modal.modal} ${modal.modal__small}`}>
    <div className={`${modal.modal__header}`}>
     <button
      onClick={(e) => {
       e.preventDefault();
       document.body.classList.remove("bodyfixed");
       closePopup();
      }}
      className="iconwrap closeicon"
     />
    </div>
    <div className={`${modal.modal__body} color111 font15 text--center mb-20`}>
     <p>{props.msg}</p>
     <strong>Are you sure you want to continue?</strong>
    </div>
    <div className={`${modal.modal__footer} ${modal.modal__footer__equal}`}>
     <button
      onClick={(e) => {
       e.preventDefault();
       document.body.classList.remove("bodyfixed");
       closePopup();
      }}
      className="secondarybutton fw500 ripple"
     >
      No
     </button>
     <button
      onClick={(e) => {
       e.preventDefault();
       document.body.classList.remove("bodyfixed");
       confirmAction(currentType);
       props.setLoader(true);
      }}
      className="primarybutton fw500 ripple"
     >
      Yes, Continue
     </button>
    </div>
   </div>
  </div>
 );
};

export default Popup;
