const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => reject("Promise 1 rejected"), 1000);
  });
  
  const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Promise 2 rejected"), 200);
  });
  
  const promise3 = new Promise((resolve, reject) => {
    setTimeout(() => reject("Promise 3 rejected"), 300);
  });
  // Promise.race([promise1, promise2, promise3]).then(res => {
  //   console.log(res,"==");
  // }).catch(reason =>console.log(reason,"====="))

  // =========================pollyfill of race
  
  function race(promises){
    return new Promise((resolve, reject) =>{
      try{
        promises.forEach(promise =>{
          promise
          .then(res => resolve(res))
          .catch(e => reject(e))
        })
      }catch(e){
        reject(e)
      }
    })
  }
  
  race([promise1,promise2,promise3])
    .then(res => console.log(res,"=="))
    .catch(reason => console.log(reason,"====="))