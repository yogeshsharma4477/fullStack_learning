import { categoryTrendAPI } from "./APICalls";


export const getData = (analyticsData = {}) => {
  let date = []
  let value = []
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let [key, val] of Object.entries(analyticsData)) {
    if (Number(key.slice(5, 7)) < 10) {
      date.push(`${months[Number(key.slice(6, 7) - 1)]} '${key.slice(2, 4)}`);
      val.leads >= 0 && value.push(val.leads);
    } else {
      date.push(`${months[Number(key.slice(5, 7) - 1)]} '${key.slice(2, 4)}`);
      val.leads >= 0 && value.push(val.leads);
    }
  }
  return {
    date: date,
    value: value
  }
}


export const setDefaultDateAndTime = (days = 90) => {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let numberOfMonth = days / 30

  let start_date = moment(new Date(), "YYYY-MM-DD").subtract(numberOfMonth, 'months').startOf('months').format('YYYY-MM-DD');
  var end_date = moment(new Date()).subtract(1, 'months').endOf('months').format('YYYY-MM-DD');

  let startDateArr = start_date.split("-")
  let endDateArr = end_date.split("-")

  let date = []
  let startMonth = Number(startDateArr[1])
  let endMonth = Number(endDateArr[1])

  if (startMonth + endMonth === NaN) return
  let year = startDateArr[0]
  while (startMonth != endMonth + 1) {
    let dateVal = months[startMonth - 1] + ` '${year}`
    date.push(dateVal)
    if (startMonth == 12) {
      startMonth = 1;
      year = endDateArr[0]
      break;
    }
    else startMonth += 1
  }
  let value = new Array(date.length).fill(0)
  let filterValue = value.filter(x => x == 0)
  if (filterValue.length == value.length) isAllValuesZero = true;
  else isAllValuesZero = false;
  return [date, value]
}


export const categoryTrendAPICall = async (payload) => {
  categoryTrendAPI(payload).then(res => {
    if (res.data.data.error.code == 0) {
      let { data = {}, total = 0 } = res.data.data.results
      let processedObj = {}
      setLeadCount(total?.leads || 0)

      let i = 0
      while (i < numberOfMonth) {
        let checkString = `${startYear}-${startMonth >= 10 ? startMonth : `0${startMonth}`}`

        if (!data.hasOwnProperty(checkString)) {
          processedObj[checkString] = {
            'leads': null,
            'search': null
          }
        } else {
          processedObj[checkString] = data[checkString]
        }
        if (startMonth == 12) {
          startMonth = 1
          startYear += 1
        } else startMonth += 1
        i += 1;
      }
      return getData(processedObj)
    }
  }).catch(e => {
    console.log("Category Trend error", e);
  })
}