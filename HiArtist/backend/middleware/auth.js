const jwt = require("jsonwebtoken")
const secret = "yogeshHiArtist"
//token can be change who has token secret key
//user should not share their token to anyone
function createToken(payload) {
    return jwt.sign(payload, secret,
        {
            expiresIn: "2h",
        })
}

const verifyToken = (userToken) => {
    if (userToken) return jwt.verify(userToken, secret);
};

module.exports = {
    createToken,
    verifyToken
}