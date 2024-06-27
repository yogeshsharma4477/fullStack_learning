import mysql from 'serverless-mysql';

export const db_success = mysql({
    config: {
        host: process.env.LANG_DB.MYSQL_HOST, //'192.168.131.56',
        port: process.env.HOTLEAD_LOGS_DB.MYSQL_PORT, //'3306',
        database: process.env.HOTLEAD_LOGS_DB.MYSQL_DATABASE, //'justdial',
        user: process.env.HOTLEAD_LOGS_DB.MYSQL_USER,
        password: process.env.DB_PASSWORD // '!5@uGuST1($7FrEe1Ndi@'
    }
});


export default async function excuteQuery({ query, values }) {
    try {
        const results = await db_success.query(query, values);
        await db_success.end();
        
        return results;
    } catch (error) {
        return { error };
    }
}


// host:process.env.LANG_DB.MYSQL_HOST ,// '192.168.131.56',
// port:process.env.HOTLEAD_LOGS_DB.MYSQL_PORT,// '3306',
// database:process.env.HOTLEAD_LOGS_DB.MYSQL_DATABASE, // 'justdial',
// user:process.env.HOTLEAD_LOGS_DB.MYSQL_USER,// 'web_app_wr',
// password:process.env.DB_PASSWORD // '!5@uGuST1($7FrEe1Ndi@'