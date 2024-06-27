import { useState } from "react";
import modal from "../../../styles/modal.module.scss";
import styles from "./styles.module.scss";

export default function Selectbusiness({ headingtxt,subtxtF14, subtxtF13, handleConfirmCB, handleCancelCB }) {
    return (
        <div className={`${modal.modal__overlay}`}>
            <div className={`${modal.modal} ${styles.modal}`}>
                <div className={`${modal.modal__body} mb-20 text--center color111`}>
                    <p className={`font16 fw500`}>{headingtxt}</p>
                    <div className={`${styles.business} mt-20 p-5`}>
                        <b className={`font14 fw500`}>{subtxtF14}</b>
                        <p className={`font13`}>{subtxtF13}</p>
                    </div>
                </div>
                <div className={`${modal.modal__footer} ${styles.modal__footer}`}>
                    <button className="primarybutton fw500 ripple" onClick={()=>handleConfirmCB()}>Confirm</button>
                    <button className="secondarybutton fw500 ripple" onClick={()=>handleCancelCB()}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
