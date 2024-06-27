const express = require('express');
const { getDb } = require('../connection');
const ClubModel = require('../models/club.models');
const router = express.Router()
const path = require('path');
const { domain, staticFiles } = require('../helper');
const upload = require('../middleware/multer');

router.post('/club', upload.single('Profile_Photo'), async (req, res) => {
    try {
        const db = getDb();
        const { name, username, password, mobile, email, description, Profile_Photo, current_artist, display_post, createdTime, lastLogin } = req.body;
        let obj = {
            name,
            username,
            password,
            mobile,
            email,
            description,
            Profile_Photo: req.file ? domain + staticFiles + '/' + req.file.filename : 'NA',
            display_post,
            followers: [],
            followering: [],
            current_artist,
            createdTime: new Date(),//5.30 add to get current india time
            lastLogin: new Date(),
            date: Math.floor(new Date().getTime() / 1000),
        };

        // res.send(JSON.stringify({ "msg": obj, "error": "submitted" }))
        let addData = await db.collection("clubs").insertOne(obj);
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
router.get('/', (req, res) => {
    res.send('Get All API')
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
