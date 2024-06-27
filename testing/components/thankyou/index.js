import { delete_cookie } from '@/utils/commonFunc';
import { useEffect } from 'react';
import styles from '../../styles/congratulation.module.scss';

export default function Thankyou() {
  return (
    <>
      <div className={`${styles.thankwrap}`}>
        <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/listing_likeimg.svg" alt="" className={`${styles.thankwrap_img}`} />
        <div className={`${styles.thankwrap_text1}`}>Thank You</div>
        <div className={`${styles.thankwrap_text2}`}>For your interest in exploring our services</div>
        <div className={`${styles.thankwrap_text3}`}>Our representative will call you soon with all the details.</div>
        <div className={`${styles.thankwrap_text3}`}>Keep growing your business with Justdial.</div>
        <div className={`${styles.thankwrap_box}`}>
          <div className={`${styles.thankwrap_box_text}`}>Your Current Business Profile Score</div>
          <div className={`${styles.thankwrap_box_text2}`}>
            <span>Fair</span>
            <span>63%</span>
          </div>
          <div className={`${styles.thankwrap_box_progress}`}>
            <div className={`${styles.thankwrap_box_progress_outer}`}>
              <div className={`${styles.thankwrap_box_progress_inner}`}></div>
            </div>
          </div>
          <div className={`${styles.thankwrap_box_flex}`}>
            <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/growth_icon.svg" alt="" />
            <div className={`${styles.thankwrap_box_flex_right}`}>
              <div className={`${styles.thankwrap_box_flex_right_text}`}>Increase your profile score and reach out to more users on Justdial</div>
              <button>Click Here to Increase Your Score</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
