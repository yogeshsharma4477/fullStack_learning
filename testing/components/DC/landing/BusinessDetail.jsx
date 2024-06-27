import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateLandingSlice } from '@/store/Slices/dc/landing'
import { areaCityAPI } from '../../getaheadcompetition/APICalls'
import { useRouter } from 'next/router'
import Input from './Input'
import { areaSearchApi } from '../commonAPI'
import { GetPincodeLocationAPI } from '@/components/address/APICalls'

function BusinessDetail({ logWorker }) {
  const { city = "", area = "", pincode = "", businessName = "" } = useSelector(state => state?.dcLandingSlice)
  const dispatch = useDispatch();
  const router = useRouter()
  let isContactPage = router.pathname.includes('/dc/addcontact')
  const [isSelect, setIsSelect] = useState(true);

  const [stateInputs, setStateInputs] = useState([
    {
      id: 1,
      inputName: "city",
      value: city || "",
      display: city || "",
      list: [],
      lastList: [],
      isFocus: false
    },
    {
      id: 2,
      inputName: "area",
      value: area || "",
      display: area || "",
      list: [],
      lastList: [],
      isFocus: false
    },
    {
      id: 3,
      inputName: "pincode",
      value: pincode || "",
      display: pincode || "",
      list: [],
      lastList: [],
      isFocus: false
    }
  ])

  const handleOnChange = (e, name) => {
    e.preventDefault();
    if (name == "pincode") return
    setStateInputs(prev => {
      return prev.map(input => {
        if (input.inputName == name) {
          if (e.target.value.length == 0) {
            return { ...input, display: e.target.value, list: [], lastList: [] }
          } else {
            return { ...input, display: e.target.value }
          }
        } else {
          return input
        }
      })
    })
    setIsSelect(true);
  }

  const handleSelectList = (e, inputName, selectedValue = "") => {
    e.preventDefault()
    dispatch(updateLandingSlice({ name: inputName, value: selectedValue }))
    if (inputName == 'area') {
      let temp = [...stateInputs];
      temp[2].list = temp[2].list[selectedValue] ? temp[2].list[selectedValue].split(',') : []
      temp[2].lastList = temp[2].lastList[selectedValue] ? temp[2].lastList[selectedValue].split(',') : []
      if (temp[2]?.lastList.length == 1) {
        temp[2].value = temp[2]?.lastList[0]
        temp[2].display = temp[2]?.lastList[0]
        dispatch(updateLandingSlice({ name: "pincode", value: temp[2]?.lastList[0] }))
      }
      setStateInputs(temp)
    }
    setStateInputs(prev => {
      return prev.map(input => {
        if (input.inputName == inputName) {
          return { ...input, value: selectedValue, display: selectedValue, list: (inputName == 'pincode') ? input.list : [] }
        } else {
          return input
        }
      })
    })
    setIsSelect(false);
  }

  function handleFocusAndBlur(e, name, type) {
    let isFocus = type == "focus"
    setTimeout(() => {
      setStateInputs(prev => {
        return prev.map(input => {
          if (input.inputName == name) {
            let validSelect = input?.lastList.length ? input?.lastList?.filter(data => input.display == data) : []
            if (!validSelect.length) {
              return { ...input, display: "", value: "", isFocus: isFocus }
            } else {
              return { ...input, isFocus: isFocus }
            }
          } else {
            return input
          }
        })
      })
    }, isFocus ? 0 : 500)
  }

  function handleClearBtn(e, name) {
    e.preventDefault()
    let temp = [...stateInputs]
    let triggeredBtnFound = false
    stateInputs.forEach((data, i) => {
      if (name == data.inputName) {
        triggeredBtnFound = true
      }
      if (triggeredBtnFound) {
        temp[i] = { ...temp[i], value: "", display: "", list: name == "pincode" ? temp[i].list : [], lastList: name == "pincode" ? temp[i].lastList : [], }
      }
    })
    setStateInputs(temp)
  }

  useEffect(() => {
    let timer = null
    let city = stateInputs[0]?.display
    if (city && city.length > 2 && isSelect) {
      timer = setTimeout(() => {
        areaCityAPI({ search: city })
          .then(res => {
            let response = res.data.data.results[0]
            if (response) {
              let filteredResponse = response.filter(data => data.type == "City")
              let filterList = filteredResponse.reduce((acc, curr, i) => {
                acc.push(curr?.city)
                return acc
              }, [])
              let filterInputes = [...stateInputs]
              filterInputes[0].list = filterList || []
              filterInputes[0].lastList = filterList || []
              setStateInputs(filterInputes)
            }
          })
          .catch(e => console.log(e.message, "error"))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [stateInputs[0]?.display])

  useEffect(() => {
    let timer = null
    let area = stateInputs[1]?.display
    let city = stateInputs[0]?.display
    if (area && area.length > 2 && isSelect) {
      timer = setTimeout(() => {
        areaSearchApi({ city: city, str: area })
          .then(res => {
            let response = res?.data?.results?.area_list
            if (response) {
              dispatch(updateLandingSlice({ name: "state", value: response[0].state || "" }))
              let filterList = response.reduce((acc, curr, i) => {
                acc["area"].push(curr?.main_area)
                acc["broader_pincode"][curr?.main_area] = curr?.broader_pincode
                return acc
              }, { "area": [], "broader_pincode": {} })

              let filterInputes = [...stateInputs]
              filterInputes[1].list = filterList.area || []
              filterInputes[1].lastList = filterList.area || []

              filterInputes[2].list = filterList.broader_pincode || {}
              filterInputes[2].lastList = filterList.broader_pincode || {}
              setStateInputs(filterInputes)
            }
          })
          .catch(e => console.log(e.message, "error"))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [stateInputs[1]?.display])

  async function businessNameRedirection() {
    try {
      await logWorker("click")
    } catch (error) {
      console.log(error.message)
    }
    router.push({
      pathname: "/dc/createnewbusiness",
      query: router?.query || {},
    });
  }

  useEffect(() => {
    if (stateInputs[2].value != "") {
      GetPincodeLocationAPI(stateInputs[2].value).then((res) => {
        if (res.data.results.numRows !== 0) {
          dispatch(updateLandingSlice({ name: "stdcode", value: res?.data?.results?.result?.areaname[0]?.stdcode || "" }))
        }
      })
    }
  }, [stateInputs[2].value])

  useEffect(() => {
    if (stateInputs[0].display.length <= 0) {
      let store = [city, area, pincode]
      setStateInputs(prev => {
        return prev.map((input, i) => {
          return { ...input, value: store[i] || "", display: store[i] || "" }
        })
      })
    }
  }, [city, area, pincode])
  return (
    <>
      <Input
        label={"Enter City"}
        name="city"
        value={stateInputs[0].display}
        handleSelectList={handleSelectList}
        list={stateInputs[0].list}
        onChange={(e) => handleOnChange(e, "city")}
        handleFocusAndBlur={handleFocusAndBlur}
        isFocus={stateInputs[0]?.isFocus}
        handleClearBtn={handleClearBtn}
        isDisable={stateInputs[0].value}
        showCancelbtn={isContactPage}
      />

      {stateInputs[0].value &&
        <Input
          label={"Enter Area"}
          name="area"
          value={stateInputs[1]?.display}
          handleSelectList={handleSelectList}
          list={stateInputs[1]?.list}
          onChange={(e) => handleOnChange(e, "area")}
          handleFocusAndBlur={handleFocusAndBlur}
          isFocus={stateInputs[1]?.isFocus}
          handleClearBtn={handleClearBtn}
          isDisable={stateInputs[1].value}
          showCancelbtn={isContactPage}
        />
      }
      {stateInputs[1]?.value &&
        <Input
          label={"Select Pincode"}
          name="pincode"
          value={stateInputs[2]?.display}
          handleSelectList={handleSelectList}
          list={stateInputs[2]?.list}
          onChange={(e) => handleOnChange(e, "pincode")}
          handleFocusAndBlur={handleFocusAndBlur}
          isFocus={stateInputs[2]?.isFocus}
          handleClearBtn={handleClearBtn}
          isDisable={stateInputs[2].value}
          showCancelbtn={isContactPage}
        />
      }
      {
        stateInputs[2]?.value &&
        <div className={`inputwrap mb-20`} >
          <input type="text" className={`input`} value={isContactPage ? businessName : ""} onFocus={businessNameRedirection} onChange={() => { }} disabled={isContactPage} required />
          <label className={`input__label`}>Enter Business Name</label>
        </div>
      }
    </>
  )
}

export default BusinessDetail
