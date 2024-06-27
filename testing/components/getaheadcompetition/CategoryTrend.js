import React from 'react'
import styles from './getaheadcompetition.module.scss';
import Image from 'next/image'
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

function CategoryTrend({categorySearch, leadCount, selectTab, changeTab, data, options, RedirectGetPremiumPlan }) {
    return (
        <div className={`${styles.competition__div} ${styles.countlead} flex flex__col flex__none`}>
            <div>
                {/* <b className={`color1a1 fw600 mb-10`}>Count of Leads</b> */}
                <span className={`color111 fw500 mb-10 ${styles.subtext} `}>Leads Generated in {categorySearch?.label || "Interior Designers"}</span>
                {leadCount > 0 && <span className={`fw500 ${styles.count} `}>{leadCount?.toLocaleString('en-IN')}</span>}
                <div className={`${styles.tab} flex mt-5 mb-5`}>
                    <button
                        className={`flex flex__item__center ${selectTab[0].isSelected ? styles.active : ''} `}
                        onClick={(e) => changeTab(e, 0)}>
                        3M
                    </button>
                    <button
                        className={`flex flex__item__center ${selectTab[1].isSelected ? styles.active : ''} `}
                        onClick={(e) => changeTab(e, 1)}>
                        6M
                    </button>
                </div>
            </div>
            {/* <span className={`mt-5 mb-5`}>Graph</span> */}
            <div>

                {data.value.reduce((a, b) => a + b, 0) == 0 ?
                    <figure className={`${styles.figure}`}>
                        <Image width={100} height={100} src="//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/nolead.svg" alt="No Lead" />
                        <figcaption className={`font14 mt-10`}>We do not have any leads currently</figcaption>
                    </figure>
                    :
                    <HighchartsReact highcharts={Highcharts} options={options} />
                }

            </div>
            <div>
                <span className={`flex ${styles.graphpath} `}>
                    <span className={`iconwrap mr-10 ${styles.graphicon} `} />
                    <span className={`color111 fw500 ${styles.graphpathtext} `}>Upgrade to a Paid Plan to Receive Leads with Buyer Details</span>
                </span>
                <button className={`primarybutton mt-20`} onClick={() => RedirectGetPremiumPlan(true,false)}>Get Leads with Buyer Details</button>
            </div>
        </div>
    )
}

export default CategoryTrend