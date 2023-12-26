// function sum(a: number, b: number){
//     return a + b
// }
function greet(person) {
    return "hello " + person.name + " your age is " + person.age;
}
console.log(greet({
    name: "yogesh",
    age: 25,
    genderProps: {
        gender: "male",
        orientation: "straight"
    }
}));
