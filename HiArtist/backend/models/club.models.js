const mongoose = require('mongoose')

const ClubSchema = new mongoose.Schema({
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

const ClubModel = mongoose.model("Club", ClubSchema)
module.exports = ClubModel