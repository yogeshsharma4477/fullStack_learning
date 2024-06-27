import React from 'react'
import ContactDetail from './ContactDetail.jsx'
import BusinessDetail from './BusinessDetail.jsx'
import { useRouter } from 'next/router.js'

export default function Dclanding({loggedInMobile, logWorker}) {
  const router = useRouter()
  return (
    <div className={`container__inner`}>
      <div className={`form input_height`} >
        <BusinessDetail logWorker={logWorker}/>
        {
          router.route == "/dc/addcontact" &&
          <ContactDetail loggedInMobile={loggedInMobile} logWorker={logWorker}/>
        }
        {/* <div className={`font14 colorfff toastmessage ${styles.toastmessage}`}>Please enter atleast one contact</div> */}
      </div>
    </div>
  )
}