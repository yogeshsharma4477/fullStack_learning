const obj = { 'a.b.c': 2, d: 4 };

function unflatten(obj){
   let result = {};
   for(let key in obj){
       let keys = key.split('.')
       keys.reduce((acc,k,i)=>{
           if(keys.length - 1 == i){
               acc[k] = obj[key]
           }else{
               acc[k]  = acc[k] || {}
           }
           return acc[k]
       },result)
   }
   return result
}

console.log(unflatten(obj))