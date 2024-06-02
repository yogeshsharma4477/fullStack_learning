let arr = [1,[2,3,[4,5]],[6],7,[8,[9,10,[11]]]]
let result = []
function flattenArray1(arr){
    for(let i = 0; i < arr.length; i++){
         if(Array.isArray(arr[i])){
            flattenArray(arr[i])
         }else{
              result.push(arr[i])
         }
    }
    return result;
}


function flattenArray2(arr){
    let result = []
    function flatten(arr){
        for(let i = 0; i < arr.length; i++){
         if(Array.isArray(arr[i])){
            flatten(arr[i])
         }else{
              result.push(arr[i])
         }
    }
    }
    for(let i = 0; i < arr.length; i++){
         if(Array.isArray(arr[i])){
            flatten(arr[i])
         }else{
              result.push(arr[i])
         }
    }
    return result;
}

console.log(flattenArray1( [1,[2,3,[4,5]],[6],7,[8,[9,10,[11]]]]))