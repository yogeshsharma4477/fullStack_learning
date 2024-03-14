// var demo1 = document.createElement("h1");
// var placing = document.createTextNode("The Heading One is Creaated");
// demo1.appendChild(placing);

// document.body.appendChild(demo1);
window.addEventListener('resize', (e) => {
    console.log(e.target.screenLeft, "screenLeft");
    // console.log(e.target.screenTop, "screenTop");
    // console.log(e.target.screenX, "screenX");
    // console.log(e.target.screenY, "screenY");
    console.log("---------------------");
    document.getElementById("value").innerHTML = e.target.screenLeft
})