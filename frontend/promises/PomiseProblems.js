// ==================== Challenge 1: Promise Constructor
console.log('start'); 
const promise1 = new Promise((resolve, reject) => {  
   console.log(1)
}) ;
console.log('end');

// Synchronized code blocks are always executed sequentially from top to bottom.

// When we call new Promise(callback), the callback function will be executed immediately.
// Output, So this code is to sequentially output start, 1, end.



// ======================= Challenge 2: .then()
//this is sync code
console.log('start'); 
const promise2 = new Promise((resolve, reject) => {  
  console.log(1)  
  resolve(2)
}) 

// this is async code 
promise2.then(res => {  
  console.log(res)
}) 

//this is sync code
console.log('end');

//>>So the output is start , 1 , end and 2 .



// ========================= Challenge 3: resolve()
// What is the output of this code snippet?

console.log('start'); 
const promise4 = new Promise((resolve, reject) => {  
  console.log(1)  
  resolve(2)  
  console.log(3)
})
promise4.then(res => {  
  console.log(res)
}) 
console.log('end');
// Remember, the resolve method does not interrupt the execution of the function. The code behind it will still continue to execute.

// Output, So the output result is start , 1 , 3, end and 2 .



// Challenge 4: resolve() isn’t called
console.log('start'); 
const promise3 = new Promise((resolve, reject) => {  
  console.log(1)
}) 
promise3.then(res => {  
  console.log(2)
})
console.log('end');
// The resolve method has never been called, so promise1 is always in the pending state. So promise1.then(…) has never been executed. 2 is not printed out in the console.

// Output, So the result is start , 1 , end




// Challenge 5: convert callback-based functions to use Promises?


// function fetchDataFromAPI() {
//   return new Promise((reslve,reject)=>{
//     setTimeout(() => {
//       const data = { message: 'Data received from API' };
//       reslve(data)
//     }, 1000);
//   })
// }

// fetchDataFromAPI().then(console.log).catch(console.error)


// function fetchDataFromAPI(callback) {
//   // Simulating an asynchronous operation (e.g., fetching data from an API)
//   setTimeout(() => {
//     const data = { message: 'Data received from API' };
//     callback(null, data);
//   }, 1000);
// }

// // Using the callback-based function
// fetchDataFromAPI((error, result) => {
//   if (error) {
//     console.error('Error:', error);
//   } else {
//     console.log('Result:', result);
//   }
// });