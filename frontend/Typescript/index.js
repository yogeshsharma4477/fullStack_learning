// function greet(person: Person): string {
//     return `${person.name} glad you are ${person.age} old`
// }
var ClassPerson = /** @class */ (function () {
    function ClassPerson(name, age) {
        this.name = name;
        this.age = age;
    }
    ClassPerson.prototype.greet = function () {
        return "welcome ".concat(this.name, " glad you are ").concat(this.age, " old");
    };
    return ClassPerson;
}());
var p = new ClassPerson("yogesh", 21);
console.log(p.greet());
