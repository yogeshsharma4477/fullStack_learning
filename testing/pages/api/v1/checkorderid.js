import axios from 'axios'
import { orderid_db } from '../lib/orderid_db'
import authenticateJWT from '@/utils/middleware'

async function checkorderid(req, res) {
    try {
        const { orderid } = req.body

        console.log('orderid', req.body)

        const response = await orderid_db.query(
            `SELECT * from justdial.tbl_order_master where order_id="${orderid}"`
        )
        console.log('hello', response)
        if (response.length > 0) {
            return res
                .status(200)
                .json({ success: true, data: 'exists', code: 1 })
        } else {
            return res
                .status(200)
                .json({ success: false, data: 'does not exist', code: 0 })
        }
    } catch (error) {
        return res.status(500).json({ success: false, err: error })
    }
}

export default authenticateJWT(checkorderid)
