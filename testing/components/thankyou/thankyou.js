import { delete_cookie } from '@/utils/commonFunc';
import { useEffect } from 'react';
import styles from '../../styles/congratulation.module.scss';

export default function Congratulation() {
  const handleClick = ()=>{
    window.location.href = 'https://www.justdial.com/';
  }
  useEffect(() => {
    delete_cookie("docid")
  }, [])
  return (
    <>
      <div className="container__inner flex__col flex__item__center">
        <span className={`iconwrap ${styles.thankcall}`} />
        <div className={`form-wrapper`}>
        <span className={`${styles.congratulation} fw500 color19c mt-15`}>Thank you for requesting a call back</span>
        <span className={`${styles.register__text} ${styles.register__text2} color1a1 mt-20`}>One of our expert will get in touch with you within 48 hours.</span>
        </div>
        <button onClick={handleClick} className={`primarybutton ${styles.continue__button}`}>Continue</button>
      </div>
    </>
  )
}
