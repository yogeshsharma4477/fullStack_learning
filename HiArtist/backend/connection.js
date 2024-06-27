const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config()

const url = process.env.URL
const client = new MongoClient(url);

const dbName = 'HiArtist';

let _db;

async function mongoConnect() {
    try {
        await client.connect();
        console.log('Connected successfully to server');
        _db = client.db(dbName);
        return _db
    } catch (error) {
        console.log("db not connected");
        return "not connected"
    }
}


const getDb = () => {
    if (_db) {
        return _db;
    }
    // throw 'No database found!';
    console.log('No database found!');
};

const closeDb = () => {
    client.close();
    return;
}


exports.mongoConnect = mongoConnect;
exports._db = _db
exports.getDb = getDb;
exports.closeDb = closeDb;
exports.url = url;