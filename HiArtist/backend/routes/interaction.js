const express = require('express');
const router = express.Router()
const { getDb } = require('../connection');
// postId : "123"
// UserId(person who has commented on the post) : "983"
// Like : (Boolean(true/false))
// comment: "this is comment text"
// Media : (link to emoji files)
router.post('/feed/interaction', upload.single('post'), (req, res) => {
    try {
        const db = getDb();
        const { postId, userId, like, comment, media } = req.body
        let obj = {
            postId,
            like: [],//[{userId:"",photo:""}]
            comment: [],//[{userId:"",comment:"",reply:[{userId:"",comment:""},{userId:"",comment:""}]}]
            media: [],
            createdTime: new Date(),//5.30 add to get current india time
            date: Math.floor(new Date().getTime() / 1000),
        }
        let addData = await db.collection("interaction").insertOne(obj);
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