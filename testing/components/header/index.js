import React, { useEffect, useState } from 'react'
import styles from './header.module.scss'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSelector } from "react-redux";
import { clickTracker, Android_CODE_ARR, IOS_CODE_ARR, sanitizeParams, delete_cookie, fetchSourceCode, getCookie } from '@/utils/commonFunc';
import EnterMobileNumber from "../enterMobileNumber";
import TermsPrivacyInfringement from "../termsPrivacyInfringement";
import { updateMultipleOTPValues } from "@/store/Slices/landingPageSlice"


export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mainCity, setMainCity] = useState("")
    const handleScroll = () => {
        const scroll = window.scrollY > 200;
        setIsScrolled(scroll);
    };
    useEffect(()=>{
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    },[handleScroll]);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(null);
    const isVerified = useSelector((state) => state.CommonValues.isVerified)
    const isShowOTP = useSelector((state) => state?.landinfPageSlice.isShowOTP || false);
    const loggedInMobileNumber = useSelector((state) => state.CommonValues.isVerified)
    let [sourceCode, setSourceCode] = useState(sanitizeParams(router?.query?.source));
    const JUSTDIAL_REDIRECTION_URL = (Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode)) 
    ? 'https://jdext.php' : 'https://www.justdial.com';
  
    let city = sanitizeParams(router?.query?.city) || ""
    
    useEffect(()=>{
        if(sourceCode) {
            const userAgent = navigator.userAgent;
            setSourceCode(fetchSourceCode(sourceCode, userAgent)|| '77');
        }
        setCurrentPage(router?.pathname || ''); // fetch curr page path/route
        setMainCity(getCookie("main_city") || "")
    },[]);
    
    useEffect(() => {
        let action = isShowOTP ? 'add' : 'remove';
        handleBodyFixed(action);
    }, [isShowOTP])
    
    function handleBodyFixed(action) {
        try{
            if(typeof window !== 'undefined'){
                switch(action) {
                    case 'add':
                        document.body.classList.add("bodyfixed");
                        document.getElementsByTagName('html')[0].className = "bodyfixed"
                        break;
                    case 'remove':
                        document.body.classList.remove("bodyfixed");
                        document.getElementsByTagName('html')[0].className = ""
                        break;    
                }
            }
        } catch (error) {
            console.log(error);
        }
    }           
    function handleRedirectScroll(id) {
        let element = document.getElementById(id)
        if (element) {
            let topHeight = element.offsetTop - 120
            if (id === "businessliststepid") topHeight -= 20
            window.scroll({
                top: id === 'listyourbusiness' ? 0 : topHeight + 50,
                behavior: 'smooth',
            })
        }
    }

    function handleLoginRedirection() {
        let url = 'https://www.justdial.com/login'
        let params = {
            maybe: '1',
            redirectionurl: 'https://www.justdial.com/Free-Listing/bussinesslist?'
        }
        let queryStr = new URLSearchParams(params).toString()
        url += '?' + queryStr;
        window.location.assign(url)
    }
    const isLandingPage = router?.pathname == '/'
    const isSuccessStoriesPage = router?.pathname == '/successStories'
    const checkLogin = () => {
        handleLoginRedirection()
    }

    let isMobile = false;
    if (sourceCode == '7' || sourceCode == '77') {
        isMobile = false
    } else {
        isMobile = true;
    }

    let jdlite = sanitizeParams(router?.query?.jdlite);
    
    const ClickTrackerCall = (li, ll) => {
        clickTracker({
            sourceCode: sourceCode,
            li: li,
            ll: ll,
        });
    };

    function headerBackFunc (sourceCode, jdlite) {
        let isJdLite = (sourceCode=='2' && jdlite=='1');
        if(Android_CODE_ARR.includes(sourceCode) || IOS_CODE_ARR.includes(sourceCode) || isJdLite){
            const currRoute = router.route;
            var redirecrtionURL = '';
            switch (currRoute) {
                case '/':
                    delete_cookie("sesionId")
                    window.location.href = 'https://jdext.php'
                    break;
                case '/bussinesslist':
                    redirecrtionURL = '/Free-Listing' + window?.location?.search || '';
                    router.push({
                        pathname: '/',
                        query: router?.query || {}
                    })
                    break;
                case '/congratulation':
                case '/pleasenote':
                case '/getpremium':
                    redirecrtionURL = '/Free-Listing/bussinesslist' + window?.location?.search || '';
                    router.push({
                        pathname: '/bussinesslist',
                        query: router?.query || {}
                    })
                    break;
                default:
                    router.back()
                    break;
            }
        } else {
            router.back()
        }
    }

    const tabLinksArr = [
        {
            id: 'successstories',
            label: 'Success Stories',
            li: 'nfl_header_ss',
            ll: 'NFL_LP'
        },
        {
            id: 'businessliststepid',
            label: 'List Your Business',
            li: 'nfl_header_lyb',
            ll: 'NFL_LP'
        },
        {
            id: 'gotfaq',
            label: 'FAQs',
            li: 'nfl_header_faq',
            ll: 'NFL_LP'
        },
    ]

    const checkHeader = () => {
        const pathname = router.pathname
        if (pathname.includes('/dc')) {
            return (<a href={JUSTDIAL_REDIRECTION_URL}>
                <span className={`font18 color111 fw600`} >
                    Data Collector
                </span>
            </a>)
        } else {
            return (<div>
                <a
                    className={`${styles.logo__landing}`}
                    href={JUSTDIAL_REDIRECTION_URL}
                // onClick={headerLogoClick}
                >
                    <Image
                        width={100}
                        height={32}
                        src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg"
                        alt="justdial logo"
                    />
                </a>
            </div>)
        }
    }

    if (router.pathname == '/dc/createnewbusiness' || router.pathname == '/dc/thankyou') {
        return <></>
    }


    return (
        <>
            {/* <a href="#mainContent" role="button" tabindex="1" aria-label="Skip to main content" className="skiplink">Skip to main content</a> */}
            <header className={`${styles.header} ${styles.header__landing} ${isScrolled && (isLandingPage || isSuccessStoriesPage ) && !isMobile ? styles.header__fixed : ''}`}>
                <div className={`${styles.header__landing__inner}`}>
                    <div className={`${styles.header__left}`}>
                        <span className={`${styles.profile}`}
                            onTouchStart={()=>{headerBackFunc(sourceCode, jdlite)}}
                        >
                            <Image
                                width={26}
                                height={26}
                                src="https://akam.cdn.jdmagicbox.com/images/icontent/newwap/newprot_w/headerbkicn.svg"
                                alt="user default image"
                                title="Back"
                            />
                        </span>
                        <a
                            className={`${styles.logo__landing}`}
                            href={JUSTDIAL_REDIRECTION_URL}
                        >
                            <Image
                                width={100}
                                height={32}
                                src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg"
                                alt="justdial logo"
                            />
                        </a>
                        {isLandingPage && !isScrolled ? <ul>
                            {
                                tabLinksArr.map((val, index)=> (
                                    <li key={val.id}> 
                                        <a
                                            className={`fw500 color111`}
                                            onClick={() => {
                                                handleRedirectScroll(val.id);
                                                ClickTrackerCall(val.li, val.ll);
                                            }
                                            }
                                        >
                                            {val.label}
                                        </a>
                                    </li>
                                ))
                            }
                        </ul> : null}
                        {
                            isScrolled && (isLandingPage || isSuccessStoriesPage) && <div className={`${styles.content}`}>
                                <b>List Your Business for FREE on Justdial Today</b>
                                <span>India's No. 1 Local Search Engine</span>
                            </div>
                        }
                    </div>
                    <div className={styles.header__middle}>
                    {!isMobile ?
                            <a
                                className={`${styles.logo__landing}`}
                                href={JUSTDIAL_REDIRECTION_URL}
                            >
                                <Image
                                    width={100}
                                    height={32}
                                    src="https://akam.cdn.jdmagicbox.com/images/icontent/jdrwd/jdlogosvg.svg"
                                    alt="justdial logo"
                                />
                            </a>
                            : null
                        }
                        {
                            isScrolled && (isLandingPage || isSuccessStoriesPage)&& !isMobile && <div className={`${styles.content}`}>
                                <b>List Your Business for FREE on Justdial Today</b>
                                <span>India's No. 1 Local Search Engine</span>
                            </div>
                        }
                    </div>

                    {isMobile ? checkHeader() : <></>}
                    <div className={`${styles.header__right}`}>
                        {
                            !isScrolled && 
                            <ul>
                                <li>
                                    <a role="button" tabIndex="0"
                                        className={`font16 fw500 color111`}
                                        onClick={() => {
                                            ClickTrackerCall('nfl_header_108s', 'NFL_LP');
                                            window.location.href = "tel:8888888888"
                                        }}
                                    >
                                        <Image
                                            className={`mr-5`}
                                            width={15}
                                            height={15}
                                            src="https://akam.cdn.jdmagicbox.com/images/icontent/listingbusiness/call.svg"
                                            alt="Call icon"
                                        />
                                        <span>88888 88888</span>
                                    </a>
                                </li>
                                {(router.route === '/landing' || router.route === '/' || router.route === '/successStories') && !isVerified && (
                                    <li>
                                        <a role="button" aria-label="Have An Account" tabIndex="0"
                                            className={`font16 fw500 color111`}
                                            onClick={checkLogin}
                                        >
                                            Have an Account?{' '}
                                            <span
                                                className={`${styles.login} color007 ml-10`}
                                            >
                                                Login
                                            </span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        }
                        {
                            isScrolled && (isLandingPage || isSuccessStoriesPage) && !isMobile && <div className={styles.header__right__inner}>
                                <EnterMobileNumber
                                city={mainCity || city || ""}
                                index={4} headerClass={true} 
                                LoggedInMobileNumber={loggedInMobileNumber} />
                                <TermsPrivacyInfringement headerClass={true} />
                            </div>
                        }
                    </div>
                </div>
            </header>
        </>
    )
}
