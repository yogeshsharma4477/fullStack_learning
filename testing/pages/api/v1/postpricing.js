import axios from 'axios'
import { orderid_db } from '../lib/orderid_db'
import { serialize } from 'cookie'
import { createMd5, generatePaymentGatewayOrder } from '@/libs/frontend'
import authenticateJWT from '@/utils/middleware'

async function postpricing(req, res) {
    try {
        const ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const http_host = req.headers.host || ''
        const cookieDomain =
            http_host.indexOf('.jdsoftware.jd') > -1
                ? '.jdsoftware.jd'
                : http_host.indexOf('.blrsoftware.com') > -1
                ? '.blrsoftware.com'
                : '.justdial.com'

        const {
            docid,
            shorturl,
            parentid,
            datacity,
            companyName,
            mobile,
            area,
            ordertime,
            orderId,
            email,
            pincode,
            paid,
            source,
            productName,
            amount_payable,
            total_amount,
            tax,
            discount,
            sentsource,
            empCode,
            department,
            empCity,
            pageType = 'ADVERT',
            verticalId = '111154',
        } = req.body

        console.log('orderid', req.body)
        let ch1 = await createMd5(process.env.KEY + shorturl)
        // const cookie = serialize('planoid', orderId, {
        //     path: '/',
        //     domain:
        //         process.env.NODE_ENV == 'development'
        //             ? '.jdsoftware.jd'
        //             : '.justdial.com',
        // })
        // res?.setHeader('Set-Cookie', cookie)

        const response = await orderid_db.query(
            `INSERT INTO tbl_order_master (order_id,docid, shorturl, parent_id, data_city,order_time,company_name,area,mobile,email_id,pincode,paid,source,ip_address,product_name,total_amount,amount_payable,discount,sent_source,tax,emp_code,department,emp_city)
               VALUES (${JSON.stringify(orderId)},${JSON.stringify(
                docid
            )}, ${JSON.stringify(shorturl)},${JSON.stringify(
                parentid
            )},${JSON.stringify(datacity)},${JSON.stringify(
                ordertime
            )},${JSON.stringify(companyName)},${JSON.stringify(
                area
            )},${JSON.stringify(mobile)},${JSON.stringify(
                email ?? ''
            )},${JSON.stringify(pincode)},"0",${JSON.stringify(
                source ?? ''
            )},${JSON.stringify(ip)},${JSON.stringify(
                productName
            )},${JSON.stringify(total_amount)},${JSON.stringify(
                amount_payable
            )},"","",${JSON.stringify(tax)},"","","")`
        )

        console.log('response', response)
        if (response) {
            const back_url = req.headers.referer || ''
            const api_url = `http://${http_host}/api/v1/order?dataType=getOrder&pageType=${pageType}&orderid=${orderId}&ch=${ch1}&shorturl=${shorturl}`
            const sapi = '' // `http://${http_host}/api/${page}/order?dataType=updateOrder&pageType=${pageType}&orderid=${orderId}&ch=${ch1}&shorturl=${shorturl}`
            const droppayout = 'COD,EC,More'
            const date2 = new Date()
            const paymentParams = {
                id: orderId,
                vertical: verticalId,
                droppayopt: droppayout,
                surl: back_url,
                apiurl: api_url,
                sapi: sapi,
                header: productName,
                env: process.env.PGENV,
                vname: productName,
                breadcrum: '',
                breadcrum_action: '',
                bk_url: back_url,
                amount: amount_payable,
                mobile: mobile,
                updatedon: date2,
                updatedby: companyName + ' - ' + mobile,
            }

            const payRes = await generatePaymentGatewayOrder(paymentParams)

            console.log('payRes', payRes)

            if (payRes?.data?.error_code == 0) {
                return res.status(200).send({
                    errors: {
                        code: 0,
                        msg: '',
                    },
                    success: true,
                    results: {
                        url: process.env.PGAPI,
                        id: orderId,
                    },
                })
            }

            return res
                .status(200)
                .json({ success: true, data: 'success', code: 0 })
        } else {
            return res
                .status(200)
                .json({ success: false, data: 'failed to enter data', code: 1 })
        }
    } catch (error) {
        console.log('eeeee', error)

        return res.status(500).json({ success: false, err: error })
    }
}

export default authenticateJWT(postpricing)
