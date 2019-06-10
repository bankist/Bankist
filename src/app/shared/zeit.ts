import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getDate,
  getDay,
  getISODay,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  setYear,
  setMonth,
  setDate,
  setDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';

import * as Defs from './defs';

declare var window: any;

export function getZeitMovements(movements, interval, type = null){
  let zeitMovements = [];
  if(type&&type!='saving') movements = movements.filter((m)=>m.type==type);
  if(movements && movements.length){
    movements.sort(function(a,b){return new Date(a.from).getTime() - (new Date(b.from).getTime())});
    if(interval && interval.initial) 
    // let {initialDate, zeitDate} = getZeitDates(interval, movements);
    var {initialDate, zeitDate} = {initialDate: interval.initial, zeitDate: interval.zeit };
    let intervalDates = getZeitDates(interval, movements);
    if(!initialDate) initialDate = intervalDates.initialDate;
    if(!zeitDate) zeitDate = intervalDates.zeitDate;
    let currentDate = initialDate;
    let firstDate = new Date(movements[0].from);
    if(firstDate < initialDate) {
      currentDate = firstDate;
    }
    let nextDate = addDays(currentDate, 1);

    let zeitBalance = 0;

    let daily = [];
    let workdays = [];
    let weekly = {};
    let monthly = {};
    let monthly_two = {};
    let monthly_three = {};
    let monthly_six = {};
    let yearly = {};

    let indexMov = 0;
    let currentMov;
    let currentMovDate;
    let currentMovDay;
    let currentMovDateDay;
    let currentMovMonth;

    while( currentDate < zeitDate){
      let currentDay = getDay(currentDate);
      let currentDateDay = getDate(currentDate);
      let currentMonth = getMonth(currentDate);
      let nextDateDay = getDate(nextDate);
      let nextDateMonth = getMonth(nextDate);
      while(!indexMov || currentMov && (currentMovDate <= endOfDay(currentDate) || isSameDay(currentMovDate, currentDate))){
        if(indexMov < movements.length){
          currentMov = movements[indexMov];
          currentMovDate = new Date(currentMov.from);
          currentMovDay = getDay(currentMovDate);
          currentMovDateDay = getDate(currentMovDate);
          currentMovMonth = getMonth(currentMovDate);
          if(currentMovDate > endOfDay(currentDate)){
            break;
          }
          if(!currentMov.repeat) {

            /*
            add movement to zeitMovements array
            */
            let zeitMovement = Object.assign({}, currentMov, {date: currentMovDate.getTime()});
            zeitBalance = updateBalance(zeitBalance, zeitMovement);
            zeitMovement.balance = zeitBalance;
            if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
            // zeitMovements.push(zeitMovement);
            indexMov++;
          }else{

            /*
            add repeat movement to repeat arrays
            */
            switch (currentMov.repeat) {
              case 'daily':
                daily.push(currentMov);
                  indexMov++;
                break;
              case 'workdays':
                if(currentMovDay && currentMovDay <= 5) {
                  workdays.push(currentMov);
                  indexMov++;
                }
                break;
              case 'weekly':
                if( isSameDay(currentMovDate, currentDate)) {
                  if(!weekly[currentMovDay]) weekly[currentMovDay] = [];
                  weekly[currentMovDay].push(currentMov);
                  indexMov++;
                }
                break;
              case 'monthly':
                if(isSameDay(currentMovDate, currentDate)){
                  if(!monthly[currentMovDateDay]) monthly[currentMovDateDay] = [];
                  monthly[currentMovDateDay].push(currentMov);
                  indexMov++;
                }
                break;
              case 'monthly_two':
                if(isSameDay(currentMovDate, currentDate)){
                  if(!monthly_two[currentMovMonth]) monthly_two[currentMovMonth] = {};
                  if(!monthly_two[currentMovMonth][currentMovDateDay]) monthly_two[currentMovMonth][currentMovDateDay] = [];
                  monthly_two[currentMovMonth][currentMovDateDay].push(currentMov);
                  indexMov++;
                }
                break;
              case 'monthly_three':
                if(isSameDay(currentMovDate, currentDate)){
                  if(!monthly_three[currentMovMonth]) monthly_three[currentMovMonth] = {};
                  if(!monthly_three[currentMovMonth][currentMovDateDay]) monthly_three[currentMovMonth][currentMovDateDay] = [];
                  monthly_three[currentMovMonth][currentMovDateDay].push(currentMov);
                  indexMov++;
                }
                break;
              case 'monthly_six':
                if(isSameDay(currentMovDate, currentDate)){
                  if(!monthly_six[currentMovMonth]) monthly_six[currentMovMonth] = {};
                  if(!monthly_six[currentMovMonth][currentMovDateDay]) monthly_six[currentMovMonth][currentMovDateDay] = [];
                  monthly_six[currentMovMonth][currentMovDateDay].push(currentMov);
                  indexMov++;
                }
                break;
              case 'yearly':
                if(isSameDay(currentMovDate, currentDate)){
                  if(!yearly[currentMovMonth]) yearly[currentMovMonth] = {};
                  if(!yearly[currentMovMonth][currentMovDateDay]) yearly[currentMovMonth][currentMovDateDay] = [];
                  yearly[currentMovMonth][currentMovDateDay].push(currentMov);
                  indexMov++;
                }
                break;
            }
          }
        } else currentMov = null;

      }
      /*
      check ilies to add
      */
      if(daily && daily.length) {
        for(let d of daily) {
          let zeitMovement = zeitFromIlie(d, currentDate);
          if(zeitMovement) {
            zeitBalance = updateBalance(zeitBalance, zeitMovement);
            zeitMovement.balance = zeitBalance;
            if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
          }
        }
      }
      if(workdays && workdays.length && currentDay && currentDay <= 5) {
        for(let wd of workdays) {
          let zeitMovement = zeitFromIlie(wd, currentDate);
          if(zeitMovement) {
            zeitBalance = updateBalance(zeitBalance, zeitMovement);
            zeitMovement.balance = zeitBalance;
            if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
          }
        }
      }
      if(weekly && Object.keys(weekly).length && weekly[currentDay] && weekly[currentDay].length){
        for(let w of weekly[currentDay]) {
          let zeitMovement = zeitFromIlie(w, currentDate);
          if(zeitMovement) {
            zeitBalance = updateBalance(zeitBalance, zeitMovement);
            zeitMovement.balance = zeitBalance;
            if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
          }
        }
      }
      if(monthly && Object.keys(monthly).length){
        if(monthly[currentDateDay] && monthly[currentDateDay].length) {
          for(let m of monthly[currentDateDay]) {
            let zeitMovement = zeitFromIlie( m, currentDate);
            if(zeitMovement) {
              zeitBalance = updateBalance(zeitBalance, zeitMovement);
              zeitMovement.balance = zeitBalance;
              if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
            }
          }
        }
        let monthlyRest = getMonthlyRest(monthly, currentDateDay);
        if(nextDateMonth > currentMonth && monthlyRest) {
          for(let monthlyRestDay of monthlyRest) {
            if(!monthly[monthlyRestDay]) continue;
            for(let m of monthly[monthlyRestDay]) {
              let zeitMovement = zeitFromIlie(m,  currentDate);
              if(zeitMovement) {
                zeitBalance = updateBalance(zeitBalance, zeitMovement);
                zeitMovement.balance = zeitBalance;
                if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
              }
            }
          }
        }
      }
      if(monthly_two && Object.keys(monthly_two).length){
        let candidateMonths = [];
        let monthOffset = currentMonth % 2;
        for(let i = 0; i < 12; i++) if(i % 2 == monthOffset) candidateMonths.push(i);
        for(let month of candidateMonths) {
          if(monthly_two[month] && monthly_two[month][currentDateDay] && monthly_two[month][currentDateDay].length) {
            for(let m of monthly_two[month][currentDateDay]) {
              let zeitMovement = zeitFromIlie( m, currentDate);
              if(zeitMovement) {
                zeitBalance = updateBalance(zeitBalance, zeitMovement);
                zeitMovement.balance = zeitBalance;
                if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
              }
            }
          }
        }
        let monthlyRest = getMonthlyRest(monthly_two, currentDateDay);
        if(nextDateMonth > currentMonth && monthlyRest) {
          for(let month of candidateMonths) {
            for(let monthlyRestDay of monthlyRest) {
              if(!monthly_two[month] || !monthly_two[month][monthlyRestDay]) continue;
              for(let m of monthly_two[month][monthlyRestDay]) {
                let zeitMovement = zeitFromIlie(m,  currentDate);
                if(zeitMovement) {
                  zeitBalance = updateBalance(zeitBalance, zeitMovement);
                  zeitMovement.balance = zeitBalance;
                  if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
                }
              }
            }
          }
        }
      }
      if(monthly_three && Object.keys(monthly_three).length){
        let candidateMonths = [];
        let monthOffset = currentMonth % 3;
        for(let i = 0; i < 12; i++) if(i % 3 == monthOffset) candidateMonths.push(i);
        for(let month of candidateMonths) {
          if(monthly_three[month] && monthly_three[month][currentDateDay] && monthly_three[month][currentDateDay].length) {
            for(let m of monthly_three[month][currentDateDay]) {
              let zeitMovement = zeitFromIlie( m, currentDate);
              if(zeitMovement) {
                zeitBalance = updateBalance(zeitBalance, zeitMovement);
                zeitMovement.balance = zeitBalance;
                if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
              }
            }
          }
        }
        let monthlyRest = getMonthlyRest(monthly_three, currentDateDay);
        if(nextDateMonth > currentMonth && monthlyRest) {
          for(let month of candidateMonths) {
            for(let monthlyRestDay of monthlyRest) {
              if(!monthly_three[month] || !monthly_three[month][monthlyRestDay]) continue;
              for(let m of monthly_three[month][monthlyRestDay]) {
                let zeitMovement = zeitFromIlie(m,  currentDate);
                if(zeitMovement) {
                  zeitBalance = updateBalance(zeitBalance, zeitMovement);
                  zeitMovement.balance = zeitBalance;
                  if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
                }
              }
            }
          }
        }
      }
      if(monthly_six && Object.keys(monthly_six).length){
        let candidateMonths = [];
        let monthOffset = currentMonth % 6;
        for(let i = 0; i < 12; i++) if(i % 6 == monthOffset) candidateMonths.push(i);
        for(let month of candidateMonths) {
          if(monthly_six[month] && monthly_six[month][currentDateDay] && monthly_six[month][currentDateDay].length) {
            for(let m of monthly_six[month][currentDateDay]) {
              let zeitMovement = zeitFromIlie( m, currentDate);
              if(zeitMovement) {
                zeitBalance = updateBalance(zeitBalance, zeitMovement);
                zeitMovement.balance = zeitBalance;
                if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
              }
            }
          }
        }
        let monthlyRest = getMonthlyRest(monthly_six, currentDateDay);
        if(nextDateMonth > currentMonth && monthlyRest) {
          for(let month of candidateMonths) {
            for(let monthlyRestDay of monthlyRest) {
              if(!monthly_six[month] || !monthly_six[month][monthlyRestDay]) continue;
              for(let m of monthly_six[month][monthlyRestDay]) {
                let zeitMovement = zeitFromIlie(m,  currentDate);
                if(zeitMovement) {
                  zeitBalance = updateBalance(zeitBalance, zeitMovement);
                  zeitMovement.balance = zeitBalance;
                  if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
                }
              }
            }
          }
        }
      }
      if(yearly && Object.keys(yearly).length && yearly[currentMonth] && Object.keys(yearly[currentMonth]).length && yearly[currentMonth][currentDateDay]){
        for(let y of yearly[currentMonth][currentDateDay]) {
          let zeitMovement = zeitFromIlie(y, currentDate);
          if(zeitMovement) {
            zeitBalance = updateBalance(zeitBalance, zeitMovement);
            zeitMovement.balance = zeitBalance;
            if(new Date(zeitMovement.date)>=initialDate) zeitMovements.push(zeitMovement);
          }
        }
      }

      /*
      check ilies to remove
      */
      daily = daily.filter((d)=>!d.to||new Date(d.to)>currentDate)
      workdays = workdays.filter((d)=>!d.to||new Date(d.to)>currentDate)
      for(let w in weekly){
        weekly[w] = weekly[w].filter((d)=>!d.to||new Date(d.to)>currentDate)
      }
      for(let m in monthly_two){
        for(let d in monthly_two[m]){
          monthly_two[m][d] = monthly_two[m][d].filter((d)=>!d.to||new Date(d.to)>currentDate)
        }
      }
      for(let m in monthly_three){
        for(let d in monthly_three[m]){
          monthly_three[m][d] = monthly_three[m][d].filter((d)=>!d.to||new Date(d.to)>currentDate)
        }
      }
      for(let m in monthly_six){
        for(let d in monthly_six[m]){
          monthly_six[m][d] = monthly_six[m][d].filter((d)=>!d.to||new Date(d.to)>currentDate)
        }
      }
      for(let m in yearly){
        for(let d in yearly[m]){
          yearly[m][d] = yearly[m][d].filter((d)=>!d.to||new Date(d.to)>currentDate)
        }
      }
      currentDate = addDays(currentDate, 1);
      nextDate = addDays(nextDate, 1);
    }
    return zeitMovements;
  }
}

export function zeitFromIlie(ilie, date) {
  let zeitMovement = Object.assign({}, ilie, {date: date.getTime()});
  let dateFrom = new Date(ilie.from)
  let dateTo = ilie.to ? new Date(ilie.to) : null;
  if(!isSameDay(dateFrom, date)
    && 
    (dateTo && dateTo<=startOfDay(date)) || dateFrom>endOfDay(date)) return false;
  if(zeitMovement.repeat) {
    let zeitEvent = zeitMovement.events && zeitMovement.events.length ? zeitMovement.events.filter((e)=>isSameDay(e.date, date)) : null;
    if(zeitEvent && zeitEvent.length) {
      zeitMovement = zeitEvent[0];
      if(zeitMovement.deleted) return false;
    }
    delete zeitMovement.events;
  }
  return zeitMovement;
}

export function setToOriginalMovement(wallet, movement) {
  let eventExists = false;
  let originalMovement = wallet && wallet.movements.length ? wallet.movements.filter((m)=>m.movementUuid == movement.movementUuid) : null;
  if(originalMovement && originalMovement.length) {
    originalMovement = originalMovement[0];
    originalMovement.events = originalMovement.events ? originalMovement.events.map((ev:any)=>{
      if(isSameDay(ev.date, movement.date)) {
        ev = movement;
        eventExists = true;
      }
      return ev;
    }) : [];
    if(!eventExists) originalMovement.events.push(movement);
    movement = originalMovement;
  }
  return movement;
}

export function getZeitInterval(intervalId, intervalInitialDate?, startFromInitial?){
  let intervals = Defs.INTERVALS;
  let interval = intervals.find((i)=>i.id==intervalId);
  if(!interval) interval = {id: intervalId};
  if(intervalInitialDate) interval['initial'] = new Date(intervalInitialDate);
  if(startFromInitial) interval['startFromInitial'] = true;
  let {zeitDate, initialDate} = getZeitDates(interval)
  return Object.assign({}, interval, {initial: initialDate, zeit: zeitDate});
}

export function updateBalance(balance, movement) {
  switch (movement.type) {
    case "income":
      balance = balance + movement.amount;
      break;
    case "outcome":
      balance = balance - movement.amount;
      break;
    case "balance":
      balance = movement.amount;
      break;
    default:
      break;
  }
  return balance;
}

export function getZeitDates(interval, movements?){

  let initialDate = interval.initial ? new Date(interval.initial) : new Date();
  let zeitDate = interval.zeit ? new Date(interval.zeit) : initialDate;
  switch (interval.id) {
    case 'begining':
      if(movements && movements.length) {
        initialDate = new Date(movements[0].from);
      }else{
        initialDate = null;
        zeitDate = null;
      }
      break;
    case 'day':
      if(interval.startFromInitial) { 
        zeitDate = addDays(initialDate, 1);
      }else{
        initialDate = startOfDay(initialDate);
        zeitDate = endOfDay(zeitDate);
      }
      break;
    case 'week':
      if(interval.startFromInitial) { 
        zeitDate = addDays(initialDate, 1)
      }else{
        initialDate = startOfWeek(initialDate, {weekStartsOn: window.__weekStartsOn__});
        zeitDate = endOfWeek(zeitDate, {weekStartsOn: window.__weekStartsOn__});
      }
      break;
    case 'month':
      if(interval.startFromInitial) { 
        zeitDate = addMonths(initialDate, 1);
      }else{
        initialDate = startOfMonth(initialDate);
        zeitDate = endOfMonth(zeitDate);
      }
      break;
    case '2months':
      if(interval.startFromInitial) { 
        zeitDate = addMonths(initialDate, 2);
      }else{
        initialDate = startOfMonth(initialDate);
        zeitDate = endOfMonth(addMonths(zeitDate, 2));
      }
      break;
    case '6months':
      if(interval.startFromInitial) { 
        zeitDate = addMonths(initialDate, 6);
      }else{
        initialDate = startOfMonth(initialDate);
        zeitDate = endOfMonth(addMonths(zeitDate, 6));
      } 
      break;
    case '1yr':
      if(interval.startFromInitial) { 
        zeitDate = addYears(initialDate, 1);
      }else{
        initialDate = startOfYear(initialDate);
        zeitDate = endOfYear(zeitDate);
      }
      break;
    case '2yrs':
      if(interval.startFromInitial) { 
        zeitDate = addYears(initialDate, 2);
      }else{
        initialDate = startOfYear(initialDate);
        zeitDate = endOfYear(addYears(zeitDate, 2));
      }
      break;
    case '5yrs':
      if(interval.startFromInitial) { 
        zeitDate = addYears(initialDate, 5);
      }else{
        initialDate = startOfYear(initialDate);
        zeitDate = endOfYear(addYears(zeitDate, 5));
      }
      break;
    case '10yrs':
      if(interval.startFromInitial) { 
        zeitDate = addYears(initialDate, 10);
      }else{
        initialDate = startOfYear(initialDate);
        zeitDate = endOfYear(addYears(zeitDate, 10));
      }
      break;
    case '20yrs':
      if(interval.startFromInitial) { 
        zeitDate = addYears(initialDate, 20);
      }else{
        initialDate = startOfYear(initialDate);
        zeitDate = endOfYear(addYears(zeitDate, 20));
      }
      break;
    case '25yrs':
      if(interval.startFromInitial) { 
        zeitDate = addYears(initialDate, 25);
      }else{
        initialDate = startOfYear(initialDate);
        zeitDate = endOfYear(addYears(zeitDate, 25));
      }
      break;
    case '50yrs':
      if(interval.startFromInitial) { 
        zeitDate = addYears(initialDate, 50);
      }else{
        initialDate = startOfYear(initialDate);
        zeitDate = endOfYear(addYears(zeitDate, 50));
      }
      break;
  }
  return {zeitDate, initialDate};
}

export function getNextDate(movement) {
  let now = new Date(),
    nowDay = getDay(now),
    startDate = new Date(movement.from),
    maxDate,
    nextDate;
  startDate = setYear(startDate, getYear(now));
  startDate = setMonth(startDate, getMonth(now));
  startDate = setDate(startDate, getDate(now));
  switch (movement.repeat) {
    case 'daily':
      maxDate = addDays(startDate, 1);
      break;
    case 'workdays':
      if(nowDay==6) maxDate = addDays(startDate, 2);
      else if(nowDay==5) maxDate = addDays(startDate, 3);
      else maxDate = addDays(startDate, 1);
      break;
    case 'weekly':
      maxDate = addDays(startDate, 7);
      break;
    case 'monthly':
      maxDate = addMonths(startDate, 1);
      break;
    case 'monthly_two':
      maxDate = addMonths(startDate, 2);
      break;
    case 'monthly_three':
      maxDate = addMonths(startDate, 3);
      break;
    case 'monthly_six':
      maxDate = addMonths(startDate, 6);
      break;
    case 'yearly':
      maxDate = addYears(startDate, 1);
      break;
  }
  nextDate = endOfDay(maxDate);
  let zeitMovements = getZeitMovements([movement], {
    id: '1yr',
    initial: movement.from,
    zeit: maxDate,
  })
  if(zeitMovements && zeitMovements.length) {
    nextDate = zeitMovements[zeitMovements.length - 1].date;
  }
  return format(nextDate);
}
export function getMonthlyRest(monthly, day) {
  return Array.from(new Array(31 - day), (x,i) => i + day + 1);
}
