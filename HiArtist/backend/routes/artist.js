const express = require('express');
const { getDb } = require('../connection');
const ArtistModel = require('../models/artist.models');
const router = express.Router()
const path = require('path');
const { domain, staticFiles } = require('../helper');
const upload = require('../middleware/multer');
const { createToken } = require('../middleware/auth');


router.post('/artist', upload.single('Profile_Photo'), async (req, res) => {
    try {
        const db = getDb();
        const { name, username, password, mobile_email, description, Profile_Photo, hobbies, display_post, lastLogin } = req.body;
        let obj = {
            name,
            username,
            password,
            mobile_email,
            description,
            Profile_Photo: req.file ? domain + staticFiles + '/' + req.file.filename : 'NA',
            hobbies,
            display_post,
            followers: [],
            followering: [],
            createdTime: new Date(),//5.30 add to get current india time
            lastLogin: new Date(),
            date: Math.floor(new Date().getTime() / 1000),
        };

        // res.send(JSON.stringify({ "msg": obj, "error": "submitted" }))
        let addData = await db.collection("artist").insertOne(obj);
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


//Get all Method
router.post('/accounts/login', async (req, res) => {
    try {
        const db = getDb();
        const { username, password } = req.body
        const user = await db.collection("artist").findOne({ "username": username, "password": password })
        if (!user) {
            return res.send({ status: false, message: "Invalid User" })
        }
        const token = createToken(user)
        res.cookie("uid", token)
        res.send({ status: true, message: "success" })
    } catch (error) {
        return res.send({ status: "catch", message: error })
    }
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    console.log(req.params["id"]);
    res.send("req")
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})

module.exports = router;
