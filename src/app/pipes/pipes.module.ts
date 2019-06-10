import { NgModule } from '@angular/core';

import { IconifyPipe } from './iconify.pipe';
import { DateZeitPipe } from './date.zeit.pipe';
import { DateChartPipe } from './date.chart.pipe';
import { CustomCurrencyPipe } from './customcurrency.pipe';
import { CalendarBadgePipe } from './calendarbadge.pipe';


@NgModule({
  imports: [
  ],
  declarations: [
    IconifyPipe,
    DateZeitPipe,
    DateChartPipe,
    CustomCurrencyPipe,
    CalendarBadgePipe
  ],
  exports: [
    IconifyPipe,
    DateZeitPipe,
    DateChartPipe,
    CustomCurrencyPipe,
    CalendarBadgePipe
  ],
  providers: [
  ],
})
export class PipesModule { }
