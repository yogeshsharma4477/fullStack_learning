// let promise1 = [
//     new Promise((resolve) => setTimeout(resolve, 100, "apple")),
//     new Promise((resolve, reject) => setTimeout(reject, 100, "banana")),
//     new Promise((resolve) => setTimeout(resolve, 3000, "grapes")),
//   ];
  
  
//   Promise.allSettled(promise1).then(res => console.log(res)).catch(e=>console.log(e))


// =========================Pollyfill of allSettled

  let promise1 = [
    new Promise((resolve) => setTimeout(resolve, 100, "apple")),
    new Promise((resolve, reject) => setTimeout(reject, 100, "banana")),
    new Promise((resolve) => setTimeout(resolve, 3000, "grapes")),
  ];
  
  function allSettled(promises){
    return new Promise((resolve,reject)=>{
      let result =  [];
      let count = 0;
      promises.forEach(async (data,i)=>{
        try{
          let res =  await data
          result[i] = {
            status : "fulfilled",
            value: res
          }
        }catch(e){
          result[i] = {
            status : "reject",
            reason: e
          }
        }finally{
          count++
          if(count === promises.length){
            resolve(result)
          }
        }
      })
    })
  }
  
  
  allSettled(promise1).then(
    (result) => console.log(result)).catch(e=>(console.log(e)))
  