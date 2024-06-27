import mysql from 'serverless-mysql'

export const orderid_db = mysql({
    config: {
        host: process.env.HOST,
        port: process.env.PORT,
        database: process.env.DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
})

export default async function excuteQuery({ query, values }) {
    try {
        const results = await orderid_db.query(query, values)
        await orderid_db.end()
        return results
    } catch (error) {
        return { error }
    }
}
