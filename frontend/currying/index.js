// f(a,b) into f(a)(b)

// function currying takes 1 argument at a time and return a new function expecting the next argument

function f(a){
    return(b)=>{
        console.log(a,b);
    }
}

// let curry = f(3)
// console.log(curry(4));

// or

// console.log(f(3)(4));


//Why do we use function currying?

//Questions
// 1. sum(1)(2)(3)
function sum(a){
    return (b)=>{
        return (c)=>{
            return a+b+c
        }
    }
}

// console.log(sum(1)(2)(3));

// 2.
// evaluate("sum")(4)(2) => 6
// evaluate("multiply")(4)(2) => 6
// evaluate("divide")(4)(2) => 6
// evaluate("subtract")(4)(2) => 6


function evaluate(operation){
    return (a) => {
        return (b) => {
            if(operation === "sum") return a+b
            else if(operation === "multiple") return a*b
            else if(operation === "divide") return a/b
            else if(operation === "subtract") return a-b
            else return null
        }
    }
}

// console.log(evaluate("sum")(4)(2));
// console.log(evaluate("multiple")(4)(2));
// console.log(evaluate("divide")(4)(2));
// console.log(evaluate("subtract")(4)(2));

// 3. Infinte currying

function add(a){
    return (b) => {
        if(b) {
            return add(a+b)
        }
        return a
    }
}

// console.log(add(2)(4)(5)(6)());


// 4. Currying vs Partial Application
// Partial Application transform a function into another function 
function sum(a){
    return function (b,c){
        return a + b + c
    }
}

// console.log(sum(1)(2,3));


// 5. Manipulation DOM - real world scenario 
function updateElementText(id){
    return function (content){
           document.querySelector(id).textContent = content 
    }
}

const updateHeader = updateElementText("heading")
updateHeader("1st change")

setTimeout(() => {
    updateHeader("changed text using function currying")
}, 1000);

// we can use this function again and again according to the condition ex. if click on the button we can call the updateHeader function
// we don't need to use query selector again and again we just need to initialize once and use it 

// Using querySelector multiple times in JavaScript can have a performance impact, especially 
// if it's used within loops or frequently in code that is executed often. 
// The reason is that each call to querySelector involves traversing the DOM to find the matching element(s).

// Disadvantage of using multiple querySelector

// DOM Traversal Overhead:
// The DOM is a tree structure, and searching for elements involves traversing this tree. If you repeatedly query for elements, you're repeatedly traversing the DOM, which can be inefficient.

// Redundant Work:
// If the structure of your HTML is relatively static, fetching the same element multiple times may result in redundant work. It's more efficient to fetch the element once and reuse the reference.

// Readability and Maintainability:
// Reusing a reference obtained through querySelector can also enhance code readability and maintainability. It centralizes the logic for finding a particular element, making it easier to update if the HTML structure changes.



// 6. convert function(a,b,c,d) ==> function(a)(b)(c)(d)

function curry(func){
    return function curriedFunc(...args){
        if(args.length >= func.length){
            return func(...args)    
        }else{
            return function(...next){
                return curriedFunc(...args,...next)
            }
        }
    }
}

const summ = (a, b, c, d) => a + b + c + d
const totalSum = curry(summ)
console.log(totalSum(1)(2)(3)(4));