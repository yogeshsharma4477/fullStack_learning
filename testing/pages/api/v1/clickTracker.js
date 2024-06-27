import axios from 'axios'
import { encodeQueryData } from '@/utils/commonFunc'
import moment from 'moment'
import authenticateJWT from '@/utils/middleware'

async function ClickTracker(req, res) {
    try {
        const ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const cookieObject = req?.cookies || {}
        let sid = cookieObject.JDSID || ''
        let mobile =
            cookieObject?.userProfile && JSON.parse(cookieObject.userProfile)
                ? JSON.parse(cookieObject.userProfile).mobile
                : ''
        let city = cookieObject.main_city ? cookieObject.main_city : ''
        let { source='77', docid, li, ll } = req.body
        city = city ? city : 'National'
        const timeYMD = moment().format('YYYY-MM-DD HH:mm:ss')
        const vertical = 'free-listing'
        const params = {
            link_idf: li,
            li_vtl: vertical,
            lnk_loc: ll,
            time_stamp: encodeURIComponent(timeYMD),
            Ip: ip,
            city,
            mobile,
            source,
            docid,
            sid,
            wap: source,
            jdlite: '0',
        }

        const responce = await axios.get(
            `http://192.168.131.113/ARWXRX.html?${encodeQueryData(params)}`
        )
        return res
            .status(200)
            .json({ data: 'click tracker added', success: true })
    } catch (err) {
        throw err
    }
}

export default authenticateJWT(ClickTracker)
