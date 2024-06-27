import { isNull } from "@/utils/commonFunc";
import React, { useState } from "react";
import styles from "./businesslist.module.scss"
import Image from "next/image";

const BusinessTile = ({ id, iconURL = '', businessName = '', businessAddress = '', isVerified = null, docid = '' }) => {
    const [isShowAlpha, setShowAlpha] = useState(false);

    const verifiedIcon = () => {
        if (isNull(isVerified)) return null;
        if (!isVerified) return null
        return <span className={`iconwrap ${styles.verified}`} />
    }

    const setDefaultImage = (e) => {
        e.preventDefault();
        const defaultImageUrl = 'https://akam.cdn.jdmagicbox.com/images/icontent/jdmart/jdmart_placeholder_350x350.svg'
        e.target.src = defaultImageUrl
        // setImgSrc(defaultImageUrl)
    }

    const handleEditBusiness = (e) => {
        e.preventDefault()
    }

    const onImageLoadError = () => {
        setShowAlpha(true);
    }
    
    return (
        <>
            <span className={`${styles.business__left}`}>
                <span className={`${styles.business__img} fw500 font24 mr-15`}>
                    {isShowAlpha && <span id={id} className={`${styles.data__letter}`}>{businessName[0]}</span>}
                    {!isShowAlpha && <Image onError={() => onImageLoadError()} src={`https:${iconURL}`} loading="eager" height={48} width={48} alt={businessName[0]} title={businessName[0]} />}
                </span>
                <span className={`${styles.business}`}>
                    <span className={`${styles.business__title} color1a1 fw500`}>
                        {businessName}&nbsp;{verifiedIcon()}
                    </span>
                    <span className={`${styles.business__address} color414`}>{businessAddress}</span>
                </span>
            </span>
            <span className={`iconwrap righticon`} onClick={(handleEditBusiness)} />
        </>
    )
}

export default BusinessTile;

//-----------
// space - &nbsp;
//-----------
