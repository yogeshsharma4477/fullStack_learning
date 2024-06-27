import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import modal from "../../styles/modal.module.scss";
import styles from "./successstories.module.scss";

function VideoPopUp({ url, setYturl }) {
    const [isSafari, setIsSafari] = useState(false)
    useEffect(()=>{
        if(!navigator) return;
        const isSafariFlag = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if(isSafariFlag) setIsSafari(isSafariFlag);
    },[])
    return (
        <div>
            <div className={`${modal.modal__overlay}`} >
                <div className={`${modal.modal} ${modal.modal_video}`}>
                    <div className={`${modal.modal__header} ${styles.modal__header}`}>
                        <button className={`iconwrap closeicon`} onClick={() => {
                            setYturl(null)
                            document.body.classList.remove('bodyfixed');
                        }} />
                    </div>
                    <div className={`${modal.modal__body} ${styles.modal__body} flex flex__col`}>
                        <ReactPlayer
                            url={url}
                            muted={isSafari} //react-player bug, doesn't autoplay video in unmute mode
                            playing={true}
                            controls
                            width="100%"
                            height="400px"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPopUp
