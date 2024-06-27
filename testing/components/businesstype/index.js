import React, { useEffect, useRef } from "react";
import modal from "../../styles/modal.module.scss"
import styles from "./businesstype.module.scss"

const Businesstype = () => {
  return(
      <div className={`${modal.modal__overlay}`}>
        <div className={`${modal.modal}`}>
          <div className={`${modal.modal__header}`}>
            <button className="iconwrap closeicon" />
          </div>
          <div className={`${modal.modal__body}`}>
            <div className={`${styles.percentage} mt-20 mb-20 p-10`}>
              <span className={`iconwrap mr-10 mt-3 ${styles.infopercentage}`} />
              <p className="font15">The categories you have selected belong to a different parentage</p>
            </div>
            <div className="color777 font15 mb-20">Please select an appropriate business type</div>
            <label className="radio">
              <input name="businesstype" type="radio" />
              <span className="iconwrap uncheck" />
              <span className={`${styles.labeltext} ml-15`}>
                <span className="color111 font17">Furniture</span>
                <span className="color777 font15">Furniture Dealers</span>
              </span>
            </label>
            <label className="radio">
              <input name="businesstype" type="radio" />
              <span className="iconwrap uncheck" />
              <span className={`${styles.labeltext} ml-15`}>
                <span className="color111 font17">Health &amp; Medical</span>
                <span className="color777 font15">Dentists</span>
              </span>
            </label>
          </div>
          <div className={`${modal.modal__footer}`}>
            <button aria-label="Update" className="primarybutton fw500 ripple">Update</button>
          </div>
        </div>
      </div>
  )
}

export default Businesstype;
