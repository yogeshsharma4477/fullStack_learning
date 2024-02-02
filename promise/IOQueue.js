// while running the settimout function with delay 0ms and an I/O async method, the order of execution can never be guaranteed
// setTimeout time is 1 ms if we add 0
// I/O queue callbacks are exwcuted after microtask queue callbacks and timer queue callbacks

const fs = require('fs');

fs.readFile(__filename,()=>{
  console.log("fileread 1")
})
process.nextTick(() => console.log("nextTick 1"));
Promise.resolve().then(() => console.log("Promise 1"));

setTimeout(() => console.log("timeout 1"), 0);
