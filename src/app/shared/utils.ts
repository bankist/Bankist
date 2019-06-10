
import {
  addDays,
  addMonths,
  isFirstDayOfMonth,
  isMonday,
  lastDayOfMonth,
  setDay,
  setDate,
  format,
} from 'date-fns';

import { Movement } from './../models/movement';

export function utilsGetUuid() {
  return '_' + Math.random().toString(36).substr(2, 15);
}

export function validateMovement(mov) {
  let movement = new Movement();
  movement.movementUuid = mov.movementUuid ? mov.movementUuid : utilsGetUuid();
  movement.concept = mov.concept ? mov.concept : null;
  movement.type = ['balance', 'income', 'outcome'].indexOf(mov.type)!=-1 ? mov.type : null;
  movement.repeat = ['daily', 'workdays', 'weekly', 'monthly', 'monthly_two', 'monthly_three', 'monthly_six', 'yearly'].indexOf(mov.repeat)!=-1 ? mov.repeat : null;
  movement.product = mov.product ? mov.product : null;
  movement.from = mov.from ? format(new Date(mov.from)) : format(new Date());
  movement.from = movement.from.split('.')[0];
  movement.to = mov.to ? format(new Date(mov.to)) : null;
  movement.to = mov.to ? movement.to.split('.')[0] : null;
  movement.amount = mov.amount ? mov.amount : null;
  movement.essential = mov.essential ? mov.essential : null;
  if(!movement.movementUuid 
    || !movement.from
    || !movement.concept) {
    return false;
  }
  return movement;
}

export function getFromDate(from) {
  let date = new Date();
  switch (from) {
    case 'monthFirstDay':
      if(!isFirstDayOfMonth(date)) date = addMonths(setDate(date, 1), 1);
      break;
    case 'monthEndDay':
      date = lastDayOfMonth(date);
      break;
    case 'nextMonday':
      let monday = setDay(new Date(), 1);
      if(date < monday) date = monday;
      else date = addDays(setDay(date, 1), 7);
      break;
    case 'nextFriday':
      let friday = setDay(new Date(), 5);
      if(date < friday) date = friday;
      else date = addDays(setDay(date, 5), 7);
      break;
    default:
      break;
  }
  return date;
}

export function getWeekStart(lang) {
  if(lang=='en') {
    return 0;
  }else{
    return 1;
  }
}

export function getMovsProducts(movs, productList, productLimit) {
  let groupedMovements = []
  if(movs && movs.length) {
    movs = movs.filter((m)=>m.type=='outcome');
    if(movs && movs.length) {
      let groupedMovs = groupBy(movs, ['product']);
      let outcome = movs.map(movement => movement.amount).reduce((prev, next) => prev + next);
      for(var mov in groupedMovs){
        let amount = 0;
        let movements = groupedMovs[mov];
        let product = movements[0].product;
        let type = movements[0].type;
        for(var m of movements){
          amount += m.amount;
        }
        amount = Math.abs(amount);
        let movementsLength = movements.length ? movements.length : '';
        groupedMovements.push({
          product: product,
          grouped: movementsLength,
          amount: (amount/outcome*100),
          type: type
        });
      }      
    }
  }
  let pendingProducts = productLimit - groupedMovements.length;
  for(let pending = 0; pending < pendingProducts; pending++) { 
    let pendingProduct = null;
    for(let product of productList) {
      if(!groupedMovements.filter((gm)=>gm.product==product).length) {
        groupedMovements.push({
          product: product,
          grouped: 0,
          amount: 0,
          type: 'outcome'
        })
        break;
      }
    }
  }
  groupedMovements.sort(function(a,b){return b.amount - a.amount});
  return groupedMovements;
}

export function groupBy(xs, keyArray){
  var key = keyArray[0];
  var subkey = keyArray.length > 1 ? keyArray[1] : null;
  return subkey ?
    xs.reduce(function(rv, x) {
      (rv[x[key][subkey]] = rv[x[key][subkey]] || []).push(x);
      return rv;
    }, {})
  : xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function formatCurrency(value, symbol, decimals = 2) {
  value = value.toFixed(decimals).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  if(symbol == '€') {
    value += ' €';
  }else{
    if(!value.indexOf('-')) value = '-' + symbol + '' + value.split('-').join('');
    else value = symbol + '' + value;
  }
  return value;
}
