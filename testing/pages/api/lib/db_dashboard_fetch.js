import mysql from 'serverless-mysql';

export const db_dashboard_fetch = mysql({
    config: {
        host: process.env.DASHBOARD_DB_FETCH.HOST,
        port: process.env.DASHBOARD_DB_FETCH.PORT,
        database: process.env.DASHBOARD_DB_FETCH.DATABASE,
        user: process.env.DASHBOARD_DB_FETCH.USER,
        password: process.env.DASHBOARD_DB_FETCH.PASSWORD,
    }
})

export default async function excuteQuery({ query, values }) {
    try {
        const results = await db_dashboard_fetch.query(query, values);
        await db_dashboard_fetch.end();
        return results;
    } catch (error) {
        return { error };
    }
}
