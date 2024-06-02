let obj1 = {
    a : {
        b : 21
    },
    q : 10
}

let obj2 = {
    a : {
        c : 12,
        d : 19
    }
}

function merge(obj1, obj2){
    let result = {...obj1}
    for( const [key, value] of Object.entries(obj2)){
        if(obj1[key]){
          result[key] = {...obj1[key], ...value}
        }else{
            result[obj1[key]] = obj1[key]
        }
    }
    return result
}

console.log(merge(obj1, obj2))