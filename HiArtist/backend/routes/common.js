const express = require('express');
const { getDb } = require('../connection');
const router = express.Router()
const { domain, staticFiles } = require('../helper');
const upload = require('../middleware/multer');


router.post('/username_suggestion', async (req, res) => {
    try {
        const db = getDb();
        const { username } = req.body
        let validUserName = []
        let user = await db.collection("artist").findOne({ "username": username })
        if (!user) {
            let maxLength = username.length + 6
            let i = Math.floor(Math.random() * 100)
            let validStr = username
            validStr += i
            while (validUserName.length < 1) {
                if (!await db.collection("artist").findOne({ "username": validStr }) && !validUserName.includes(validStr)) {
                    validUserName.push(validStr)
                } else {
                    let underScoreIndex = Math.floor(Math.random() * 6)
                    validStr = validStr.slice(0, underScoreIndex) + '_' + validStr.slice(underScoreIndex, validStr.length);
                }
                validStr += i
                validStr = validStr.slice(0, maxLength)
                i = Math.floor(Math.random() * 10000)
            }
            return res.status(201).send(JSON.stringify({ status: true, message: "", data: validUserName }))
        } else {
            res.status(201).send(JSON.stringify({ status: false, message: "username already exist", data: [] }))
        }



    } catch (error) {
        res.status(201).send(JSON.stringify({ status: false, message: error, data: [], }))
    }
})

router.post('/signup', upload.single('Profile_Photo'), async (req, res) => {
    try {
        const db = getDb();
        const { name, username, password, mobile_email, Profile_Photo, lastLogin } = req.body;
        let obj = {
            name,
            username,
            password,
            mobile_email,
            Profile_Photo: req.file ? domain + staticFiles + '/' + req.file.filename : 'NA',
            followers: [],
            followering: [],
            createdTime: new Date(),//5.30 add to get current india time
            lastLogin: new Date(),
            date: Math.floor(new Date().getTime() / 1000),
        };



        // res.send(JSON.stringify({ "msg": obj, "error": "submitted" }))
        let addData = await db.collection("user").insertOne(obj);
        res.send({
            status: true,
            message: "Record Inserted Successfully",
            data: addData,
        });
    } catch (error) {
        res.send({
            status: false,
            message: "Record Inserted Successfully",
            data: [],
        });
    }
})



module.exports = router