// function sum(a: number, b: number){
//     return a + b
// }

// console.log(sum('3',5));
// console.log("hellow");

//;========================interfaces can be implemented by classes========================================================

// interface PersonInterface {
//     name : String,
//     age : number,
//     greet():string
// }

// class Person implements PersonInterface{
//     name: String;
//     age: number;

//     constructor(name : string, age: number){
//         this.name = name;
//         this.age = age;
//     }

//     greet() {
//         return "hi mr " + this.name
//     }
// }

// const personObject = new Person("yogesh", 25)
// console.log(personObject.greet());

//=====================================================================

// interface can extent interfaces

// interface PersonGender{
//     gender : string,
//     orientation : string
// }

// interface Animal{
//     type:string
// }

// interface Person extends Animal{
//     name : String,
//     age : number,
//     genderProps: PersonGender
// }


// function greet(person : Person) : String {
//     return "hello " + person.name + " your age is " + person.age
// }


// console.log(greet({
//     name:"yogesh",
//     age:25,
//     genderProps:{
//         gender:"male",
//         orientation:"straight"
//     }
// }))




// TYPES // types are very usefull for union and ors

 interface Circle{
    radius : number
   }
   interface Square{
    side : number
   }
   interface Rectangle{
    width : number,
    height : number
   }
  
   type shape = Rectangle | Circle | Square
   // final type will look like 
//    {
//     radius : number,
//     side : number,
//     width : number,
//     height : number
//    }
// type shape = Rectangle & Circle & Square 
  
   function renderShape(shape : shape){
    console.log("rendered")
   }
  
   function calculateArea(shape : shape){
    console.log("calculate Area");
   }
  
   renderShape({
    radius :10
   })

