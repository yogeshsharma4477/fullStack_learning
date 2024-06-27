import excuteQuery from '../../lib/db_dashboard';
import moment from 'moment';

const TABLE_NAME = 'tbl_bmodules_logs';
const FREE_LISTING_MODULE_NAME = 'Free-Listing';
const ADVERTISE_MODULE_NAME = 'Advertise';
const DC_MODULE = 'DC';
const DOMAIN = 'https://www.justdial.com';
const DOMAIN_STAGING = 'https://staging2.justdial.com'

function formRouteFL(url) {
    let urlPath = url.replace(DOMAIN, '');
    urlPath = urlPath.replace(DOMAIN_STAGING, '');
    urlPath = urlPath.toLowerCase();
    let route = urlPath.replace((`/${FREE_LISTING_MODULE_NAME}`).toLocaleLowerCase(), '');

    if (route == '/' || route == '') {
        return 'Landing';
    } else if (route == '/otpverification') {
        return 'OtpPopup';
    } else if (route == '/bussinesslist') {
        return 'Bussinesslist';
    } else if (route == '/address') {
        return 'Address';
    } else if (route == '/congratulation') {
        return 'Congratulation';
    } else if (route == '/addcontact') {
        return 'Addcontact';
    } else if (route == '/addtiming') {
        return 'Addtiming';
    } else if (route == '/addcategories') {
        return 'Addcategories';
    } else if (route == '/addphoto') {
        return 'Addphoto';
    } else if (route == '/getpremium') {
        return 'Getpremium';
    } else if (route == '/pleasenote') {
        return 'Pleasenote';
    }
}

function formRouteADV(url) {
    let urlPath = url.replace(DOMAIN, '');
    urlPath = urlPath.replace(DOMAIN_STAGING, '');
    urlPath = urlPath.toLowerCase();
    let route = urlPath.replace((`/${ADVERTISE_MODULE_NAME}`).toLocaleLowerCase(), '');

    if (route == '/' || route == '') {
        return 'Landing';
    } else if (route == '/otpverification') {
        return 'OtpPopup';
    } else if (route == '/bussinesslist') {
        return 'Bussinesslist';
    } else if (route == '/address') {
        return 'Address';
    } else if (route == '/addcategories') {
        return 'Addcategories';
    } else if (route.includes('/addons') && route.includes('/plans')) {
        return 'Addons';
    } else if (route.includes('/setuppayment') && route.includes('/plans')) {
        return 'Setuppayment';
    } else if (route.includes('/growthplandetail') && route.includes('/plans')) {
        return 'Growth Plan Details';
    } else if (route.includes('/growthplan') && route.includes('/plans')) {
        return 'Growth Plan';
    } else if (route.includes('/selectpincodes') && route.includes('/plans')) {
        return 'Select Pincodes';
    } else if (route.includes('/plans')) {
        return 'Plans';
    } else if (route == '/confirmation') {
        return 'Confirmation';
    } else if (route == '/thankyoukyc') {
        return 'Thankyoukyc';
    }
}

function formRouteDC(url) {
    let urlPath = url.replace(DOMAIN, '');
    urlPath = urlPath.replace(DOMAIN_STAGING, '');
    urlPath = urlPath.toLowerCase();
    urlPath = urlPath.replace('http://project01.anilkumar.jdsoftware.jd:9028', '');
    let route = urlPath;
    if (route == '/free-listing/dc' || route == '') {
        return "Landing"
    } else if (route == '/createnewbusiness') {
        return "Createnewbusiness"
    } else if (route == '/addcontact') {
        return "addcontact"
    } else if (route == '/linkedbusiness') {
        return "linkedbusiness"
    } else if (route == '/businessdetails') {
        return "businessdetails"
    } else if (route == '/addtiming') {
        return "addtiming"
    } else if (route == '/addcategories') {
        return "addcategories"
    } else if (route == '/addphoto') {
        return "addphoto"
    } else if (route == '/thankyou') {
        return "thankyou"
    }
}

function formRoute(url, module) {
    switch (module) {
        case FREE_LISTING_MODULE_NAME:
            return formRouteFL(url);
        case DC_MODULE:
            return formRouteDC(url);
        case ADVERTISE_MODULE_NAME:
            return formRouteADV(url);
    }
}

function fetchStageFL(url) {
    let urlPath = url.replace(DOMAIN, '');
    urlPath = urlPath.replace(DOMAIN_STAGING, '');
    urlPath = urlPath.toLowerCase();
    let route = urlPath.replace((`/${FREE_LISTING_MODULE_NAME}`).toLocaleLowerCase(), '');

    if (route == '/' || route == '') {
        return 1;
    } else if (route == '/otpverification') {
        return 2;
    } else if (route == '/bussinesslist') {
        return 3;
    } else if (route == '/address') {
        return 4;
    } else if (route == '/congratulation') {
        return 5;
    } else if (route == '/addcontact') {
        return 6;
    } else if (route == '/addtiming') {
        return 7;
    } else if (route == '/addcategories') {
        return 8;
    } else if (route == '/addphoto') {
        return 9;
    } else if ((route == '/getpremium' || route == '/pleasenote')) {
        return 10;
    }
}

function fetchStageADV(url) {
    let urlPath = url.replace(DOMAIN, '');
    urlPath = urlPath.replace(DOMAIN_STAGING, '');
    urlPath = urlPath.toLowerCase();
    let route = urlPath.replace((`/${ADVERTISE_MODULE_NAME}`).toLocaleLowerCase(), '');

    if (route == '/' || route == '') {
        return 1;
    } else if (route == '/otpverification') {
        return 2;
    } else if (route == '/bussinesslist') {
        return 3;
    } else if (route == '/address') {
        return 4;
    } else if (route == '/addcategories') {
        return 5;
    } else if (route.includes('/addons') && route.includes('/plans')) {
        return 6.1;
    } else if (route.includes('/growthplandetail') && route.includes('/plans')) {
        return 6.03;
    } else if (route.includes('/growthplan') && route.includes('/plans')) {
        return 6.01;
    } else if (route.includes('/selectpincodes') && route.includes('/plans')) {
        return 6.02;
    } else if (route.includes('/setuppayment') && route.includes('/plans')) {
        return 7;
    } else if (route.includes('/plans')) {
        return 6;
    } else if (route == '/confirmation') {
        return 8;
    } else if (route == '/thankyoukyc') {
        return 9;
    }
}

function fetchStageDC(url) {
    let urlPath = url.replace(DOMAIN, '');
    urlPath = urlPath.replace(DOMAIN_STAGING, '');
    urlPath = urlPath.replace('http://project01.anilkumar.jdsoftware.jd:9028', '');
    urlPath = urlPath.toLowerCase();
    let route = urlPath;
    if (route == '/free-listing/dc' || route == '') {
        return 1;
    } else if (route == '/createnewbusiness') {
        return 2;
    } else if (route == '/addcontact') {
        return 3;
    } else if (route == '/linkedbusiness') {
        return 4;
    } else if (route == '/businessdetails') {
        return 5;
    } else if (route == '/addtiming') {
        return 6;
    } else if (route == '/addcategories') {
        return 7;
    } else if (route == '/addphoto') {
        return 8;
    } else if (route == '/thankyou') {
        return 9;
    }
}

function fetchStage(url, module) {
    switch (module) {
        case FREE_LISTING_MODULE_NAME:
            return fetchStageFL(url);
        case ADVERTISE_MODULE_NAME:
            return fetchStageADV(url);
        case DC_MODULE:
            return fetchStageDC(url);
    }
}

function fetchModule(url = '') {
    let isFL = url.toLowerCase().includes('free-listing');
    let isADV = url.toLowerCase().includes('advertise');
    let isDC = url.toLowerCase().includes('/dc');

    if (isFL && isDC) {
        return DC_MODULE;
    } else if (isFL) {
        return FREE_LISTING_MODULE_NAME;
    } else if (isADV) {
        return ADVERTISE_MODULE_NAME;
    } else {
        return null;
    }
}

function fetchDetailsFromReferrer(referrer) {
    const urlWithoutQuery = referrer?.split('?')[0];
    const module = fetchModule(urlWithoutQuery);
    const stage = fetchStage(urlWithoutQuery, module);
    const page = formRoute(urlWithoutQuery, module)

    return {
        stage: stage,
        module: module,
        page: page
    }
}

async function logdata(req, res) {
    const { referrer = null } = req.headers || {};
    const { source, clickType, IP, trace, mobile, docid, sessionId, city, referrerModule, token, li, stype } = req.body || {};
    const dataObj = fetchDetailsFromReferrer(referrer);
    console.log('dataObj', dataObj)
    let currDate = new Date();
    let query = `INSERT INTO ${TABLE_NAME} (session_id, docid, mobile, stage, city, source, module, click_type, page, ip_address, trace, referrer, token, li, stype, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        sessionId || null,
        docid || null,
        mobile || null,
        dataObj.stage || null,
        city || null,
        source || null,
        dataObj.module || null,
        clickType || null,
        dataObj.page || null,
        IP || null,
        trace || null,
        referrerModule || null,
        token || null,
        li || null,
        stype || 0,
        currDate || ''
    ];

    try {
        const queryResponse = await excuteQuery({
            query: query,
            values: values
        });
        
        if (!queryResponse?.error?.code) {
            return res.status(201).send({
                msg: 'Log Created',
            })
        } else {
            return res.status(400).send({
                msg: 'failed',
                error: 'bad request'
            })
        }
    } catch (error) {
        return res.status(500).send({
            msg: 'failed',
            error: error?.message || ''
        })
    }
}

export default logdata;
