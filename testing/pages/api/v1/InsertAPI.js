//source(you'll get from redux) ,parentid, docid, companyname, city, data_city, updatedip
import { encodeQueryData, InsertAPIServerValidation } from '@/utils/commonFunc'
import { db } from '../lib/db'
import axios from 'axios'
import moment from 'moment'
import { PORT_ADD_CONTACT } from '../links'
import authenticateJWT from '@/utils/middleware'

function areAllValuesNumbers(inputString) {
    const values = inputString.split(',') // Split the input string by commas
    for (const value of values) {
        if (!/^\d+$/.test(value.trim())) {
            return false // If any value is not a number, return false
        }
    }
    return true // If all values are numbers, return true
}


async function InsertAPI(req, res) {
    let body = req.body ? req.body : ''
    const currPage = body.page
    let date = moment(new Date()).format('YYYY-MM-DD+HH:mm:ss')
    
    let touch = [2, 22]
    let app = [1, 21, 81, 51, 3, 23]
    let web = [7, 27, 77, 57]
    let source_name = ''
    let source_id = ''

    if (!body.source) {
        body.source = '77'
    }
    let sourceToPass = body.source
    if (
        app.includes(Number(body.source)) ||
        touch.includes(Number(body.source))
    ) {
        source_name = 'Freelisting-App'
        source_id = '9704'
    }
    else if (web.includes(Number(body.source))) {
        source_name = 'Freelisting-Website'
        source_id = '9703'
    }
    else {
        source_name = 'Freelisting-Website'
        source_id = '9703'
    }

    if(req.headers.referer.includes('Free-Listing/dc')){
        source_name = 'JD App Data Collection'
        source_id = '1121'
    }

    let common = {
        ucode: source_id,
        uname: source_name,
        source: source_name,
        original_creator: source_name,
        createdby: source_name,
        updatedBy: source_name,
        universal_source: source_name,
        response: '1',
        paid: '0',
        validationcode: source_name,
        datesource: date.toString(),
    }

    if (body.page === 'Address') {
        common['createdtime'] = date.toString()
        common['original_date'] = moment(new Date()).format('YYYY-MM-DD')
        common['updatedOn'] = date.toString()
    } else {
        common['updatedOn'] = date.toString()
    }
    body.page === 'Address'
        ? (common['creatorip'] = body.IP ? body.IP : '')
        : ''
    common['updatedip'] = body.IP ? body.IP : ''

    delete body.IP
    delete body.source
    delete body.page
    let data = { ...body, ...common }
    if (data?.docid.match(/[^a-zA-Z0-9.-\s]/)) {
        data.docid = ''
    }
    if (data?.parentid.match(/[^a-zA-Z0-9.-\s]/)) {
        data.parentid = ''
    }
    // if (data?.national_catidlineage) {
    //     if (!areAllValuesNumbers(data?.national_catidlineage)) {
    //         data?.national_catidlineage = ""
    //     }
    // }

    const NodeToValidateObj = (({
        docid,
        parentid,
        companyname,
        data_city,
        pincode,
        mobile_display,
    }) => ({
        docid,
        parentid,
        companyname,
        data_city,
        pincode,
        mobile_display,
    }))(data)

    try {



        let ErrorCheck = InsertAPIServerValidation(NodeToValidateObj)

        if (ErrorCheck.error) {
            return res.status(200).json({ data: ErrorCheck, success: false })
        }

        let queryParam = {
            data_city: data?.city || 'mumbai',
            module: 'Freelisting-Website',
            source: source_name,
            source_id: source_id
        }
        if (data?.building_name) queryParam.building_name = data?.building_name;
        if (data?.data_city) queryParam.data_city = data?.data_city;
        if (data?.street) queryParam.street = data?.street;
        if (data?.landmark) queryParam.landmark = data?.landmark;
        // if(data?.companyname) queryParam.compname = data?.companyname;

        // if(data?.contact_person) queryParam.contact_person = data?.contact_person;
        if (data?.mobile_display) queryParam.mobile = data?.mobile_display.replace(/,/g, '|~|');
        if (data?.landline) queryParam.landline = data?.landline.replace(/,/g, '|~|');
        if (data?.email) queryParam.email = data?.email.replace(/,/g, '|~|');
        if (data?.wnumber) queryParam.whats_app = data?.wnumber.replace(/,/g, '|~|');
        // queryParam = new URLSearchParams(queryParam).toString()
        let gcompurl = `http://${process.env.V2.GLOBAL_COMPANY_API}`
        const gres = await axios.get(gcompurl, { params: queryParam });
        if (gres?.data?.error?.code == 1) {
            return res
                .status(200)
                .json({ data: gres?.data?.error, message: 'Something went wrong', success: false, statuscode: 1 })
        }

        let url = `http://${PORT_ADD_CONTACT}/insert_api.php?${encodeQueryData(
            data
            // let url = `http://${PORT_ADD_CONTACT}/insert_api.php?${encodeQueryData(data)}`
        )}`
        const response = await axios.get(url)
        let Inser_tbl_api_calls_query = `INSERT INTO tbl_api_calls (docid, ins_param, ins_response, source) VALUES ('${JSON.stringify(
            data.docid
        )}', '${JSON.stringify(data)}', '${JSON.stringify(
            response?.data
        )}', '${JSON.stringify(sourceToPass)}');`

        db.query(Inser_tbl_api_calls_query)
            .then((result) => { })
            .catch((err) => {
                console.error(err, 'Error')
            })
        try {
            if (currPage === 'Address') {
                let autologinUrl = ""
                let autoLoginApi = 'http://127.0.0.1:8384/Advertise/api/v1/autologin'
                const buffer = Buffer.from(data?.mobile);
                let encrypted_num = buffer.toString('base64');
                let headers = { ask: `${encrypted_num}${process.env.AUTO_LOGIN_TOKEN}` }
                let autoLoginPayload = {
                    docid: data?.docid,
                    mobile: data?.mobile || data?.mobile_display,
                    module: 'freeListing'
                }
                let autoLoginRes = await axios.post(autoLoginApi, autoLoginPayload, { headers: headers })
                if (autoLoginRes?.data?.error?.code == 0) {
                    autologinUrl = autoLoginRes?.data?.shorturl || ""
                }

                let payload = {
                    "mobile": data?.mobile || data?.mobile_display,
                    "email_id": "",
                    "template": "JOIN_FREE_ADVERTISE",
                    "vertical": "CLIENT",
                    "category": "NUDGES",
                    "fields": {
                        "URL": autologinUrl || "https://staging2.justdial.com/Advertise"
                    }
                }
                let url_sms = `http://192.168.131.12/communication/api/v1/send_communication`;
                await axios.post(url_sms, payload)
            }
        } catch (error) {
            return res.status(200).json({ data: response?.data, success: true, statuscode: 2 })
        }
        return res.status(200).json({ data: response?.data, success: true, statuscode: 3 })
    } catch (error) {
        let Inser_tbl_api_calls_query = `INSERT INTO tbl_api_calls (docid, ins_param, ins_response, source) VALUES ('${JSON.stringify(
            data.docid
        )}', '${JSON.stringify(data)}', '${JSON.stringify(
            error
        )}', '${JSON.stringify(sourceToPass)}');`

        db.query(Inser_tbl_api_calls_query)
            .then((result) => { })
            .catch((err) => {
                console.error(err, 'Error')
            })
        return res
            .status(200)
            .json({ data: error, message: error?.message, success: false, statuscode: 4 })
    }
}

export default authenticateJWT(InsertAPI)

