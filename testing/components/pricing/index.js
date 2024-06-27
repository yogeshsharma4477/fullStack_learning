import React, { useEffect, useState } from 'react'
import styles from './pricing.module.scss'
import { advertisePricing, generateRandomString } from '../../libs/frontend'
import { generateSessionId, getCookie } from '@/utils/commonFunc'
import { getValidOrderId, postPlanOrder } from '@/utils/api'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { cookies } from 'next/headers'
import { serialize } from 'cookie'

function Pricing(props) {
    const data = advertisePricing
    const dataFromRedux = useSelector((state) => state)
    console.log('dataFromRedux', dataFromRedux)

    const [isActive, setIsActive] = useState(1)

    const setActive = (id) => {
        setIsActive(id)
    }

    // useEffect(() => {
    //     if (!dataFromRedux.CommonValues.docid) {
    //     }
    // }, [dataFromRedux.CommonValues.docid])

    const upgradePlan = async (val, price) => {
        const { shorturl, parentid, mobileNumber, docid, companyName } =
            dataFromRedux.CommonValues
        const { area, pincode, city } = dataFromRedux.Address
        const { EmailId } = dataFromRedux.Address
        const ordertime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

        const timeStamp = moment().format('x')
        const getordercookie = getCookie('planoid')
        let orderId
        let amount_payable = price * 365
        let total_amount = amount_payable
        let tax = amount_payable * (18 / 100)
        amount_payable = amount_payable + tax

        console.log('amount', amount_payable, total_amount, tax)

        const callApiPost = async () => {
            const obj = {
                shorturl: shorturl,
                parentid: parentid,
                mobile: mobileNumber,
                docid: docid,
                companyName: companyName,
                datacity: city,
                area: area,
                ordertime: ordertime,
                orderId: orderId,
                amount_payable: amount_payable,
                total_amount: total_amount,
                tax: tax,
                pincode: pincode,
                productName: val,
                email: EmailId,
            }
            const response = await postPlanOrder(obj)
            console.log('response', response)

            if (response?.data?.success && response.data?.results?.url) {
                let url = response.data?.results?.url || ''
                let orderId = response.data?.results?.id || ''
                if (orderId) {
                    let cookieName = 'JDADVPRM_' + shorturl
                    document.cookie = `${cookieName}=${orderId};Max-Age=${
                        60 * 60 * 24 * 30
                    };`
                }
                let transactionForm = document.createElement('form')
                transactionForm.id = 'txnfrm'
                transactionForm.action = url
                transactionForm.method = 'post'
                transactionForm.innerHTML =
                    "<input type='hidden' value='" + orderId + "' name='id'>"
                document.body.append(transactionForm)
                if (transactionForm.submit) {
                    transactionForm.submit()
                    return true
                }
            } else if (response?.data?.errors?.code == 1) {
                // alert('Error on banner purchase api..');
                console.log('no response.....')
            }
        }
        if (getordercookie) {
            orderId = getordercookie
            callApiPost()
        } else {
            const remakeOrderId = async () => {
                orderId = `PADG${generateRandomString(3)}${timeStamp}`
                // orderId = 'PADGzHz1695284740056'
                console.log('remakeOrderId', orderId)
                const isValid = await getValidOrderId(orderId)
                if (isValid.data.code == 1) {
                    console.log('here')
                    remakeOrderId()
                } else {
                    callApiPost()
                }
            }
            remakeOrderId()
        }
    }

    return (
        <div className={`${styles.pricing_wrap}`} id={`pricing`}>
            <div className={`section`}>
                <div className={`${styles.pricing_left}`}>
                    <div className={`${styles.heading}`}>Pricing</div>
                    <div className={`${styles.showingplan}`}>
                        Showing Plans for
                        <div className={`${styles.location_drop}`}>Mumbai</div>
                    </div>
                    <div className={`${styles.price_ul}`}>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_listing_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Visibility in Search
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/category_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Category Banner
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/verified_seal_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Verified Seal
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/trust_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Trust Stamp
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/online_catalogue_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Online Catalogue
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/transcation_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Transaction Enabled Website
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/payment_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Payment Solutions
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/smart_lead_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Smart Lead Management System
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/competitor_analysis_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Competitor Analysis
                            </div>
                        </div>
                        <div className={`${styles.price_li}`}>
                            <div className={`${styles.price_img}`}>
                                <img src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/premium_customer_support_icon.svg" />
                            </div>
                            <div className={`${styles.price_text}`}>
                                Premium Customer Support
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.pricing_right}`}>
                    {advertisePricing.map((prx, id) => (
                        <div
                            className={`${styles.price_tab} ${
                                styles[`price_tab_${prx.value.toLowerCase()}`]
                            } ${id == isActive ? styles.active : ''}`}
                        >
                            <div className={`${styles.pricetab_tabmid}`}>
                                {prx.value == 'Free' ? (
                                    <>
                                        {/* <div
                                            className={`${styles.pricetab_top}`}
                                        >
                                            <div
                                                className={`${styles.pricetab_middle} ${styles.pricetxt_free}`}
                                            ></div>
                                        </div> */}
                                        <div
                                            className={`${styles.pricetab_top}`}
                                        >
                                            {/* <button>Upgrade</button> */}
                                            {/* <div
                                                className={`${styles.pricetab_top_txt1}`}
                                            >
                                                Starting from
                                            </div> */}
                                            {/* <div
                                                className={`${styles.pricetab_top_amt}`}
                                            >
                                                <sup
                                                    className={`${styles.rupee}`}
                                                >
                                                    &#8377;
                                                </sup>
                                                149
                                                <span
                                                    className={`${styles.pricetab_top_txt2}`}
                                                >
                                                    /day
                                                </span>
                                            </div> */}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className={`${styles.pricetab_top}`}
                                            onClick={() => setActive(id)}
                                        >
                                            <button
                                                onClick={() =>
                                                    upgradePlan(
                                                        prx.value,
                                                        prx.price
                                                    )
                                                }
                                            >
                                                Upgrade
                                            </button>
                                            <div
                                                className={`${styles.pricetab_top_txt1}`}
                                            >
                                                Starting from
                                            </div>
                                            <div
                                                className={`${styles.pricetab_top_amt}`}
                                            >
                                                <sup
                                                    className={`${styles.rupee}`}
                                                >
                                                    &#8377;
                                                </sup>
                                                {prx.price}
                                                <span
                                                    className={`${styles.pricetab_top_txt2}`}
                                                >
                                                    /day
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div
                                    className={`${styles.pricetab_middle}  ${
                                        styles[
                                            `pricetxt_${prx.value.toLowerCase()}`
                                        ]
                                    }   `}
                                >
                                    {prx.value}
                                </div>
                                <div className={`${styles.pricetab_bottom}`}>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.visibilityinSearch !== '-' ? (
                                            <>{prx.visibilityinSearch}</>
                                        ) : prx.value !== 'Free' ? (
                                            <>
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.categoryBanner == true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.verifiedSeal == true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.trustStamp == true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.onlineCatalogue == true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.transactionEnabledWebsite ==
                                        true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.paymentSolutions == true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.smartLeadManagement == true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.competitorAnalysis == true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`${styles.pricetab_bottom_li}`}
                                    >
                                        {prx.premiumCustSupport == true ? (
                                            <span
                                                className={`${styles.price_green}`}
                                            />
                                        ) : prx.value !== 'Free' ? (
                                            <span
                                                className={`${styles.price_red}`}
                                            />
                                        ) : (
                                            <>
                                                {' '}
                                                <span
                                                    className={`${styles.pricedash}`}
                                                />{' '}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div
                    className={`${styles.price_tab} ${styles.price_tab_standard} ${styles.active}`}
                >
                    <div className={`${styles.pricetab_tabmid}`}>
                        <div className={`${styles.pricetab_top}`}>
                            <button>Upgrade</button>
                            <div className={`${styles.pricetab_top_txt1}`}>
                                Starting from
                            </div>
                            <div className={`${styles.pricetab_top_amt}`}>
                                <sup className={`${styles.rupee}`}>&#8377;</sup>
                                99
                                <span className={`${styles.pricetab_top_txt2}`}>
                                    /day
                                </span>
                            </div>
                        </div>
                        <div
                            className={`${styles.pricetab_middle} ${styles.pricetxt_standard}`}
                        >
                            Standard
                        </div>
                        <div className={`${styles.pricetab_bottom}`}>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                1x
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_red}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* <div
                    className={`${styles.price_tab} ${styles.price_tab_premium}`}
                >
                    <div className={`${styles.pricetab_tabmid}`}>
                        <div className={`${styles.pricetab_top}`}>
                            <button>Upgrade</button>
                            <div className={`${styles.pricetab_top_txt1}`}>
                                Starting from
                            </div>
                            <div className={`${styles.pricetab_top_amt}`}>
                                <sup className={`${styles.rupee}`}>&#8377;</sup>
                                149
                                <span className={`${styles.pricetab_top_txt2}`}>
                                    /day
                                </span>
                            </div>
                        </div>
                        <div
                            className={`${styles.pricetab_middle} ${styles.pricetxt_premium}`}
                        >
                            Premium
                        </div>
                        <div className={`${styles.pricetab_bottom}`}>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                2x
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_red}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.price_tab} ${styles.price_tab_pro}`}>
                    <div className={`${styles.pricetab_tabmid}`}>
                        <div className={`${styles.pricetab_top}`}>
                            <button>Upgrade</button>
                            <div className={`${styles.pricetab_top_txt1}`}>
                                Starting from
                            </div>
                            <div className={`${styles.pricetab_top_amt}`}>
                                <sup className={`${styles.rupee}`}>&#8377;</sup>
                                199
                                <span className={`${styles.pricetab_top_txt2}`}>
                                    /day
                                </span>
                            </div>
                        </div>
                        <div
                            className={`${styles.pricetab_middle} ${styles.pricetxt_pro}`}
                        >
                            Pro
                        </div>
                        <div className={`${styles.pricetab_bottom}`}>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                3x
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                            <div className={`${styles.pricetab_bottom_li}`}>
                                <span className={`${styles.price_green}`} />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
        // </div>
    )
}
export default Pricing
