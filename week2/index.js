const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

app.use(bodyParser.json())

function middleware1(req,res,next){
  //this req, res can access the request same as our route can access the request,response
  console.log("from middleware"+req.headers.counter);
  if(true){
    next()
  }else{
    res.send("Error from inside middleware")
  }
}

// app.use(middleware1)

function calculateSum(counter){
    let result = 0;
    for (let i = 1; i <= counter; i++) {
        result += i
    }
    return result
}

function handelFirstRequest(req, res){
    let num = req.headers.counter
    let calculate = calculateSum(num)
    let answer = `this is sum of ${num} is ${calculate}` 
    res.send(answer)
  }

// app.get('/', handelFirstRequest)

app.post('/', (req,res)=>{
  console.log(req.body,"=============");
  res.send("post request")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// below code is enough for you to create http sever, and allow you to access on internet

// how to do we expose to the world, there is where we need http server
// fs comes with nodejs
// and there are alot of library that let you write very easily http server
// express is one the library which let you create http server very easily

//RECAP - Client server model let anyone from browser talk to a sever(ex. AWS Server)
//        Express allow us to write HTTP server easily
// any website on the internet when go to chatgpt a request is goes to internet to the server, listen to the request and send response through http server

//1. Query Params, Headers and body are three ways to send some data to backend 
//> Query Params - www.localhost:3000/route?queryParam=data, req will have queryParams, req.query
//> dynamicParam - app.req('/:username') - req.query.username

//2.Request methods
//> GET,POST,PUT,PATCH,DELETE

//3. URL route
//4. STATUS code