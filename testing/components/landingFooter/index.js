import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./landingfooter.module.scss";


export async function getFooter() {
  const response = await axios({
    method: "get",
    url: "/api/v2/footer",
  });
  return response
}

export default function Landingfooter() {
  const [footer, setFooter] = useState('<div></div>')
  useEffect(() => {
    getFooter().then((res) => {
      if (res?.data?.success) {
        setFooter(res?.data?.results)
      } else {
        setFooter('<div></div>')
      }
    }).catch(e => {
      console.log(e);
    })
  }, [])
  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: footer }}
      />
    </>
    // <footer className={`${styles.footer} color111 font15`}>
    //   <div className={`section`}>
    //   <div className={`${styles.links_wrap}`}>
    //     <div className={`${styles.heading}`}>Popular Categories</div>
    //     <div className={`${styles.links}`}>
    //       <a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a><a href="#">Movies</a><a href="#">Cinema Halls</a>
    //     </div>
    //   </div> 
    //   <div className={`${styles.social}`}>
    //     <div className={`${styles.social_left}`}>
    //       <span className={`${styles.social_text}`}>Follow us on</span>
    //       <a className={`${styles.social_icon} ${styles.facebook}`}></a>
    //       <a className={`${styles.social_icon} ${styles.youtube}`}></a>
    //       <a className={`${styles.social_icon} ${styles.instagram}`}></a>
    //       <a className={`${styles.social_icon} ${styles.linkedin}`}></a>
    //       <a className={`${styles.social_icon} ${styles.twitter}`}></a>
    //     </div>
    //     <div className={`${styles.social_right}`}>
    //       <a className={`${styles.social_rbox}`}>
    //         <img alt="jd on playstore" src="https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/getapp_googleplay.png" className={`${styles.social_rbox_img}`} />
    //       </a>
    //       <a className={`${styles.social_rbox}`}>
    //         <img alt="jd on playstore" src="https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/getapp_appstore.png" className={`${styles.social_rbox_img}`} />
    //       </a>
    //     </div>
    //   </div>
    //   <div className={`${styles.links_wrap}`}>
    //     <div className={`${styles.heading_sml}`}>Explore JD Collections</div>
    //     <div className={`${styles.links}`}>
    //       <a href="#">Travel & Tourism</a><a href="#">Travel & Tourism</a><a href="#">Travel & Tourism</a><a href="#">Travel & Tourism</a><a href="#">Travel & Tourism</a>
    //     </div>
    //   </div>
    //   <div className={`${styles.quick_links}`}>
    //     <div className={`${styles.quicklinks_left}`}>
    //       <div className={`${styles.quicklink_head}`}>Quick Links</div>
    //       <ul className={`${styles.quick_linksul}`}>
    //         <li>
    //           <a href="">About Us</a>
    //         </li>
    //         <li>
    //           <a href="">Advertise</a>
    //         </li>
    //         <li>
    //           <a href="">Investor Relations</a>
    //         </li>
    //         <li>
    //           <a href="">Media</a>
    //         </li>
    //         <li>
    //           <a href="">We're hiring</a>
    //         </li>
    //         <li>
    //           <a href="">Testimonials</a>
    //         </li>
    //         <li>
    //           <a href="">Costomer Care</a>
    //         </li>
    //         <li>
    //           <a href="">Feedback</a>
    //         </li>
    //         <li>
    //           <a href="">Free Listing</a>
    //         </li>
    //         <li>
    //           <a href="">Business Badge</a>
    //         </li>
    //         <li>
    //           <a href="">What's New</a>
    //         </li>
    //       </ul>
    //     </div>
    //     <div className={`${styles.quicklinks_right}`}>
    //       <div className={`${styles.quicklink_head}`}>Jd Verticals</div>
    //       <ul className={`${styles.quick_linksul}`}>
    //       <li>
    //         <a href="">Jdmart</a>
    //       </li>
    //       <li>
    //         <a href="">Book a table</a>
    //       </li>
    //       <li>
    //         <a href="">Real Estate</a>
    //       </li>
    //       <li>
    //         <a href="">Movies</a>
    //       </li>
    //       <li>
    //         <a href="">Entertainment</a>
    //       </li>
    //       <li>
    //         <a href="">Doctors</a>
    //       </li>
    //       <li>
    //         <a href="">Bills & Recharge</a>
    //       </li>
    //       <li>
    //         <a href="">AC Repair</a>
    //       </li>
    //       <li>
    //         <a href="">Flights</a>
    //       </li>
    //       <li>
    //         <a href="">Bus</a>
    //       </li>
    //       <li>
    //         <a href="">Train</a>
    //       </li>
    //       <li>
    //         <a href="">Hotels</a>
    //       </li>
    //       <li>
    //         <a href="">Car service</a>
    //       </li>
    //       <li>
    //         <a href="">Hospitals</a>
    //       </li>
    //       <li>
    //         <a href="">Jobs</a>
    //       </li>
    //       <li>
    //         <a href="">Automobile</a>
    //       </li>
    //       <li>
    //         <a href="">Jd Xperts</a>
    //       </li>
    //       </ul>
    //     </div>
    //   </div>
    //   <div className={`${styles.copyright}`}>
    //     Copyrights 2008-23.  &nbsp;All Rights Reserved. &nbsp;<a href="https://www.justdial.com/Privacy-Policy">Privacy</a><a href="https://www.justdial.com/Privacy-Policy">Terms</a><a href="https://www.justdial.com/Privacy-Policy">Infringement</a>
    //   </div>
    //   </div>
    // </footer>
  );
}
