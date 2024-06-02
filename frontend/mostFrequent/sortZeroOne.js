let arr = [0, 1, 0, 1, 0, 0, 1, 1, 1, 0];


function sortZero(arr){
    let left = 0;
    let right = arr.length - 1;
    let mid = 0;
    while(mid < right){
        if(arr[mid] == 0){
            [arr[mid],arr[left]] = [arr[left], arr[mid]]
            left++
        }else{
             [arr[mid],arr[right]] = [arr[right], arr[mid]]
             right--
        }
        mid++
    }
    return arr
}

console.log(sortZero(arr))