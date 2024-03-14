document.getElementById("parent")
    .addEventListener("click", (e) => {
        console.log("Li " + e.target.id, "clicked");
    })


// document.getElementById("grandparent")
//     .addEventListener("click", () => {
//         console.log("grandparent clicked");
//     }, true)

// document.getElementById("parent")
//     .addEventListener("click", (e) => {
//         e.stopPropagation()
//         console.log("parent clicked");
//     }, true)
// document.getElementById("child")
//     .addEventListener("click", () => {
//         console.log("child clicked");
//     }, true)

// document.getElementById("inner")
//     .addEventListener("click", () => {
//         console.log("inner clicked");
//     }, false)