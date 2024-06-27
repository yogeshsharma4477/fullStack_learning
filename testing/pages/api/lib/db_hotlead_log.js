import mysql from 'serverless-mysql';

export const db_hotlead_log = mysql({
    config: {
        host: process.env.HOTLEAD_LOGS_DB.MYSQL_HOST,
        port: process.env.HOTLEAD_LOGS_DB.MYSQL_PORT,
        database: process.env.HOTLEAD_LOGS_DB.MYSQL_DATABASE,
        user: process.env.HOTLEAD_LOGS_DB.MYSQL_USER,
        password: process.env.HOTLEAD_LOGS_DB.MYSQL_PASSWORD
    }
});

export default async function excuteQuery({ query, values }) {
    try {
        const results = await db_hotlead_log.query(query, values);
        await db_hotlead_log.end();
        return results;
    } catch (error) {
        return { error };
    }
}
