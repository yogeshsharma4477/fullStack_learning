import mysql from 'serverless-mysql';

export const log_db = mysql({
    config: {
        host: '192.168.42.92',
        port: '3306',
        database: 'justdial',
        user: 'web_app',
        password: '!5@uGuST1($7FrEe1Ndi@'
    }
});

export default async function excuteQuery({ query, values }) {
    try {
        const results = await log_db.query(query, values);
        await log_db.end();
        return results;
    } catch (error) {
        return { error };
    }
}

  