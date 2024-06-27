import mysql from 'serverless-mysql';

export const dc_db = mysql({
    config: {
        host: '192.168.131.68',
        port: '3306',
        database: 'justdial',
        user: 'web_app',
        password: '!5@uGuST1($7FrEe1Ndi@'
    }
})

export default async function excuteQuery({ query, values }) {
    try {
        const results = await dc_db.query(query, values);
        await dc_db.end();
        return results;
    } catch (error) {
        return { error };
    }
}