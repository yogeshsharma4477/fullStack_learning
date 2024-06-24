

// function greet(person: Person): string {
//     return `${person.name} glad you are ${person.age} old`
// }

// console.log(greet({
//     name: "yogesh",
//     age: 21
// }))


// interface Person {
//     name: string,
//     age: number,
//     greet(): string
// }

// class ClassPerson implements Person {
//     name: string;
//     age: number;

//     constructor(name, age) {
//         this.name = name;
//         this.age = age;
//     }

//     greet() {
//         return `welcome ${this.name} glad you are ${this.age} old`
//     }
// }

// const p = new ClassPerson("yogesh", 21)
// console.log(p.greet())


// type Address = {
//     room: number,
//     area: string
// }

// one way is interface lets you use other interface
// interface person {
//     name: string,
//     age: number,
//     address: Address
// }

// interface extend interface
// interface person extends Address {
//     name: string,
//     age: number,
// }



interface Circle{
    radius: number
}

interface Square{
    side:number
}

interface Rectangle{
    width: number
    height: number
}

type shaps = Rectangle | Circle | Square

function renderShape(shape: shaps | undefined){
    console.log("render")
}
function calculateArea(shape:shaps){

}
