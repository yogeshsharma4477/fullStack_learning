import modal from "../../../styles/modal.module.scss";
import styles from "./styles.module.scss"; 

export default function Validbusinessname({message,handleCallback}) {
    return (
        <div className={`${modal.modal__overlay}`}>
            <div className={`${modal.modal} ${styles.modal}`}>
                <div className={`${modal.modal__body} mb-20 text--center`}>
                    <p className={`color111 font16 fw500`}>{message}</p>
                </div>
                <div className={`${modal.modal__footer} ${styles.modal__footer}`}>
                    <button className="primarybutton fw500 ripple" onClick={handleCallback}>ok, Got it</button>
                </div>
            </div>
        </div>
    )
}
