import React from "react";
import modal from "../../../styles/modal.module.scss";
import styles from "../businesstype/businesstype.module.scss";

const Categorycombo = ({
  selectedCategory=[],
  closeModal,
  categoryComboErrMsg,
}) => {

  return (
    <div className={`${modal.modal__overlay}`}>
      <div className={`${modal.modal} ${styles.category__modal}`}>
        <div className={`${modal.modal__header}`}>
          <button className="iconwrap closeicon" onClick={closeModal} />
        </div>
        <div className={`${modal.modal__body} ${styles.modal__body} customscroll`}>
          <div className={`${styles.percentage} mt-20 mb-20 p-10`}>
            <span className={`iconwrap mr-10 ${styles.infopercentage}`} />
            <p className="font15 m-0">{categoryComboErrMsg}</p>
          </div>
          {selectedCategory.map((data, index) => (
            <label key={`categorycombopopup_category_${data.label}_${index}`} className={`radio ${styles["no-border-bottom"]}`}>
              <span className={`${styles.disc}`} />
              <span className={`${styles.labeltext} ml-15`}>
                <span className="color111 font17">{data.label}</span>
              </span>
            </label>
          ))}
        </div>
        <div className={`${modal.modal__footer}`}>
          <button
            onClick={() => {
              closeModal();
            }}
            className="primarybutton fw500 ripple"
          >
            {"Ok"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categorycombo;
