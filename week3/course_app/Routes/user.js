const express = require('express')
const router = express.Router()
const {client, connect} = require('../db')
var jwt = require('jsonwebtoken');

// User routes
router.post('/users/signup', async (req, res) => {
    try {
        const {username, password} = req.body
        const userCollection = await connect("users")
        const userAdded = await userCollection.insertOne({ username, password })
        var token = jwt.sign({ username }, process.env.PrivateKey);
        return res.send({result:userAdded,message:"success",token:token})
    } catch (error) {
        return res.send({result:error?.message,message:"false"})
    } finally {
        client.close()
    }
});
  
router.post('/users/login', async (req, res) => {
    try {
        const name = req.headers['username']
        const password = req.headers['password']
        const userCollection = await connect("users")
        let validateUser = await userCollection.findOne({username : name, password :password})
        if(validateUser){
            let token = jwt.sign({ username }, process.env.PrivateKey)
            return res.send({message:"success",token:token})
        }else{
            return res.send({message:"Invalid username or password"})
        }
    } catch (error) {
        res.send({result:error?.message,message:"false"})
    } finally {
        client.close()
    }
});
  
router.get('/users/courses', (req, res) => {
    res.send("hellowe od")
});
  
router.post('/users/courses/:courseId', (req, res) => {
    // logic to purchase a course
});
  
router.get('/users/purchasedCourses', (req, res) => {
    // logic to view purchased courses
});

module.exports = router;