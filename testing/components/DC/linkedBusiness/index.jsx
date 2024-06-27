import React, { useState } from 'react'
import styles from "./styles.module.scss"
import { useRouter } from 'next/router';
import axios from 'axios';
import { redirectToEditListing } from '../commonAPI';
import { sanitizeParams } from '@/utils/commonFunc';
import { useSelector } from 'react-redux';

export async function updatetags(data) {
  const response = await axios({
    method: "post",
    url: "/api/v1/dc/updatetags",
    data: data
  });
  return response
}

const TestingNumbers = ['9561361947', '8147346406', '8097026388']

export default function Businesslinked(props) {
  const { loggedInMobile = "", businessList = [], logWorker = () => { } } = props
  const vendorMobile = useSelector(state => state?.dcLandingSlice.mobile_number)
  const router = useRouter()
  const [selectedTagings, setSelectedTagings] = useState({})
  const [forceRender, setForceRender] = useState(true)
  const sourceCode = sanitizeParams(router?.query?.source)
  const [responceMsg, setResponceMsg] = useState('')
  const [isError, setIsError] = useState(false)

  async function handleRedirection() {
    if (Object.keys(selectedTagings).length !== businessList.length && !TestingNumbers.includes(vendorMobile[0].toString())) {
      setResponceMsg('Please confirm the status of the listed businesses')
      setIsError(true)
    } else {
      try {
        await logWorker("click")
      } catch (error) {
        console.log(error.message)
      }
      router.push({
        pathname: "/dc/businessdetails",
        query: router?.query || {},
      });
    }
  }

  function handleTagging(docid, tag) {
    updatetags(({ docid, tag })).then(res => {
    }).catch(e => console.log(e.message, "tagging error"))
    setSelectedTagings(prev => {
      prev[docid] = tag
      return prev
    })
    setForceRender(!forceRender)
  }

  const setResponceToDefault = () => {
    setResponceMsg('')
  }
  const showToast = () => {
    if (!responceMsg?.length) return
    setTimeout(() => {
      setResponceToDefault()
    }, 3000)
    return (
      <div className={`toastmessage font11 colorfff`}>
        <span className={`toastmessage__text`}>{responceMsg}</span>
        <span
          onClick={setResponceToDefault}
          className={`iconwrap closeiconwhite ripple`}
        />
      </div>
    )
  }
  return (
    <div className={`container__inner`}>
      <p className={`color111 font14 fw600`}>Businesses linked with the contact details entered</p>
      <ul className={styles.linked}>
        {
          businessList && businessList.map(data => {
            const { docid, pincode, compname, areaname, data_city } = data
            return (
              <li className={`pt-20 pb-20`} key={docid}>
                <span className={`${styles.linked__left} mr-8 colorfff font24`}>{compname[0]}</span>
                <span className={styles.linked__right}>
                  <span className={styles.linked__top}>
                    <span className={styles.linked__business}>
                      <span className={`font14 fw600 color111`}>{compname}</span>
                      <span className={`font12 fw500 color777`}>{areaname}, {pincode}</span>
                    </span>
                    <span className={`iconwrap ${styles.rightcircle}`} onClick={() => redirectToEditListing(docid, data_city, compname, sourceCode)} />
                  </span>
                  <span className={`${styles.linked__bottom} ${isError && !selectedTagings[docid] ? styles.error : ""} mt-8`}>
                    <button className={`button secondarybutton ${selectedTagings[docid] == 1 ? styles.active : ""}`} onClick={() => handleTagging(docid, 1)}>Open</button>
                    <button className={`button secondarybutton ${selectedTagings[docid] == 2 ? styles.active : ""}`} onClick={() => handleTagging(docid, 2)}>Close</button>
                    <button className={`button secondarybutton ${selectedTagings[docid] == 3 ? styles.active : ""}`} onClick={() => handleTagging(docid, 3)}>Don’t Know</button>
                    <p className={`${styles.error__div} font12 mt-5`}>Please confirm the status of the listed business</p>
                  </span>
                </span>
              </li>
            )
          })
        }
      </ul>
      <div className={`fixed`}>
        <button className={`button color007 fw500 ${styles.addnewbusiness}`} onClick={handleRedirection}>
          <span className={`iconwrap ${styles.addnewbusiness__icon}`} /> <span className={`ml-8 mr-8`}>Add New Business</span> <span className={`font18`}>+</span>
        </button>
      </div>
      {showToast()}
    </div>
  )
}