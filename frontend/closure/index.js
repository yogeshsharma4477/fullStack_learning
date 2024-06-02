// clousure is function that reference a variables in the outer scope from it inner scope
// a scope refers to your current context of your code, it can be globally or lacally defined
// with the help of es6 we also can define blocked scope

// lexical scope in js define outside a function can be accesible inside of an another function 
// but the opposit is not true a variable inside an function is not accesiible outside of a function


// every time you create a function a closure is also formed
// A closure is the combination of a function and the lexical environment within which that function was declared.

// Global scope
function makeFunc() {
    const name = "Mozilla"; // Enclosing scope (can be block, function, or module scope)
    function displayName() {
      console.log(name); // Local scope (Own scope)
    }
    return displayName;
  }
//   makeFunc()();
  const myFunc = makeFunc();
  myFunc();


//Advantage
//closure makes it possible for a function to have private variable
//time optimzation
//function currying is possible because of closure

//========================================= Closure scope ==============================================================================
// Every closure has three scopes:

// Local scope (Own scope)
// Enclosing scope (can be block, function, or module scope)
// Global scope

// global scope
const e = 10;
function sum(a) {
  return function (b) {
    return function (c) {
      // outer functions scope
      return function (d) {
        // local scope
        return a + b + c + d + e; // this function will have access to all it parent variable
      };
    };
  };
}

console.log(sum(1)(2)(3)(4)); // 20


//============================================ Question ===========================================================================
// Q1 what will be logged to console
// iify
let count = 0
(function printCount(){
    if(count == 0){
        let count  = 1; // shadowing
        console.log(count);
    }
    console.log(count)
})();
// 1;
// 0;


//Q2 write a function that would allow you to do this

// let addSix = createBase(5);
// addSix(10) // return 16
// addSix(21) // return 27

function createBase(base){
    return function(num){
       return base + num
    }
}


// Q3. Time Optimization
function find(index){
    let a = [];
    for (let i = 0; i < 10000000; i++) {
        a[i] = i * i;
    }
    console.log(a[index]);
}

function OptimizedFind(){
    let a = [];
    for (let i = 0; i < 10000000; i++) {
        a[i] = i * i;
    }
    return function(index){
        console.log(a[index]);
    }
}

const closure = OptimizedFind()
closure(6)

console.time("6")
closure(6);
console.timeEnd("6")

console.time("6")
find(6);
console.timeEnd("6")
console.time("12")
find(12);
console.timeEnd("12")



// Q4. Block scope and setTimeout
function a(){
for(var i = 0; i < 3; i++){
    setTimeout(() => {
        console.log(i);
    }, 1000 * i);
}
}
a();
// 3 3 3 after 1 second


function a(){
    for(let i = 0; i < 3; i++){
        setTimeout(() => {
            console.log(i);
        }, 1000*i);
    }
}
a();
// 1 2 3 on every 1 sec



// Q5.how would you use a clsoure to create a private counter?
// convention for private variable is _counter

function counter(){
    let _counter = 0;

    function add(increament){
        _counter += increament
    }

    function retrive(){
        return "Counter = " + _counter
    }

    return {
        add,
        retrive
    }
}

const c = counter()
c.add(5)
c.add(10)
console.log(c.retrive())

// we are not directly manipulating the variable



//Q6. what is module pattern
// module pattern is we have private function in our func and also public function which we are return to our user
// and inside public folder we can use private function
// don't return private function not returning private function make it not accessible to user

let Module = (function (){
    function privateMethod(){
        console.log("private");
    }
    return {
        publicMethod : function(){
            console.log("public");
        }
    }
})()

Module.publicMethod()
Module.privateMethod()// this will give error




// Q7. Make this run only once

let view;
function likeTheVideo(){
    view="hello world"
    console.log("run only once");
}
likeTheVideo()

function likeTheVideoOnce(){
    let called = 0;
    return () =>{
        if(called > 0){
            console.log("Already called");
        }else{
            view="hello world"
            console.log("run only once");
            called++
        }
    }
}

const isCalled = likeTheVideoOnce()

isCalled()
isCalled()
isCalled()
isCalled()



//Q8. generic once pollyfill
function Once(func, context){
    let hasBeenCalled = false;
        let run = null;
        return (...args) => {
            if (!hasBeenCalled) {
                run = func.apply(context || this, [...args]);
                hasBeenCalled = true;
            } else {
                run = 'function already called';
            }
            return run;
        };
    }
    
    const myOnce = Once((a,b) => {
        return a + b
    })
    console.log(myOnce(2,3))
    console.log(myOnce(2,3))
    console.log(myOnce(2,3))


//Q9. caching/memoised pollyfill - cars 24

function myMemoise(func, context){
    let obj = {};
    return (...args) => {
        let node = JSON.stringify(args)
        if(!obj[node]){
            obj[node] = func.call(context || this, ...args)
            return obj[node]
        }else{
            return obj[node]
        }    
    }
}

function heavy(n1,n2){
    for(let i = 0;i <= 1000000000; i++){
    }
    return n1*n2
}

let memosied = myMemoise(heavy)
console.log(memosied(21,43))
console.log(memosied(21,43))
// console.log((5))



// Q10. differnce between closure and scope











//used lazy loading for fast app render
//api optimization used caching for data storage and prevent api call if data already present, abort controller
//prevent memeory, clear all the events when component unmount
//design pattern - in daily routine like closure, currying where ever needed
//understand CRP - not related to project
//optimaztion search using debouncing and also use throlling to prevent multiple submits
//handled multiple api calls efficiently
//web worker for thirdparty api such as tracker , hotlead, lead logs
//accessibility - for disabled person used attribute tab-index = 0, arail-label, 
//obeserver element observe on a viewPort and perform action based on it
//SEO - web vital , cls - lighthouse
//image optimzatoin using next Image, used CDN instead of storing in folder also compressed it
//XSS cross side scripting - innerText returns all text contained by an element and all its child elements. innerHtml returns all text, including html tags, that is contained by an element. 
//   avoid using innerHtml whenever possible
// useRef for error handling because if synchronous
// e.preventDefault




