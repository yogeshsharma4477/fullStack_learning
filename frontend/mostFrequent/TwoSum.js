// Input: arr[] = {0, -1, 2, -3, 1}, x= -2
// Output: Yes
// Explanation: If we calculate the sum of the output,1 + (-3) = -2

// Input: arr[] = {1, -2, 1, 0, 5}, x = 0
// Output: No

function TwoSum(arr,k){
    let sortArr = arr.sort((a,b) => a - b);
    let i = 0;
    let j = arr.length - 1;
    while(i < j){
        if((arr[i]+arr[j]) > k){
            j--
        }else if((arr[i]+arr[j]) < k){
            i++
        }else{
            return "Yes"
        }
    }
    return "No"
}

console.log(TwoSum([0, -1, 2, -3, 1],-7))

