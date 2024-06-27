import styles from './addcategories.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import {
    fetchMainCategories,
    fetchSuggestionForMainSelection,
    addRemoveSelectedCategory,
    closeErrorPop,
} from '@/store/Slices/category'
import useDebounce from '@/hooks/useDebounce'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Businesstype from '../businesstype'
import Categorycombo from '../categorycombo'
import useClickOutside from '@/hooks/useClickOutSide'
import Link from 'next/link'
import Image from 'next/image'
import clickTracker from '@/utils/clickTracker'
import { sanitizeParams } from '@/utils/commonFunc'
var CryptoJS = require('crypto-js')

async function PostAddressAPI(data) {
    const response = await axios({
        method: 'post',
        url: '/api/v1/InsertAPI',
        data: data,
    })
    return response
}

const multiParentCheck = async (
    parentid,
    catid_list,
    req_data_city,
    data_city
) => {
    try {
        const response = await axios.get('/api/v1/multiparentagecheck', {
            params: {
                parentid,
                catid_list,
                req_data_city,
                data_city,
            },
        })
        return response.data
    } catch (error) {
        return error
    }
}

const MainCategory = ({ IP }) => {
    const inputRef = useRef(null)
    const [keyword, setKeyword] = useState('')
    const dispatch = useDispatch()
    const searchKeyDebounce = useDebounce(keyword, 100)
    const [isLoading, setIsLoading] = useState(false)
    const dropdown = useSelector((state) => state.category.dropdownData)
    const category = useSelector((state) => state.category)
    const [modal, setModal] = useState(false)
    const [modalcombo, setModalcombo] = useState(false)
    const updatedCatID = useRef('')
    const router = useRouter()
    const comboErrMsg = useRef('')
    const [dropdownActiveIndex, setDropdownActiveIndex] = useState(0)
    const dropDownContainer = useRef('')
    const [responceMsg, setResponceMsg] = useState('')
    const sourceCode = sanitizeParams(router?.query?.source)

    useEffect(() => {
        if (keyword.length > 3) {
            dispatch(fetchMainCategories({ keyword: keyword }))
        }
    }, [searchKeyDebounce])

    function addRemoveCategory(maincat) {
        dispatch(addRemoveSelectedCategory(maincat))
    }

    const closeModal = () => {
        document.body.style.overflow = 'unset'
        setModal(false)
    }

    const closeCategoryComboPopup = () => {
        document.body.style.overflow = 'unset'
        setModalcombo(false)
    }

    const parentInfo = useSelector((state) => state.CommonValues)
    const addressInfo = useSelector((state) => state.Address)
    const [multiparent, setMultiparent] = useState({})
    useClickOutside(inputRef, () => {
        setDropdownActiveIndex(0)
        setKeyword('')
    })

    function fetchErrMsg(msg) {
        switch (msg) {
            case 'EconomyLuxuryRestriction':
                comboErrMsg.current =
                    'Please add either economy or luxury category.'
                break
            case 'LandlineMandatoryTagged':
                comboErrMsg.current = `Note : This Category ${
                    responce?.data?.data['BLOCK'][
                        'LandlineMandatoryCategory'
                    ] || ''
                } is landline tagged category, Please enter landline number.`
                break
            case 'fastFoodRestRestriction':
                comboErrMsg.current = ''
                let catNameArr =
                    responce?.data?.data['BLOCK']['rest_catname'] || []
                catNameArr.map((e, i) => {
                    if (catNameArr.length - 1 == i) {
                        comboErrMsg.current += ` and ${e}`
                    } else if (catNameArr.length - 2 == i) {
                        comboErrMsg.current += e
                    } else {
                        comboErrMsg.current += `${e},`
                    }
                })
                comboErrMsg.current += ' Categories are not allowed.'
                break
            case 'PurevegNonvegRestriction':
                comboErrMsg.current = ''
                let purcatnameArr =
                    responce?.data?.data['BLOCK']['PureVegCategory']
                purcatnameArr.replaceAll(/|~|/g, ',')
                let noncatnameArr =
                    responce?.data?.data['BLOCK']['NonVegCategory']
                noncatnameArr.replaceAll(/|~|/g, ',')
                comboErrMsg.current = `You Are Not Allowed To Add Both Pure Veg ${purcatnameArr} And Non Veg ${noncatnameArr} Category. Kindly Remove One Of The Category Of Pure Veg Or Non Veg.`
                break
            case 'StarRatingTagged':
                comboErrMsg.current =
                    'You Are Not Allowed To Add Multiple Star Tagged Category.'
                break
            case 'drySateCatRest':
                comboErrMsg.current =
                    'You Are Not Allowed To Add Following Liquor Tagged Category In Dry States.'
                break
            case 'PriceFiltersRestriction':
            case 'RestPriceFilterTagged':
                comboErrMsg.current = ''
                if (
                    responce?.data?.data['BLOCK']['message'] ==
                    'PriceFiltersRestriction'
                )
                    comboErrMsg.current =
                        'Below price combination is not allowed.'
                else
                    comboErrMsg.current =
                        'Kindly select any 2 price range from below mentioned categories.'
                break
            default:
                comboErrMsg.current =
                    'Following category combination is not allowed.'
                break
        }
    }

    async function proceedToNextPage(catlist) {
        document.body.style.overflow = 'unset'

        const {
            docid = null,
            parentid = null,
            sphinx_id = null,
            source = null,
            companyName = null,
        } = parentInfo || {}
        const { city } = addressInfo || {}

        if (
            !(docid && parentid && sphinx_id && source && companyName && city)
        ) {
            setResponceMsg('Something Went Wrong.')
            setIsLoading(false)
            return
        }

        let postAddressObject = {
            docid: docid,
            parentid: parentid,
            sphinx_id: sphinx_id,
            source: sourceCode,
            city: city,
            data_city: city,
            legalcompanyname: companyName,
            companyname: companyName,
            national_catidlineage: '/' + catlist + '/',
            IP: IP,
            page: 'AddCategory',
        }

        PostAddressAPI(postAddressObject).then((res) => {
            if (res?.data?.success) {
                document.cookie = 'isFlow = true'
                let query = router?.asPath || ''
                query = query.split('?')
                if (query.length) query = '?' + query[1]
                
                router.push({
                    pathname: '/addphoto',
                    query: router.query || {}
                })
            } else {
                setIsLoading(false)
            }
        })
    }

    async function handleUpdateClick(updatedMuliparentData = []) {
        document.body.style.overflow = 'unset'
        setModal(false)
        console.log(updatedMuliparentData, 'updatedMuliparentData')
        setIsLoading(true)
        if (updatedMuliparentData?.length == 0) {
            setResponceMsg('Select the appropriate category for your business.')
            setIsLoading(false)
        } else {
            // Get the selected categories
            const selectedCategory = category?.selectedCategory || {}
            const selectedCategoryKeys = Object.keys(selectedCategory)

            // Find categories to remove based on updatedMuliparentData
            const categoriesToRemove = selectedCategoryKeys.filter(
                (value) => !updatedMuliparentData.includes(value)
            )

            // Remove the categories from the selectedCategory object
            categoriesToRemove.forEach((catID) => {
                addRemoveCategory(selectedCategory[catID])
            })

            // Create a comma-separated string of selected categories
            const selectedCategoryListString = updatedMuliparentData.join(', ')
            const city = addressInfo?.city || null
            const parentId = parentInfo?.parentid || null

            if (!(city && parentId)) {
                return
            }

            try {
                // Perform multi-parent and category combination checks
                const responseData = await multiParentCheck(
                    parentId,
                    selectedCategoryListString,
                    city,
                    city
                )

                if (
                    responseData.error.code === 1 &&
                    responseData.data?.length === 0
                ) {
                    // If multi-parent check passed, perform category combination check
                    const payload = {
                        parentid: parentId,
                        city: city,
                        all_catidlist: selectedCategoryListString,
                    }

                    const catComboCheckResponceData =
                        await CategoryCombinationCheck(payload)

                    if (catComboCheckResponceData.status) {
                        // Handle success case here
                        let slashSepratedSelectedCategoryListString =
                            updatedMuliparentData.join('/')
                        proceedToNextPage(
                            slashSepratedSelectedCategoryListString
                        )
                    } else {
                        fetchErrMsg(catComboCheckResponceData?.msg || null)
                        document.body.style.overflow = 'hidden'
                        setModalcombo(true)
                        setIsLoading(false)
                    }
                } else {
                    // Categories belong to a different parentage
                    setResponceMsg(
                        'Select the appropriate category for your business.'
                    )
                    setIsLoading(false)
                }
            } catch (err) {
                console.log(err)
                setResponceMsg('Something went wrong.')
                setIsLoading(false)
            }
        }
    }

    async function CategoryCombinationCheck(payload) {
        console.log(payload, '=============')
        let categoryList = payload?.all_catidlist || null
        if (categoryList == null) return // Early return if categoryList is null

        let url = '/api/v1/categorycombinationcheck'

        try {
            const response = await axios.post(url, payload)

            // Define encryption-related variables
            const salt = 'zhsmaj3GKL2CulM0v4KQWgumwVCTKOzy'
            const matchString = categoryList + 'true'

            // Decrypt the response data
            const encodedString = response?.data?.result || ''
            const decrypt_msg = CryptoJS.AES.decrypt(
                encodedString,
                salt
            ).toString(CryptoJS.enc.Utf8)

            // Check if the decrypted message matches the expected string
            if (decrypt_msg === matchString) {
                return {
                    status: true,
                    msg: null,
                } // Combination is valid
            } else {
                return {
                    status: false,
                    msg: response?.data?.data?.BLOCK?.message || null,
                } // Combination is invalid
            }
        } catch (error) {
            console.error(
                'An error occurred while checking category combination:',
                error
            )
            return {
                status: false,
                msg: null,
            } // Return false in case of an error
        }
    }

    async function ValidateCategory() {
        console.log(category, 'category')
        const selectedCategoryObject = category?.selectedCategory || {}
        const selectedCategoryListArr = Object.keys(selectedCategoryObject)
        const selectedCategoryListString = selectedCategoryListArr.join(', ')
        const city = addressInfo?.city || null
        const parentId = parentInfo?.parentid || null
        if (!(city && parentId)) {
            setResponceMsg('Something went wrong.')
            return
        }
        try {
            const responseData = await multiParentCheck(
                parentId,
                selectedCategoryListString,
                city,
                city
            )

            if (
                responseData.error.code == 1 &&
                responseData.data?.length == 0
            ) {
                let payload = {
                    parentid: parentId,
                    city: city,
                    all_catidlist: selectedCategoryListString,
                }
                const catComboCheckResponceData =
                    await CategoryCombinationCheck(payload)
                if (catComboCheckResponceData?.status) {
                    // Handle success case here
                    let slashSepratedSelectedCategoryListString =
                        selectedCategoryListArr.join('/')
                    proceedToNextPage(slashSepratedSelectedCategoryListString)
                } else {
                    fetchErrMsg(catComboCheckResponceData?.msg || null)
                    document.body.style.overflow = 'hidden'
                    setModalcombo(true)
                    setIsLoading(false)
                }
            } else {
                console.log(responseData)
                let multiParentErrorList =
                    responseData?.data?.parentage_info || []
                setMultiparent(multiParentErrorList)
                document.body.style.overflow = 'hidden'
                setModal(true)
                setIsLoading(false)
            }
        } catch (error) {
            console.error('An error occurred:', error)
            setResponceMsg('Something went wrong.')
            setIsLoading(false)
        }
    }

    const saveAndContinue = async () => {
        setIsLoading(true) //start button loader
        ClickTrackerCall('FL_BusinessKeyword', 'FL_Bkeyword')
        ValidateCategory()
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
    var sourceCodeNew = sanitizeParams(router?.query?.source) || null
    const ClickTrackerCall = (li, ll) => {
        if (sourceCodeNew == null) {
            let device_userAgent = navigator.userAgent
            if (
                /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                    device_userAgent
                )
            ) {
                sourceCodeNew = '2'
            } else {
                sourceCodeNew = '7'
            }
        }
        clickTracker({
            sourceCode: sourceCodeNew,
            docid: parentInfo.docid,
            li: li,
            ll: ll,
        })
    }

    const SelectCategory = (event, data) => {
        if (event) event.preventDefault()

        //click tracker implementaion
        ClickTrackerCall('FL_AddCategory', 'FL_Category')

        dispatch(
            fetchSuggestionForMainSelection({
                ...data,
                city: addressInfo.city,
            })
        )
        setDropdownActiveIndex(0)
        setKeyword('')
    }

    const showDropDown = (action) => {
        let falg = false

        switch (action) {
            case 'isError':
                if (
                    keyword?.length > 3 &&
                    dropdown?.length > 1 &&
                    !category.error.isError
                )
                    falg = true
                break
            case 'showDropdown':
                if (keyword?.length > 3 && dropdown?.length > 1) falg = true
                break
            case 'notFound':
                if (category.error.isError && keyword.length >= 3) falg = true
                break
        }

        return falg
    }

    let catArr = []
    if (category?.selectedCategory) {
        try {
            catArr = Object?.keys(category.selectedCategory) || []
        } catch (err) {
            console.error('error=> ' + err)
        }
    }
    const isCatSelected = !!(catArr?.length || 0)

    const handleDropDownScrollViaKey = (e) => {
        let keyType = e.key
        if (!showDropDown('showDropdown')) return
        switch (keyType) {
            case 'ArrowDown':
                if (dropdownActiveIndex >= dropdown.length - 1) return
                if (Number(dropdownActiveIndex) + 1 > 3) {
                    dropDownContainer.current.scrollBy({ top: 50 })
                }
                setDropdownActiveIndex(dropdownActiveIndex + 1)
                break
            case 'ArrowUp':
                if (dropdownActiveIndex <= 0) return
                if (Number(dropdownActiveIndex) + 1 > 3) {
                    dropDownContainer.current.scrollBy({ top: -50 })
                }
                setDropdownActiveIndex(dropdownActiveIndex - 1)
                break
            case 'Enter':
                SelectCategory(null, dropdown[dropdownActiveIndex])
                break
        }
    }

    return (
        <>
            <div className={category.isLoading ? 'loader__page' : ''}>
                <span className="loader" />
            </div>
            <div className={`container__inner `}>
                <div className={`container__inner__left`}>
                    <div className={`left__img ${styles.left__img}`} />
                </div>
                <div className={`container__inner__right`}>
                    <progress
                        className={`${styles.progressbar}`}
                        value="75"
                        max="100"
                    />
                    <p className={`${styles.title} color111 fw600`}>
                        Add business category
                    </p>
                    <p className={`${styles.content} color111`}>
                        {isCatSelected
                            ? 'Allow Your Customers to Find You When They Search By Category Keyword'
                            : `Add the right business categories to help your customer to find you
                  easily`}
                    </p>
                    <div className={`form ${styles.selected__form}`}>
                        <div
                            className={`inputwrap mb-20 ${
                                category.error.isError && keyword.length >= 3
                                    ? 'inputwrap__error'
                                    : ''
                            }`}
                        >
                            <span className={`iconwrap ${styles.searchicon}`} />
                            {keyword && (
                                <span
                                    className={`iconwrap closeicon__grey`}
                                    onClick={() => {
                                        setDropdownActiveIndex(0)
                                        setKeyword('')
                                    }}
                                />
                            )}
                            <input
                                ref={inputRef}
                                value={keyword}
                                placeholder="Add Business Category"
                                onChange={(e) => {
                                    setDropdownActiveIndex(0)
                                    setKeyword(e.target.value)
                                }}
                                className={`input ${styles.textsearch}`}
                                onKeyDownCapture={handleDropDownScrollViaKey}
                            />

                            <ul
                                className={`dropdown color111 customscroll ${
                                    showDropDown('isError') ? '' : 'dn'
                                }`}
                                id="ab"
                                ref={dropDownContainer}
                            >
                                {showDropDown('showDropdown')
                                    ? dropdown.map((data, i) => {
                                          return (
                                              <li
                                                  className={
                                                      dropdownActiveIndex === i
                                                          ? 'active'
                                                          : ''
                                                  }
                                                  key={data.ncid}
                                                  dangerouslySetInnerHTML={{
                                                      __html: data.v,
                                                  }}
                                                  onClick={(e) => {
                                                      SelectCategory(e, data)
                                                  }}
                                              />
                                          )
                                      })
                                    : null}
                            </ul>

                            {showDropDown('notFound') ? (
                                <div className="error__message mt-5">
                                    Cannot Find Category
                                </div>
                            ) : null}
                            <p className={`${styles.subtitle} color111`}>
                                {isCatSelected ? 'Selected Categories' : ''}
                            </p>
                        </div>
                    </div>

                    {catArr.map((catid) => {
                        return (
                            <label
                                key={catid}
                                className={`${styles.suggestedcategories} ${
                                    !category.selectedCategory[catid]
                                        ? styles.suggestedcategories__unchecked
                                        : ''
                                }`}
                            >
                                <span className={`color414 font14`}>
                                    {category.selectedCategory[catid]
                                        .category_name ||
                                        category.selectedCategory[catid].mcn}
                                </span>
                                <span
                                    onClick={() => {
                                        addRemoveCategory(
                                            category.selectedCategory[catid]
                                        )
                                    }}
                                    className={`ml-10`}
                                >
                                    <Image
                                        alt={
                                            category.selectedCategory[catid]
                                                .category_name ||
                                            category.selectedCategory[catid].mcn
                                        }
                                        src={
                                            '//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/closeblue.svg'
                                        }
                                        width={15}
                                        height={15}
                                        title={
                                            category.selectedCategory[catid]
                                            .category_name ||
                                            category.selectedCategory[catid].mcn
                                        }
                                        // fill={true}
                                    ></Image>
                                </span>
                            </label>
                        )
                    })}

                    {isCatSelected ? (
                        <button aria-label="Save and Continue"
                            onClick={saveAndContinue}
                            className={`${styles.primarybutton} primarybutton`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="primarybutton--loader" />
                            ) : (
                                'Save and Continue'
                            )}
                        </button>
                    ) : null}
                </div>
            </div>
            {showToast()}
            {!modal ? null : (
                <Businesstype
                    majorCatsDetails={multiparent}
                    handleUpdateClick={handleUpdateClick}
                    closeModal={closeModal}
                />
            )}
            {!modalcombo ? null : (
                <Categorycombo
                    selectedCategory={category.selectedCategory}
                    categoryComboErrMsg={comboErrMsg.current}
                    closeModal={closeCategoryComboPopup}
                />
            )}
        </>
    )
}

export default MainCategory
