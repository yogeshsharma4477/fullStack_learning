const fs = require('fs');

fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) return
  let removeWhiteSpace = data.replace(/ +/g, ' ')
  fs.writeFile('readFile.txt', removeWhiteSpace, (err) => {
    if (err) {
      console.log(err)
    }
    return
  })
})