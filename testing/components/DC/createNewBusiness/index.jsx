import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Validbusinessname from '../validbusinessname'
import Selectbusiness from '../selectbusiness'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { updateLandingSlice } from '@/store/Slices/dc/landing';
import { generateDCToken, getCookie, set_cookie, sanitizeParams } from "@/utils/commonFunc";
import { isBadWord } from '@/utils/api';
import { isFieldEmpty } from '@/utils/validations';
import { companySearchApi, redirectToEditListing, updateDcDetailsApi } from '../commonAPI';
var CryptoJS = require('crypto-js')

export default function Newbusiness(props) {
  const { loggedInMobile, logWorker } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const { city = "", area = "", pincode = "", businessName = "", stdcode, state = "" } = useSelector(state => state?.dcLandingSlice)
  const [searchCompany, setSearchCompany] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [existingBusiness, setExistingBusiness] = useState(null)
  const [companyLists, setCompanyLists] = useState([])
  const sourceCode = sanitizeParams(router?.query?.source)

  useEffect(() => {
    let timer = null
    if (searchCompany && searchCompany.length > 2) {
      timer = setTimeout(() => {
        companySearchApi({ pincode, str: searchCompany })
          .then(res => {
            let response = res?.data?.results?.results?.organic_res
            if (response) {
              let values = Object.values(response)
              setCompanyLists(values || [])
            }
          })
          .catch(e => console.log(e.message, "error"))
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setCompanyLists([])
    }
  }, [searchCompany])

  const checkBadWord = async (word, city) => {
    return await isBadWord(word, city)
  }

  const bussinessNameCheck = async (value, city) => {
    let invalid_business_name = 'Please Enter a Valid Business Name'
    let isErr = true

    //empty
    if (isFieldEmpty(value)) {
      setErrorMsg('Please Enter a Business Name')
    } else {
      const badWordAPICall = await checkBadWord(value, city)
      if (badWordAPICall?.typeErr == 'legalword') {
        setErrorMsg(invalid_business_name)
        set_cookie("legalWord", "1")
        return true
      } else {
        set_cookie("legalWord", "0")
      }

      const encryptedStr = badWordAPICall?.encryptedCode || ''
      let salt = 'zhsmaj3GKL2CulM0v4KQWgumwVCTKOzy'
      let decrypt_msg = CryptoJS.AES.decrypt(encryptedStr, salt).toString(
        CryptoJS.enc.Utf8
      )

      if (badWordAPICall?.typeErr == 'badword') {
        if (badWordAPICall?.results?.block?.badwordFlag == 1) {
          // setErrorMsg(badWordAPICall?.results?.block?.msg[0] || invalid_business_name)
          setErrorMsg(invalid_business_name)
        } else {
          // setErrorMsg(badWordAPICall?.results?.block?.msg[0] || invalid_business_name)
          setErrorMsg(invalid_business_name)
        }
      } else {
        if (decrypt_msg !== `${value}${'true'}`) {
          // setErrorMsg(badWordAPICall?.results?.block?.msg[0] || invalid_business_name)
          setErrorMsg(invalid_business_name)
        } else {
          isErr = false
        }
      }
    }
    return isErr
  }

  async function update_dc_database(compname) {
    let token = null
    if (!getCookie("dcToken")) {
      token = generateDCToken(16)
      set_cookie("dcToken", token)
    } else {
      token = getCookie("dcToken")
    }
    let payload = {
      // token: token || "",
      vendor_std_code: stdcode || "",
      city: city || "",
      area: area || "",
      state: state || "",
      pincode: pincode || "",
      business_name: compname || "",
      dc_mobile_number: loggedInMobile || "",
    }

    try {
      await updateDcDetailsApi(payload)
    } catch (error) {
      console.log(error.message)
    }
  }

  async function handleRedirection() {
    try {
      await logWorker("click")
    } catch (error) {
      console.log(error.message)
    }
    let isBadWord = await bussinessNameCheck(searchCompany, city)
    if (isBadWord) {
      return
    }
    dispatch(updateLandingSlice({ name: "businessName", value: searchCompany }))
    await update_dc_database(searchCompany)
    router.push({
      pathname: "/dc/addcontact",
      query: router?.query || {},
    });
  }


  return (
    <main>
      <header className={styles.header}>
        <div className={styles.header__left}>
          <button className={`button iconwrap backicon`} onClick={() => router.back()} />
        </div>
        <div className={styles.header__right}>
          <input type="text" placeholder='Enter Business Name' value={searchCompany} onChange={(e) => setSearchCompany(e.target.value)} />
        </div>
      </header>
      <section className={`${styles.body}`}>
        {searchCompany && <Business businessName={searchCompany} handleRedirection={handleRedirection} />}
        {companyLists.length > 0 && <List setExistingBusiness={setExistingBusiness} companyLists={companyLists} businessName={searchCompany} update_dc_database={update_dc_database} />}
        {!searchCompany && <Nobusiness />}
      </section>
      {errorMsg && <Validbusinessname message={errorMsg} handleCallback={() => setErrorMsg("")} />}
      {existingBusiness && <Selectbusiness
        headingtxt="Please confirm that you have selected the business below"
        subtxtF14={existingBusiness?.compname || ""}
        subtxtF13={existingBusiness?.address_search || ""}
        handleConfirmCB={() => { redirectToEditListing(existingBusiness?.docid, existingBusiness?.data_city, existingBusiness?.compname, sourceCode) }}
        handleCancelCB={() => { setExistingBusiness(null) }}
      />}
    </main >
  )
}

function Business({ businessName, handleRedirection }) {
  return (
    <div className={styles.business__wrap}>
      <button className={`button transparentButton p-10 ${styles.business__new}`} onClick={handleRedirection}>+ Create New Business</button>
      <span className={styles.business__name}> '{businessName}'</span>
    </div>
  )
}

function Nobusiness() {
  return (
    <div className={`${styles.nobusiness} pt-10 pb-10`}>
      <span className={`iconwrap mr-8 ${styles.nobusiness__icon}`} />
      <span className={`${styles.nobusiness__text} font13`}>Enter Business Name</span>
    </div>
  )
}

function List({ businessName, companyLists, update_dc_database, setExistingBusiness }) {
  if (!companyLists?.length) return <></>

  async function handleRedirect(data_obj) {
    setExistingBusiness(data_obj)
    await update_dc_database("")
  }
  return (
    <ul className={styles.business}>
      {
        companyLists && companyLists.map(data => {
          const { docid, compname, areaname, pincode, data_city } = data
          return (
            <li className={styles.business__list} key={docid} onClick={() => handleRedirect(data)}>
              <span className={`font14 color111`}>
                {/* {data?.compname.slice(0, data?.compname?.toLowerCase().indexOf(businessName.toLowerCase()))} */}
                {/* <span className={`fw500`}>{data?.compname.slice(data?.compname?.toLowerCase().indexOf(businessName.toLowerCase()), businessName.length)}</span> */}
                {compname}
              </span>
              <span className={`font12`}>{`${areaname ? `${areaname}, ` : ""}`}{pincode}</span>
            </li>
          )
        })
      }
    </ul>
  )
}