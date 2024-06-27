import React from "react";
import styles from "./features.module.scss";

export default function Features() {
  return (
    <div className={`section`}>
      <div className={`${styles.feature_wrap}`}>
        <div className={`${styles.heading}`}>Features</div>
        <div className={`${styles.feature_ul}`}>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_listing_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Premium Listing</div>
              <div className={`${styles.feature_txt2}`}>Get higher visibility and exposure on Justdial</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/transcation_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Transaction Enabled Website</div>
              <div className={`${styles.feature_txt2}`}>Get professional looking website with your own domain</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/category_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Category Banner</div>
              <div className={`${styles.feature_txt2}`}>Showcase your business on top of your category search</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/payment_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Payment Solutions</div>
              <div className={`${styles.feature_txt2}`}>Send and receive money transactions with your suppliers and customers</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/verified_seal_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Verified Seal</div>
              <div className={`${styles.feature_txt2}`}>Get your business listing verified by Justdial and boost creditability</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/smart_lead_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Smart Lead Management System</div>
              <div className={`${styles.feature_txt2}`}>View and track all your leads at one place</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/trust_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Trust Stamp</div>
              <div className={`${styles.feature_txt2}`}>Become eligible to get a Trust Stamp indicating your business as trustworthy</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/competitor_analysis_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Competitor Analysis</div>
              <div className={`${styles.feature_txt2}`}>Understand how your competitors are performing on Justdial</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/online_catalogue_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Online Catalogue</div>
              <div className={`${styles.feature_txt2}`}>Showcase your product and service offerings to potential customers</div>
            </div>
          </div>
          <div className={`${styles.feature_li}`}>
            <div className={`${styles.feature_img}`}>
              <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_customer_support_icon.svg" />
            </div>
            <div className={`${styles.feature_data}`}>
              <div className={`${styles.feature_txt1}`}>Premium Customer Support</div>
              <div className={`${styles.feature_txt2}`}>Guided onboarding and priority assistance to resolve your queries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
