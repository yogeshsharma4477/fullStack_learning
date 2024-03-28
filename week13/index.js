const express = require('express')
const app = express();
const routes = require('./routes/index.js')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(routes)

app.listen(3000,()=>{
    console.log('port running on port 3000');
})