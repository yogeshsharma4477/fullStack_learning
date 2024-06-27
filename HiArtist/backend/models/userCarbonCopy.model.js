const mongoose = require('mongoose')

const userCarbonCopySchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    mobile: String,
    email: String,
    description: String,
    Profile_Photo: {
        data: Buffer,
        contentType: String
    },
    current_artist: String,
    display_post: String,
})

const userCarbonCopyModel = mongoose.model("userCarbonCopy", userCarbonCopySchema)
module.exports = userCarbonCopyModel