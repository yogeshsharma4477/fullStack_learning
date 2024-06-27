import React, { useEffect, useRef } from "react";
import modal from "../../styles/modal.module.scss"
import styles from "./businesstiming.module.scss"

const Businesstiming = (props) => {
  return(
      <div className={`${modal.modal__overlay}`}>
        <div className={`${modal.modal} ${modal.modal__small}`}>
          <div className={`${modal.modal__header}`}>
            <button onClick={(e)=>{e.preventDefault(); props.closePopup(); }} className="iconwrap closeicon" />
          </div>
          <div className={`${modal.modal__body} color111 font15 text--center mb-20`}>
            <p>{props.msg}</p>
            <strong>Are you sure you want to continue?</strong>
          </div>
          <div className={`${modal.modal__footer} ${modal.modal__footer__equal}`}>
            <button onClick={(e)=>{e.preventDefault(); props.closePopup(); }} className="secondarybutton fw500 ripple">No</button>
            <button onClick={(e)=>{e.preventDefault(); props.setToRedux(); props.closePopup(); }} className="primarybutton fw500 ripple">Yes, Continue</button>
          </div>
        </div>
      </div>
  )
}

export default Businesstiming;
