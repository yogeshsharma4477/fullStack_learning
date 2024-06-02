function validParenthiese(str){
    let stack = [];
    let  i = 0;
    let map = {
        "[" : "]",
        "{" : "}",
        "(" : ")"
    }
    while(i < str.length){
        if(str[i] == "[" || str[i] == "(" || str[i] == "{" ){
            stack.push(str[i])
        }else{
            if(str[i] == map[stack[stack.length-1]]){
                stack.pop()
            }else{
                return false
            }
        }
        i++
    }
    if(stack.length == 0) return true
    return false
}

console.log(validParenthiese("[()]{}{[()()]())}"))