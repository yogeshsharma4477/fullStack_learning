// Input: n = 2
// Output: 1
// Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.
// Example 2:

// Input: n = 3
// Output: 2
// Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.
// Example 3:

// Input: n = 4
// Output: 3
// Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.

var fib = function(n) {
    if(n == 1 || n == 2) return 1
    let i = 1;
    let a = 0;
    let b = 1;
    let c = 0
    while(i < n){
      c = a + b;
      a = b;
      b = c;
      i++
    }
    return c
  };