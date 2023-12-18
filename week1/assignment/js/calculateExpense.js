let expense = [
    {
      itemName: "momo",
      category: "food",
      price: "60"
    },
    {
      itemName: "idli",
      category: "food",
      price: "30"
    },
    {
      itemName: "pizza",
      category: "food",
      price: "100"
    },
    {
      itemName: "jeans",
      category: "shopping",
      price: "1160"
    },
    {
      itemName: "tshirt",
      category: "shopping",
      price: "600"
    }
  ]
  
  function calulateExpense(expense) {
    let result = {};
    expense.map((data, i) => {
      if (result[data.category]) {
        result[data.category] += Number(data.price)
      } else {
        result[data.category] = Number(data.price)
      }
    })
    return result
  }
  console.log(calulateExpense(expense))