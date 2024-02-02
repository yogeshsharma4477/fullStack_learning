const allPromise = [
    new Promise((resolve) => setTimeout(resolve,2000,"first resolved")),
    new Promise((resolve) => setTimeout(resolve,2000,"Second resolved")),
    new Promise((resolve) => setTimeout(()=>resolve("Third resolved"),1000)),
    new Promise((resolve) => setTimeout(()=>resolve("four resolved"),2000))
  ]
  
  Promise.all(allPromise).then(data => {
    console.log(data)
  })


  // Pollyfill of promise.all


  function PromiseAll(promises){
    return new Promise((resolve, reject) => {
      if(!promises.length)resolve([])
  
      let results = [];
      let count = 0;
      promises.forEach((promise, index) =>{
        Promise.resolve(promise)
          .then((res)=>{
            results[index] = res
            count++
            if(count == promises.length){
              resolve(results) 
            }
          })
          .catch(e => reject(e))
      })
    })
  }
  
  let promise1 = [
     new Promise(resolve => setTimeout(resolve,100,'apple')),
     new Promise(resolve => setTimeout(resolve,100,'banana')),
     new Promise(resolve => setTimeout(resolve,3000,'grapes'))
  ]
  
  PromiseAll(promise1).then(res => console.log(res))