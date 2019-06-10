import { Pipe } from '@angular/core';

@Pipe({name: 'iconify'})
export class IconifyPipe {
    transform(text) {
      let icons = {
        balance: 'md-pulse',
        shopping: 'md-cart',
        restaurant: 'md-restaurant',
        cryptocurrency: 'logo-bitcoin',
        groceries: 'md-basket',
        coffee: 'md-cafe',
        transport: 'md-car',
        salary: 'md-cash',
        phone: 'md-call',
        cinema: 'md-film',
        concert: 'md-microphone',
        taxes: 'md-paper',
        rent: 'md-home',
        down: 'md-arrow-down',
        outcome: 'md-arrow-down',
        up: 'md-arrow-up',
        income: 'md-arrow-up',
        saving: 'md-add',
      }
      return icons[text] ? icons[text] : text;
    }
}
