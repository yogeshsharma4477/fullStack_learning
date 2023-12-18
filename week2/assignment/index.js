// fetch('http://localhost:3000/todos',{method:"get"}).then(response => {
//     return response.json()
//   }).then(res => {
//     console.log(res)
//   })


  let todoInput = document.getElementById('input')

  const fetchData = async () => {
   let data = await fetch('http://localhost:3000/todos',{method:"get"})
   let res = await data.json();
   return res
  }

//   const AddTodo = async () => {
//     let data = await fetch('http://localhost:3000/todos',
//     {
//         method:"get",
//         headers:{"Content-Type": "application/json"},
//         body:JSON.stringify(data)
//     })
//     let res = await data.json();
//     return res
//    }

  function handleAdd(){

  }