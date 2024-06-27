import Image from 'next/image'
import styles from './getaheadcompetition.module.scss';

export function LeaderBoard({ leaderBoard, formatedDate, ncatid, area, city, category, handleRedirect, setGraphHeight, RedirectGetPremiumPlan }) {
    return (
        <div className={`${styles.competition__div} ${styles.leaderboard} flex flex__col flex__none`}>
            {/* <b className={`color1a1 fw600 mb-10`}>Leaderboard</b> */}
            <div>
                <span className={`color111 fw500 mb-10 ${styles.subtext}`}>{category || "Interior Designers"} Leaderboard in {city || "Mumbai"}</span>
                <span className={`${styles.date} color111 mb-10`}>{formatedDate}</span>
            </div>
            <div className={`${styles.leaderboard__table} flex flex__col`} id="leadboardListId">
                <div className={`${styles.leaderboard__head} flex flex__item__center`}>
                    <b className={`fw600 color1a1 ${styles.rank}`}>Rank</b>
                    <b className={`fw600 color1a1 ${styles.business}`}>Business Name</b>
                    <b className={`fw600 color1a1 ${styles.lead}`}>Leads</b>
                </div>
               {leaderBoard?.length <= 0 && <figure className={`${styles.figure}`}>
                    <Image width={100} height={100} src="//akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/nocompetitor.svg" alt="No Competitor" />
                    <figcaption className={`font14 mt-10`}>We do not have any leads currently</figcaption>
                </figure>}
               
                <div className={`${styles.leaderboard__body}`}>
                    {
                        leaderBoard && leaderBoard.map((data, i) => {
                            const { pos, name, leads } = data
                            return (
                                <div key={pos} className={`${styles.leaderboard__list} flex flex__item__center`}>
                                    {
                                        i < 3 ?
                                            <div className={`${styles.rank} color1a1 fw500 iconwrap ${styles.rank__icon} ${styles[`rank__${i + 1}`]}`}></div>
                                            :
                                            <div className={`${styles.rank} color1a1 fw500 pl-10`}>{pos}</div>
                                    }
                                    <div className={`${styles.business} color1a1 fw500`}>{name}</div>
                                    <div className={`${styles.lead} color1a1 fw500`}>{leads}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <button className={`primarybutton mt-10`} onClick={()=>RedirectGetPremiumPlan(true,true)}>Get Ahead of Your Competitor</button>
        </div>
    )
}
