import { Component, OnInit, Input } from '@angular/core';

import {
  differenceInDays
} from 'date-fns';

@Component({
  selector: 'economy-averages',
  templateUrl: './economy-averages.component.html',
  styleUrls: ['./economy-averages.component.scss']
})
export class EconomyAveragesComponent implements OnInit {

  daily: any;
  weekly: any;
  monthly: any;
  @Input('currency') currency: any;
  @Input('interval') interval: any;
  @Input('movements') movements: any;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    this.setAverages();
  }
  setAverages() {
    this.daily = [];
    this.weekly = [];
    this.monthly = [];
    this.getAverages('income', this.movements);
    this.getAverages('outcome', this.movements);
    this.getAverages('saving', this.movements);
  }
  getAverages(type, movs){
    let total = movs && movs.length ? movs.map(movement => {
      let amount = movement.amount;
      switch (type) {
        case "income":
        case "outcome":
          if(movement.type != type) amount = 0;
          break;
        case "saving":
          if(movement.type=='outcome') amount = - amount;
          else if(movement.type=='income') amount = amount;
          else amount = 0;
          break;
      }
      return amount;
    }).reduce((prev, next) => prev + next) : null;
    if(this.interval) {    
      let days = Math.abs(differenceInDays(this.interval.initial, this.interval.zeit));
      this.daily.push({type: type, value: total ? (total / days) : 0});
      this.weekly.push({type: type, value: total ? (total / 4) : 0});
      this.monthly.push({type: type, value: total ? total : 0});
    }else{
      this.daily.push({type: type, value: 0});
      this.weekly.push({type: type, value: 0});
      this.monthly.push({type: type, value: 0});
    }
  }
}
