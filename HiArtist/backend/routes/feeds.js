const express = require('express');
const router = express.Router()
const { domain, staticFiles } = require('../helper');
const upload = require('../middleware/multer');
const { getDb } = require('../connection');
// UserId:(FK)
// CreatedTime(DTTM)
// Description(String)
// Url(for Images/Video): (String)

router.post('/feed', upload.single('post'), (req, res) => {
    try {
        const db = getDb();
        const { userId, post, caption } = req.body;
        let obj = {
            userId,
            post: req.file ? domain + staticFiles + '/' + req.file.filename : 'NA',
            caption,
            media,
            createdTime: new Date(),//5.30 add to get current india time
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
        res.json({ "status": false, "message": error })
    }
})

module.exports = router