import { convertTime12to24 } from "./functions";

export const checkIsAny24hr_closed = (type, index, timeArr)=>{
    let checkVal = type;
    let isErr = false;
    timeArr.map((data, i)=>{
        if(data.openAtVal===checkVal){
            if ( data.selectedWeekValArr[index] == true ) {
                isErr=true;
            }
        }
    })
    return isErr;
}

export const checkIsMoreThan2Selected = (index, timeArr)=>{
    let isErr = false;
    let count = 0;
    timeArr.map((data, i)=>{
        if(data.selectedWeekValArr[index]){
            count+=1;
        }
    })

    if(count>=2) isErr = true;

    return isErr;
}

export const checkForOverLap = (openAtVal, closeAtVal)=>{
    let isOverLap = false;

    if ( !(openAtVal=='Open 24hrs' || openAtVal=='Closed') && openAtVal?.length && closeAtVal?.length ) {
       
        let openTime = convertTime12to24(openAtVal);
        let openTimeArr = openTime.split(':')
        let closeTime = convertTime12to24(closeAtVal);
        let closeTimeArr = closeTime.split(':')
        if (parseInt(openTimeArr[0]) > parseInt(closeTimeArr[0])) isOverLap = true
        else if (parseInt(openTimeArr[0]) == parseInt(closeTimeArr[0])) {
          if (parseInt(openTimeArr[1]) > parseInt(closeTimeArr[1])) isOverLap = true
        }
    }

    return isOverLap;
}

