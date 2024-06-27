import React, { useEffect, useRef } from "react";
import modal from "../../styles/modal.module.scss";
import styles from "./addbussinesspopup.module.scss";

const Addbussinesspopup = () => {
  return (
    <div className={`${modal.modal__overlay}`}>
      <div className={`${modal.modal} ${styles.addbussinesspopup}`}>
        <div className={`${modal.modal__header} ${styles.modal__header}`}>
          <button className={`iconwrap closeicon`} />
        </div>
        <div className={`${modal.modal__body} ${styles.modal__body} flex flex__col flex__item__center mb-20`}>
          <span className={`iconwrap ${styles.searchbusiness}`} />
          <p className={`color111 font18`}>Your business name contains a restricted keyword hence the contract will be audited and approved within 3 days.</p>
        </div>
        <div className={`${modal.modal__footer} ${styles.modal__footer}`}>
          <button className="secondarybutton fw500 ripple">Go Back</button>
          <button className="primarybutton fw500 ripple">Proceed</button>
        </div>
      </div>
    </div>
  );
};

export default Addbussinesspopup;
