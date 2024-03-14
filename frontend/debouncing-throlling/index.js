// Debouncing and throttling are two ways to optimize event handling in js

// Q1. create a button and add debounce as follows =>
//     show "button pressed <x> times" every time button is PermissionRequestedEvent
//     Increase "Triggered <y> times" count after 800ms of debounce
// Q2. pollyfill of bebounce and throtlling

const btn = document.querySelector('.increament_btn')
const btnPress = document.querySelector('.increament_pressed')
const count = document.querySelector('.increament_count')

let pressedCount = 0;
let triggerCount = 0;

const myDebounce = (cb, d) => {
    let timer;
    return function (...args) {
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            cb(...args)
        }, d);
    }
}

const myThrotle = (cb,d) => {
        let last = 0;
        return (...args)=>{
            let now = new Date().getTime();
            if(now - last < d)return
            last = now;
            return cb(...args)
        }
}

const throtlled = myThrotle(()=>{
    count.innerHTML = ++triggerCount
},800)


const debounceCount = myDebounce(()=>{
    count.innerHTML = ++triggerCount
},800)

btn.addEventListener("click", ()=>{
    btnPress.innerHTML = ++pressedCount;
    throtlled()
})