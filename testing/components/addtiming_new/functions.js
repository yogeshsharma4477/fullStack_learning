export const genrateOption = (type, minDiff)=>{

    let optionArr = [];
    let checkIsInLoop = true;
    let hr = 12;
    let min = 0;
    let am_pm = "AM";
    while (checkIsInLoop) {
        let optionValue = `${hr < 10 ? `0${hr}` : hr}:${min < 10 ? `0${min}` : min} ${am_pm}`;
        if (optionValue === '12:00 AM' || optionValue === '12:15 AM' || optionValue === '12:30 AM') optionValue += ' (Midnight)'
        if (optionValue === '12:00 PM' || optionValue === '12:15 PM' || optionValue === '12:30 PM') optionValue += ' (Noon)'
        optionArr.push({ key: optionArr.length, label: optionValue });
        if (optionValue == `11:45 PM`) checkIsInLoop = false;
        min += minDiff;
        if (min == 60) {
            if (hr + 1 == 12) am_pm = "PM";
            if (hr + 1 > 12) hr = 1;
            else hr += 1;
            min = 0;
        }
    }

    switch(type) {
        case 'openAt':
            const part1_openAt = optionArr.slice(0, 28);
            const part2_openAt = optionArr.slice(28);
            optionArr = part2_openAt.concat(part1_openAt);
          
            optionArr.unshift({
                key: 2,
                label: "Closed",
            });
            optionArr.unshift({
                key: 1,
                label: "Open 24hrs",
            });
            // optionArr.push({
            //     key: optionArr.length,
            //     label: "12:00 AM (Midnight)",
            // });
            return optionArr;
            break;

        case 'closeAt':
            const part1_closeAt = optionArr.slice(0, 32);
            const part2_closeAt = optionArr.slice(32);
            optionArr = part2_closeAt.concat(part1_closeAt);
            // optionArr.push({
            //     key: optionArr.length,
            //     label: "12:00 AM (Midnight)",
            //   });
              return optionArr;

            break;    
    }
}


export const unsetDayFromAll = (val, index, timeArr, weekIndex=null)=>{
    timeArr.map((data, i)=>{
        if(i != index){
            if(weekIndex==null){
                timeArr[index].selectedWeekValArr.map((val, dayIndex)=>{
                    if(val){
                        data.selectedWeekValArr[dayIndex] = false;
                        data.isSelectAllchecked = false;
                    }
                })
            } else {
                data.selectedWeekValArr[weekIndex] = false;
                data.isSelectAllchecked = false;
            }
        }
        return data
    })
}

export const checkIsAllFilled = (timeSlotArr)=>{
    let isErr = false;
    let weekErrIndex = []
    let openAtErrIndex = []
    let closedAtErrIndex = []
    timeSlotArr.map((data, i)=>{
        let closeAtCheck = false
        if(data?.openAtVal != 'Open 24hrs' && data?.openAtVal != 'Closed'){
            if(!data?.closeAtVal?.length) closeAtCheck = true;
        }
        if(!data?.openAtVal?.length) {
            isErr ||= true;
            openAtErrIndex.push(i)
        }
        if(closeAtCheck) {
            isErr ||= true;
            closedAtErrIndex.push(i)
        }

        if(!data.selectedWeekValArr?.reduce((a,b) =>a+b,0)) {
            isErr ||= true;
            weekErrIndex.push(i)
        }
    })
    if(timeSlotArr.length==0) isErr = false;
    return {
        flag: !isErr,
        data: {
            weekErrIndex: weekErrIndex,
            openAtErrIndex: openAtErrIndex,
            closedAtErrIndex: closedAtErrIndex
        }
    };
}

export const convertTime12to24 = (time12h) => {
    
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}

export const compareTime = (T1, T2)=> {
    let flag =  true;

    let T1Arr = T1.split(':');
    let T2Arr = T2.split(':');

    if(Number(T1Arr[0])==Number(T2Arr[0])){
        if(Number(T1Arr[1])>Number(T2Arr[1])){
            flag = false;
        }
    } else if(Number(T1Arr[0])>Number(T2Arr[0])){
            flag = false;
    }

    return flag;
}

export const timeDiffrence = (time1, time2)=> {
    var hour1 = time1.split(':')[0];
    var hour2 = time2.split(':')[0];
    var min1 = time1.split(':')[1];
    var min2 = time2.split(':')[1];

    var diff_hour = hour2 - hour1;
    var diff_min = min2 - min1;
    if (diff_hour < 0) {
      diff_hour += 24;
    }
    if (diff_min < 0) {
      diff_min += 60;
      diff_hour--;
    } else if (diff_min >= 60) {
      diff_min -= 60;
      diff_hour++;
    }
    return [diff_hour, diff_min]
}
