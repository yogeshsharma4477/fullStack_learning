import React from 'react'
import styles from './shimmer.module.scss'

export default function Shimmer() {
    return (
        <>   
            <div className={`${styles.shimmer}`}>
                <p className={`${styles.shimmer__loader} ${styles.shimmer__title}`} />
                <p className={`${styles.shimmer__loader} ${styles.shimmer__title}`} />
                <form>
                    <p className={`${styles.shimmer__loader} ${styles.shimmer__div} mb-20`} />
                    <p className={`${styles.shimmer__loader} ${styles.shimmer__div} mb-20`} />
                    <p className={`${styles.shimmer__loader} ${styles.shimmer__div} mb-20`} />
                    <p className={`${styles.shimmer__loader} ${styles.shimmer__div} mb-20`} />
                    <p className={`${styles.shimmer__loader} ${styles.shimmer__div} mb-20`} />
                </form>
            </div>
        </>
    )
}