import { Pipe } from '@angular/core';

@Pipe({name: 'datechart'})
export class DateChartPipe {
  transform(date?) {
    if(!date) return '';
    date = new Date(date);
    return this.twoDigits(date.getDate()) + '-' + this.twoDigits(date.getMonth()+1) + '-' + date.getFullYear();
  }
  twoDigits(str){
    return (str.toString().length == 1) ? '0' + str : str;
  }
}
