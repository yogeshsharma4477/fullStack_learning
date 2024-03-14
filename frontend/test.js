function myMemoise(func,context){
    let res = {};
    return function(...args){
        let argsCache = JSON.Stringify(args);
        if(!res[argsCache]){
            res[argsCache] = func.call(context || this, ...args);
        }else{
            return res[argsCache]
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