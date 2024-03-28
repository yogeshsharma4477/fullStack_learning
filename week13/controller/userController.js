const primsa = require('../DB/db.config.js')

const createUser = async (req, res) => {
   try{
    const { name="test", email="testemail", password="testpassword" } = req?.body;
    const findUser = await primsa.user.findUnique({
        where: {
            email: "1"
        }
    })
    if (findUser) {
        return res.json({ status: 400, message: "Email Already taken" })
    }
    const newUser = await primsa.user.create({
        data: {
            name: name,
            email: email,
            password: password
        }
    })
    return res.json({ status: 400, data: newUser, message: "user created" })
   }catch(e){
    return res.json({ status: 400, data: e.message, message: "something went wrong" })
   }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body
        await primsa.user.update({
            where: {
                id: Number(userId)
            },
            data:{
                name, email, password
            }
        })
        return res.json({ status: 200, message: "user updated successfull" })
    } catch (e) {
        return res.json({ status: 400, data: e.message, message: "something went wrong" })
    }
}


module.exports = {createUser, updateUser}