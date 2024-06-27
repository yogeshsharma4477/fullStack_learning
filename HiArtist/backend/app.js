const express = require('express')
const db = require('./connection');
const clubs = require('./routes/clubs');
const artist = require('./routes/artist');
const common = require('./routes/common')
var bodyParser = require('body-parser');

const app = express()

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/myuploads', express.static('myuploads'))

app.use('/', clubs)
app.use('/', artist)
app.use('/', common)

db.mongoConnect((db) => {
    app.db = db;
});
app.listen(8082, () => {
    console.log("server running on port 8082");
})










// const uri = "mongodb+srv://yogeshwarsharma4477:TCCXqZaYIonMUMRP@artconnect.g2t6kup.mongodb.net/?retryWrites=true&w=majority";

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected Successfully'))
//     .catch((err) => { console.error(err); });

// mongoConnect().then(db=>{
//     db.createCollection("club")
// })