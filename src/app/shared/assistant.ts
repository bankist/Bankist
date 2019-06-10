import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

export function checkAssistant(wallet){
  let assistant: any = {};
  if(wallet && wallet.assistant) {

    assistant.balance = true;
    if(wallet.assistant.balance){
      if(isSameDay(new Date(wallet.assistant.balance), new Date())) assistant.balance = false;
    }

    assistant.essential = true;
    if(wallet.assistant.essential){
      if(isSameDay(new Date(wallet.assistant.essential), new Date())) assistant.essential = false;
    }

    assistant.latest = true;
    if(wallet.assistant.latest){
      if(isSameDay(new Date(wallet.assistant.latest), new Date())) assistant.latest = false;
    }
  }
  return assistant;
}