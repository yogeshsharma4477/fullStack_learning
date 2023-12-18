/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the serverr (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */


  const express = require('express')
  const bodyParser = require('body-parser')
  const app = express()


  app.use(bodyParser.json())
  let users = [
    { 
      uid:"1",
      firstName:"yogesh",
      lastName:"sharma",
      username:"yogesh123",
      password:"123"
    }
  ]

  function checkUserNameExist(username){
    for(let i=0; i<users.length; i++){
      if(users[i].username === username){
        return true
      }
    }
    return false
  }

  const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  app.post('/signup',(req,res)=>{
    let {firstName, lastName, username, password} = req.body;
    try {
      if(checkUserNameExist(username)){
        return res.status(400).send({success:"false",message:"username already exists"})  
      }
      users.push({
        "uid":uid(),
        "firstName":firstName,
        "lastName":lastName,
        "username":username,
        "password":password
      })

      return res.status(201).send({success:"true",message:"successful"})
    } catch (error) {
      return res.status(400).send({success:"false",message:error})
    }
  })

  function AuthenticateUser(username,password){
    let result = {
      isAuthenticate : false
    }
    for(let i=0; i<users.length; i++){
      if(users[i].username === username && users[i].password === password){
        result = users[i]
        result.isAuthenticate = true
        return result
      }
    }
    return result
  }
  app.post('/login',(req,res)=>{
    try {
      const {username, password} = req.body
      let UserData = AuthenticateUser(username,password)
      if(UserData.isAuthenticate){
        return res.status(400).send({success:"true",message:"Authenicated User", result: UserData || {}})
      }else{
        return res.status(400).send({success:"false",message:"Unauthorized User", result :UserData || {}})
      }
    } catch (error) {
      return res.status(400).send({success:"false",message:error})
    }
  })

  function PrivateAccessMiddleware(req,res,next){
    if(AuthenticateUser(req.headers.username, req.headers.password)){
      next()
    }else{
      return res.status(400).send({success:"false",message:"Unauthorized user"})
    }
  }

  app.get('/data',PrivateAccessMiddleware, (req,res) => {
    try {
      return res.status(400).send({success:"true", message:"authorized", users: users})
    } catch (error) {
      return res.status(400).send({success:"false",message:error})
    }
  })
  app.listen(3000,()=>{
    console.log("server running on portt 3000");
  })
