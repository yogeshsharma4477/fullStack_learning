const mongoose = require('mongoose')

const followerSchema = new mongoose.Schema({
    follower: { type: Array, "default": [] }
})

const followerModel = mongoose.model("follower", followerSchema)
module.exports = followerModel