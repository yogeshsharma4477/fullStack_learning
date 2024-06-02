function MergeTwoArr(arr1,arr2){
    let i = 0;
    let j = 0;
    let result = []
    while(i < arr1.length && j < arr2.length){
        if(arr1[i] <= arr2[j]){
            result.push(arr1[i])
            i++
        }
        if(arr1[i] > arr2[j]){
            result.push(arr2[j])
            j++
        }
    }
    while(i < arr1.length){
        result.push(arr1[i])
        i++
    }
    while(j < arr2.length){
        result.push(arr2[j])
        j++
    }
    return result
}

function MergeSort(arr){
    if(arr.length <= 1) return arr
    let mid = Math.floor(arr.length / 2)
    let left = MergeSort(arr.slice(0,mid))
    let right = MergeSort(arr.slice(mid))
    return MergeTwoArr(left,right)
}

console.log(MergeSort([1,9,5,3,1,23,1,0,5,6,3]))
