const expess = require('express')
const router = expess.Router()
const {client, connect} = require('../db')
var jwt = require('jsonwebtoken');

function AdminMiddleware(req, res, next){
    //you can pass infinity middleware in the route
}

router.post('/admin/signup',async (req, res) => {
    try {
        const {username, password} = req.body
        const userCollection = await connect("admin")
        const userAdded = await userCollection.insertOne({ username, password })
        var token = jwt.sign({ username }, process.env.PrivateKey);
        return res.send({result:userAdded,message:"success",token:token})
    } catch (error) {
        return res.send({result:error?.message,message:"false"})
    } finally {
        client.close()
    }
});
  
router.post('/admin/login', async (req, res) => {
    try {
        const name = req.headers['username']
        const password = req.headers['password']
        const userCollection = await connect("admin")
        let validateUser = await userCollection.findOne({username : name, password :password})
        if(validateUser){
            let token = jwt.sign({ username:name }, process.env.PrivateKey)
            return res.send({message:"success",token:token})
        }else{
            return res.send({message:"Invalid username or password"})
        }
    } catch (error) {
        return res.send({result:error.message,message:"false"})
    } finally {
        client.close()
    }
});

router.post('/admin/courses', async (req, res) => {
   try {
    const token = req.headers['authorization']
    const { title, description, price, imageLink, published = new Date() } = req.body
    let decoded = jwt.verify( token , process.env.PrivateKey);
    const AdminCollection = await connect("admin")
    let validateUser = await AdminCollection.findOne({username : decoded.username})
    if(validateUser){
    const CourseCollection = await connect("course")
    await CourseCollection.insertOne({ title, description, price, imageLink, published })
    return res.send({message:"Course created successfully"})
    }else{
        return res.send({message:"Invalid Token"})
    }
   } catch (error) {
    return res.send({result:error?.message,message:"false"})
   } finally {
    client.close()
   }
});

router.put('/admin/courses/:courseId', async (req, res) => {
    // db.collection.updateOne({"_id": ObjectId("12345")}, {$set: {name: "John"}});
    try {
        const token = req.headers['authorization']
        const { title = "", description="", price="" } = req.body
        
        let decoded = jwt.verify( token , process.env.PrivateKey);
        const AdminCollection = await connect("admin")
        let validateUser = await AdminCollection.findOne({username : decoded.username})
        if(validateUser){
        const CourseCollection = await connect("course")
        await CourseCollection.updateOne({"_id": req.query.courseId}, {$set:{ title, description, price }})
        return res.send({message:"Course created successfully"})
        }else{
            return res.send({message:"Invalid Token"})
        }
       } catch (error) {
        return res.send({result:error?.message,message:"false"})
       } finally {
        client.close()
       }
});
  
router.get('/admin/courses', (req, res) => {
    // logic to get all courses
});

module.exports = router