import mysql from 'serverless-mysql'

export const success_api = mysql({
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
        const results = await success_api.query(query, values)
        await success_api.end()
        return results
    } catch (error) {
        return { error }
    }
}
