import { Pipe } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Pipe({name: 'datezeit'})
export class DateZeitPipe {
  currentLang: any;
  currentMonths: any;
  months: any = {
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    es: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  };
  constructor(public translate: TranslateService) {
  }
  transform(date?) {
    this.currentLang = this.translate.store.currentLang;
    this.currentMonths = this.months[this.currentLang];
    if(!date) return '';
    date = new Date(date);
    if(this.currentLang=='es')
      return date.getDate() + ' ' + this.currentMonths[date.getMonth()] + ' ' + date.getFullYear();
    else 
      return this.currentMonths[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
  }
}
