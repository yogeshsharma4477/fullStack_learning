import { useEffect, useState } from 'react';
import styles from './getaheadcompetition.module.scss';
import Highcharts from "highcharts";
import { useRouter } from 'next/router'
import moment from "moment";
import { LeaderBoard } from './LeaderBoard';
import { categoryTrendAPI } from './APICalls';
import { getData } from './categoryTrendFunctions';
import { sanitizeParams } from '@/utils/commonFunc';
import { leaderBoardAPI } from './APICalls';
import CategoryTrend from './CategoryTrend';


var isAllValuesZero = false;
export default function Getaheadcompetition({ categorySearch, city, RedirectGetPremiumPlan }) {
  const router = useRouter()
  let sourceCode = router?.query?.source || '77'
  sourceCode = sanitizeParams(sourceCode)
  const [responceMsg, setResponceMsg] = useState("");
  const [data, setData] = useState({
    date: [],
    value: []
  })

  const [leadCount, setLeadCount] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [formatedDate, setFormatedDate] = useState("");
  const [isDataFetched, setIsDataFetched] = useState({
    category: false, leaderBoard: false
  })

  const [selectTab, setSelectTab] = useState([
    {
      label: '3M',
      isSelected: true,
      days: 90,
    },
    {
      label: '6M',
      isSelected: false,
      days: 180,
    }
  ])

  const getDataBasedOnDate = (days = 90) => {
    let numberOfMonth = days / 30
    if (selectTab[0].label == '3M' && selectTab[0].isSelected) {
      numberOfMonth = 90 / 30
    } else {
      numberOfMonth = 180 / 30
    }

    let start_date = moment(new Date(), "YYYY-MM-DD").subtract(numberOfMonth, 'months').startOf('months').format('YYYY-MM-DD');
    var end_date = moment(new Date()).subtract(1, 'months').endOf('months').format('YYYY-MM-DD');

    let startMonth = Number(start_date.slice(5, -3))
    let startYear = Number(start_date.slice(0, -6))
    if ([startMonth, startYear].includes(NaN)) return

    let ncatid = categorySearch?.key || '10272436'
    let cityy = city || "mumbai"

    let payload = {
      city: cityy,
      area: cityy,
      ncatid: ncatid,
      fromdate: start_date,
      todate: end_date
    }


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
        setData(() => getData(processedObj))
        setIsDataFetched(prev=>{
          return {...prev,category:true}
        })
      }
    }).catch(e => {
      console.log("Category Trend error", e);
    })
  }

  const changeTab = (e, index) => {
    e.preventDefault()
    let tempSelectTab = [...selectTab]
    tempSelectTab.map((e, i) => {
      if (i !== index) e.isSelected = false
      else e.isSelected = true
    })
    setSelectTab(tempSelectTab)
    getDataBasedOnDate(selectTab[index].days)
  }

  const options = {
    chart: {
      type: "column",
      height: graphHeight || 280,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "leads trends",
      style: { opacity: 0 },
    },
    xAxis: {
      categories: data.date,
    },
    yAxis: {
      labels: {
        enabled: false
      },
      title: null
    },
    series: [
      {
        showInLegend: false,
        name: "Leads",
        data: data.value,
        color: "#0076D7",
        dataLabels: {
          enabled: !isAllValuesZero,
          crop: false,
          overflow: "none"
        },
      },

    ],

  };

  useEffect(() => {
    getDataBasedOnDate()
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    })
    setGraphHeight(document.getElementById("leadboardListId")?.clientHeight)
  }, [])

  function handleRedirect() {
  }

  const setResponceToDefault = () => {
    setResponceMsg("");
  };

  const showToast = () => {
    if (!responceMsg?.length) return;
    setTimeout(() => {
      setResponceToDefault();
    }, 3000);
    return (
      <div
        className={`toastmessage font11 colorfff`}
        style={{ zIndex: "1" }}
      >
        <span className={`toastmessage__text`}>{responceMsg}</span>
        <span
          onClick={setResponceToDefault}
          className={`iconwrap closeiconwhite ripple`}
        />
      </div>
    );
  };

  function fetchLeaderBoard() {

    const start_date = moment().subtract(8, 'days');
    const end_date = moment().subtract(2, 'days');

    setFormatedDate(`${start_date.format('DD-MMM-YYYY')} to ${end_date.format('DD-MMM-YYYY')}`)

    let ncat = categorySearch?.key || '10272436'
    let ct = city || "mumbai"

    let payload = {
      city: ct,
      area: ct,
      ncatid: ncat,
      fromdate: start_date.format('YYYY-MM-DD'),
      todate: end_date.format('YYYY-MM-DD')
    }

    leaderBoardAPI(payload)
      .then(res => {
        let response = res?.data?.data
        if (response?.error?.code == '0') {
          let competitorObj = response?.results?.competitor_trending_nc?.competitors
          let competitorValues = []
          let i = 0
          if (competitorObj) {
            for (let [key, value] of Object.entries(competitorObj)) {
              if (i <= 3) {
                competitorValues.push(value)
              }
              i++
            }
          }
          setLeaderBoard(competitorValues)
          setIsDataFetched(prev=>{
            return {...prev,leaderBoard:true}
          })
        }
      })
  }

  useEffect(() => {
    fetchLeaderBoard()
  }, [])

  useEffect(() => {
    let listId = document.getElementById("leadboardListId")
    if (listId) setGraphHeight(listId.clientHeight)
  }, [leaderBoard])

  let isCategoryShow = data.value.reduce((a, b) => a + b, 0) != 0
  let isLeaderboardShow = leaderBoard?.length > 2

  if((!isDataFetched?.category || !isDataFetched?.leaderBoard)){
    return <></>
  }
  if(!isCategoryShow && !isLeaderboardShow){
    return <></> 
  }

  return (
    <section id="competition" className={`${styles.competition} section`}>
      {/* <h2 className={`color1a1 ${!isCategoryShow || !isLeaderboardShow ? 'text--center' : ''}`}>Get Ahead of Your Competition</h2> */}
      <div className={`${styles.competition__box} flex flex__col`}>
        <div className={`flex ${styles.competition__bottom} `}>
          {
            isCategoryShow &&
            <CategoryTrend
              categorySearch={categorySearch}
              leadCount={leadCount}
              selectTab={selectTab}
              changeTab={changeTab}
              data={data}
              options={options}
              RedirectGetPremiumPlan={RedirectGetPremiumPlan}
            />
          }
          {
            isLeaderboardShow &&
            <LeaderBoard
              ncatid={categorySearch?.key}
              city={city}
              area={city}
              category={categorySearch?.label}
              handleRedirect={handleRedirect}
              setGraphHeight={setGraphHeight}
              RedirectGetPremiumPlan={RedirectGetPremiumPlan}
              formatedDate={formatedDate}
              leaderBoard={leaderBoard}
            />
          }
          {showToast()}
        </div>
      </div>
    </section>
  )
}

