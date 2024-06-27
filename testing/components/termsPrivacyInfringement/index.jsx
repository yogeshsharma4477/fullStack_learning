/**
 * The above code is a React component that renders a terms, privacy, and infringement policy agreement
 * with dynamic redirection links based on the source code provided in the URL query parameters.
 * @returns The `termsPrivacyInfringement` component is being returned.
 */

//&nbsp = space
//&amp = & sigin
import React from 'react';
import { useRouter } from "next/router";
import { sanitizeParams } from '@/utils/commonFunc';
import styles from './terms.module.scss'

const WEB_SOURCE_ARR = ['7','77'];

/**
 * The function checks if a given source is included in a predefined array of web sources.
 * @returns a boolean value. If the source is included in the WEB_SOURCE_ARR array, it will return
 * true. Otherwise, it will return false.
 */
function isWeb (source='77') {
    if(!WEB_SOURCE_ARR.includes(source)){
        return false;
    }
    return true;
}

/**
 * The function `fetchRedirectionUrl` returns a URL based on the type of redirection and whether it is
 * being accessed from a web view or not.
 * @returns a URL based on the type of redirection requested and whether the source code is for a web
 * view or not.
 */
function fetchRedirectionUrl(type, sourceCode = null) {
    const isWebView = isWeb(sourceCode)
    let url = ""
    switch (type) {
        case 'terms':
            url = isWebView ? 'https://www.justdial.com/Terms-of-Use' : 'https://www.justdial.com/mobileTC?wap=2';
            break;
        case 'privacy':
            url = isWebView ? 'https://www.justdial.com/Privacy-Policy' : 'https://www.justdial.com/mobileTC?wap=2#Privacy-Policy';
            break;
        case 'infrigment':
            url = isWebView ? 'https://www.justdial.com/Infringement-Policy' : 'https://www.justdial.com/mobileTC?wap=2#infringement';
            break;
    }
    return url;
}

function TermsPrivacyInfringement (props) {
    
    const {StyleProperty={}, isBreak=false, headerClass} = props; 
    
    const router = useRouter();
    const sourceCode = sanitizeParams(router?.query?.source);

    const TERMS_REDIRECTION_LINK = fetchRedirectionUrl('terms', sourceCode);
    const PRIVACY_REDIRECTION_LINK = fetchRedirectionUrl('privacy', sourceCode);
    const INFRIGMENT_REDIRECTION_LINK = fetchRedirectionUrl('infrigment', sourceCode);

    return (
        <>
            <div className={`${StyleProperty} ${styles.termsandcondition} ${headerClass ? styles.header : ''}`}>
                By continuing, you agree to our
                &nbsp;
                <a role="button" aria-label="Terms of Use" tabIndex="0" href={`${TERMS_REDIRECTION_LINK}`}>
                    Terms of Use 
                </a>&nbsp;, &nbsp;
                <a role="button" aria-label="Privacy" tabIndex="0" href={`${PRIVACY_REDIRECTION_LINK}`}>
                    Privacy {headerClass ? 'Policy' : ''}
                </a>&nbsp; & &nbsp;
                    <a className={`${styles.infrigment}`} role="button" aria-label="Infringement Policy" tabIndex="0" href={`${INFRIGMENT_REDIRECTION_LINK}`}>
                        Infringement Policy
                    </a>
            </div>
        </>
    )   

}

export default TermsPrivacyInfringement;