import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { getISOWeek } from 'date-fns';
import { DatePipe } from '@angular/common';

export class CustomDateFormatter extends CalendarDateFormatter {
  public weekViewTitle({ date, locale }: DateFormatterParams): string {
    const year: string = new DatePipe(locale).transform(date, 'y', locale);
    let textIn = 'in',
    textWeek = 'week';
    if(locale=='es') {
      textIn = 'de';
      textWeek = 'semana';
    }
    const weekNumber: number = getISOWeek(date);
    return `${textWeek} ${weekNumber} ${textIn} ${year}`;
  }
}