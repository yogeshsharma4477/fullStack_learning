import mysql from 'serverless-mysql';

export const db_dashboard = mysql({
    config: {
        host: process.env.DASHBOARD_DB.HOST,
        port: process.env.DASHBOARD_DB.PORT,
        database: process.env.DASHBOARD_DB.DATABASE,
        user: process.env.DASHBOARD_DB.USER,
        password: process.env.DASHBOARD_DB.PASSWORD,
    }
})

export default async function excuteQuery({ query, values }) {
    try {
        const results = await db_dashboard.query(query, values);
        await db_dashboard.end();
        return results;
    } catch (error) {
        return { error };
    }
}
