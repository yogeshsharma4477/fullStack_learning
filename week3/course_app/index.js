const bodyParser = require('body-parser');
const expess = require('express')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const userRoute = require('./Routes/user')
const adminRoute = require('./Routes/admin')
const {run} = require('./db')
require('dotenv').config()
const app = expess()

app.use(bodyParser.json())
app.use(cors())

run().then().catch(console.log("mongo not connected"))

app.use(userRoute)
app.use(adminRoute)

app.listen(3001,()=>{
    console.log("course app server started");
})