import { Pipe } from '@angular/core';

@Pipe({name: 'customcurrency'})
export class CustomCurrencyPipe {
    transform(text) {
      if(text && text.indexOf('€')!=-1){
        text = text.split("€").join('') + ' €'
      }
      return text;
    }
}
