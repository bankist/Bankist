import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import * as Shared from './../../../shared';

@Component({
  selector: 'movement-input',
  templateUrl: 'movement-input.component.html',
  styleUrls: ['movement-input.component.scss']
})
export class MovementInputComponent implements OnInit {

  amount: any;
  cOptions: any;
  currencies: any;
  currencyOptions: any;
  lastInput: any;
  @Input('wallet') wallet: any;
  @Input('movement') movement: any;
  @Input('currency') currency: any;
  @Output('changedInput') changedInput = new EventEmitter();
  constructor(public translate: TranslateService,
    private cdr: ChangeDetectorRef) {
    this.currencies = Shared.CURRENCIES;
    this.currencyOptions = Shared.CURRENCY_OPTIONS;
  }

  ngOnInit() {
    this.initialize();
  }

  ngOnChanges(map) {
    if(map && (map.movement || map.currency)) this.initialize();
  }

  initialize() {
    this.cOptions = this.getCurrencyOptions();
    this.initMovementInput();
  }

  getCurrencyOptions() {
    let currency = this.currency;
    let cOptions = this.currencyOptions;
    let currentCurrency: any = this.currencies.filter((x)=>x.symbol==currency);
    if(currentCurrency&&currentCurrency.length){
      currentCurrency = currentCurrency[0];
      if(currentCurrency.id == 'EUR'){
        cOptions = Object.assign({}, cOptions, {
          prefix: '',
          suffix: ' €',
          precision: 2
        })
      }else{
        cOptions = Object.assign({}, cOptions, {
          prefix: currentCurrency.symbol + ' ',
          suffix: '',
          precision: 2
        })
      }
    }else{
      cOptions = Object.assign({}, cOptions, {
        prefix: '$ ',
        suffix: '',
        precision: 2
      })
    }
    return cOptions;
  }
  // checkValue(event: any) {
  //   let value = event.target.value;
  //   const currentCode = event.which || event.code;
  //   let currentKey = event.key;
  //   if (!currentKey||currentKey=='Unidentified') {
  //     currentKey = String.fromCharCode(currentCode);
  //   }
  //   let zeroValue = this.cOptions.prefix!=''?this.cOptions.prefix+'0,00':'0,00'+this.cOptions.suffix;
  //   if (!value || value == zeroValue && !/\b[1-9]\b/.test(currentKey)) {
  //     event.stopPropagation();
  //     event.preventDefault();
  //     if(value==='') value = '';
  //   }
  //   this.lastInput = value;
  //   let movementInputId = 'movement-input-' + (this.movement&&this.movement.movementUuid ? this.movement.movementUuid : '');
  //   let movementInput: any = document.getElementById(movementInputId);
  //   movementInput.blur();
  //   movementInput.value = value;
  //   movementInput.focus();
  //   this.cdr.detectChanges();
  //   this.changedInput.next(this.amount);
  // }
  checkNumber(event: any) {
    if( event.key.length === 1 && !event.metaKey && (isNaN(event.key) && event.key !== ".") || (event.key === "." && event.target.value.indexOf(".") !== -1)) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  emitValue(event: any) {
    // this.checkValue(event);
    this.changedInput.next(parseFloat(this.amount));
  }
  initMovementInput() {
    // this.amount = this.movement && this.movement.amount ? this.movement.amount : 0.00;
    this.amount = this.movement && this.movement.amount ? this.movement.amount : '';
  }

}
