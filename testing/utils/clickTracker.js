import axios from 'axios';

const sourceMapping = {
    '1': 'Android',
    '2': 'Touch',
    '3': 'iOS',
    '2_jdlite=1': 'jdlite',
    '4': 'BB',
    '5': 'Windows',
    '6': 'SMS search',
    '7': 'Web',
    '8': 'Wintab',
    '9': 'wap lite',
    '10': 'wap lite',
    '11': 'IRO',
    '12': 'EVNGLS',
    '13': 'jdpay',
    '14': 'Genio lite',
    '70': 'rtp',
    '90': 'bjrating',
    '21': 'Android Jdmart',
    '22': 'Touch Jdmart',
    '23': 'iOS Jdmart',
    '27': 'Web Jdmart',
    '18': 'Main Jd b2b',
    '35': 'restaurant',
    '36': 'marketplace onboarding',
    '37': 'marketplace through whatsapp',
    '41': 'JD Xperts Android',
    '42': 'JD Xperts Touch',
    '43': 'JD Xperts iOS',
};

const clickTracker = ({sourceCode='77', docid='', li=null, ll=null})=>{
    if(location.pathname.includes('dc'))return;
    let url='/api/v1/clickTracker';  
    let payload = {
        source: sourceCode,
        docid: docid,
        li: li,
        ll: ll
    }
    axios({
        method: "post",
        url: "/Free-Listing/api/v1/clickTracker",
        data: payload,
    });
}

export default clickTracker;