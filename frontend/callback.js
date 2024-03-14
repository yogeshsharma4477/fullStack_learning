function callback1(callback){
    setTimeout(()=>{
      console.log("first resolved")
      callback(null, 'one');
    },3000)
  }
  
  function callback2(callback){
    setTimeout(()=>{
      console.log("second resolved")
      callback(null, 'second');
    },3000)
  }
  
  function callback3(callback){
    setTimeout(()=>{
      console.log("third resolved")
      callback(null, 'third');
    },3000)
  }
  
  function final(){
    setTimeout(()=>{
      console.log("final resolved")
    },1000)
  }
  
  callback1(()=>{
    callback2(()=>{
      callback3(()=>{
        final();
      })
    })
  })
  
  

//================================= callback hell to Promise conversion



function callback1(){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(true)resolve("one")
        reject("one reject")
      },3000)
    })
  }
  
  function callback2(){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(true)resolve("two")
        reject("two reject")
      },3000)
    })
  }
  
  function callback3(){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(true)resolve("three")
        reject("three reject")
      },3000)
    })
  }
  
  function final(){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(true)resolve("final")
        reject("final reject")
      },3000)
    })
  }
  
  async function main(){
    try{
      const one = await callback1()
      console.log(one)
      const two = await callback2()
      console.log(two)
      const three = await callback3()
      console.log(three)
      const last = await final()
      console.log(last)
    }catch(error){
      console.log(error)
    }
  }
  
  main()
  