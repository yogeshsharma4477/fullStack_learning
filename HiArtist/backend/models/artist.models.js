const mongoose = require('mongoose')

const ArtistSchema = new mongoose.Schema({
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
    hobby: String,
    display_post: String,
})

const ArtistModel = mongoose.model("Artist", ArtistSchema)
module.exports = ArtistModel