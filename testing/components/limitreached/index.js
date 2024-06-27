import React, { useEffect, useRef } from "react";
import modal from "../../styles/modal.module.scss";
import styles from "./limitreached.module.scss";
import { useRouter } from "next/router";

const Limitreached = () => {
  const router = useRouter();
  return (
    <div className={`${modal.modal__overlay}`}>
      <div className={`${modal.modal} ${styles.limitpopup}`}>
        <div className={`${modal.modal__body}`}>
          <div className={`${styles.limitwrap}`}>
            <span className={`iconwrap ${styles.limiticon}`} />
            <strong className="fw500 font20 mt-20">Limit Reached</strong>
            <p className="font16 color111">
              Maximum attempts were made for this mobile number.
            </p>
            <p className="font16 color111">Retry after 24 hours.</p>
            <p className="font14 color111 pb-10">
              For security reasons the number of attempts is limited
            </p>
          </div>
        </div>
        <div className={`${modal.modal__footer}`}>
          <button
            className="primarybutton fw500 ripple"
            onClick={() => router.replace("/")}
          >
            GO TO HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default Limitreached;
