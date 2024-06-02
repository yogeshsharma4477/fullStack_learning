// Input: str = “forgeeksskeegfor” 
// Output: “geeksskeeg”

function isPalindrome(str){
    let i = 0;
    let j = str.length - 1
    while(i < j){
        if(str[i] == str[j]){
            i++;
            j--
        }else{
            return false
        }
    }
    return true 
}

function subStr(str){
    let longestSubStr = "";
    for(let i = 0; i < str.length; i++){
        for(let j = i;j < str.length; j++){
            if(isPalindrome(str.slice(i,j))){
                if(str.slice(i,j).length > longestSubStr.length){
                    longestSubStr = str.slice(i,j)
                }
            }
        }
    }
    return longestSubStr
}

console.log(subStr("forgeeksskeegfor"))