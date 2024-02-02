

const fs = require('fs');

const readableStream = fs.createReadStream(__filename);
readableStream.close();
readableStream.on('close', () => console.log("readableStream close event callback"));
fs.readFile(__filename,()=>{
  console.log("fileread 1")
})
process.nextTick(() => console.log("nextTick 1"));
Promise.resolve().then(() => console.log("Promise 1"));
setTimeout(() => console.log("timeout 1"), 0);
