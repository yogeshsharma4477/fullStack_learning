import React, { useState, useEffect, useRef } from "react";

const Timer = ({ delayResend=20,  count, setShowResendOTP, isCheckTImerVal, setIsCheckTImerVal }) => {
  let delayTime = delayResend//+delayResend + (15*(count-1))
  const [delay, setDelay] = useState(0);
  const minutes = Math.floor(delay / 60);
  const seconds = Math.floor(delay % 60);


  useEffect(()=>{
    if(isCheckTImerVal.current){
      let returnTimeString = minutes<10 ?`0${minutes}`: `${minutes}`
      returnTimeString += ':'
      returnTimeString += seconds<10 ?`0${seconds}`: `${seconds}`

      if(returnTimeString == '00:00'){
        setShowResendOTP(true);
      }
    }
    setIsCheckTImerVal(true)
  })

  useEffect(()=>{
    if(delayTime == 0){
      setDelay(+delayResend)
    }else{
      setDelay(delayTime)
    }
  },[count])

  useEffect(() => {
    const timer = setInterval(() => {
      setDelay(delay - 1);
    }, 1000);

    if (delay === 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  });

  let returnTimeString = minutes<10 ?`0${minutes}`: `${minutes}`
  returnTimeString += ':'
  returnTimeString += seconds<10 ?`0${seconds}`: `${seconds}`

  if(count==0) return null

  return (
    <>
      <span style={{
        display: 'inline-block',
        width: '40px'
      }}>
          {returnTimeString}
      </span>
    </>
  );
};

export default Timer;