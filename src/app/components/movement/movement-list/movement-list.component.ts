import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as Shared from './../../../shared';

@Component({
  selector: 'movement-list',
  templateUrl: 'movement-list.component.html',
  styleUrls: ['movement-list.component.scss']
})

export class MovementListComponent implements OnInit {

  filterValue: any = '';
  filtered: any;
  grouped: any;
  now: any;
  scrollItems: any;
  totalAmount: any;
  zeitMovements: any;
  @Input('interval') interval: any;
  @Input('wallet') wallet: any;
  @Input('currency') currency: string;
  @Input('showHistoric') showHistoric: any;
  @Input('extremes') extremes: {min: number, max: number};
  @Output('clickedMovement') clickedMovement = new EventEmitter();
  constructor() {}

  ngOnInit() {
  }
  ngOnChanges(map) {
    setTimeout(()=>this.setMovements(), 500);
  }
  setMovements() {
    if(!this.wallet) return false;
    let movs = this.wallet.zeitMovements;
    this.now = new Date();
    this.totalAmount = 0;
    this.zeitMovements = null;
    if(movs && movs.length){
      movs = this.filterByConcept(movs);
      movs = this.filterByInterval(movs);
      movs = this.groupByConcept(movs);
      this.setTotal(movs);
    }else movs = null;
    setTimeout(()=>this.zeitMovements = movs);
  }
  filterByConcept(movs) {
    return this.filterValue.length ? movs.filter((x)=> {
      let filter = this.filterValue ? this.filterValue.toLowerCase() : '';
      let concept = x.concept ? x.concept.toLowerCase() : '';
      let product = x.product ? x.product.toLowerCase() : '';
      filter = filter.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
      concept = concept.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
      product = product.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
      return (concept&&concept.indexOf(filter)!=-1)||(product && product.indexOf(filter)!=-1)
    }) : movs;
  }
  filterByInterval(movs) {

    if(this.interval && !this.interval.initial && !this.interval.zeit) return movs;
    let minDate = new Date();
    let maxDate;
    if(this.interval && this.interval.initial) {
      minDate = new Date(this.interval.initial);
    }
    if(this.extremes && this.extremes.min) {
      minDate = new Date(this.extremes.min);
    }
    minDate.setHours(0);
    minDate.setMinutes(0);
    minDate.setSeconds(0);
    movs = movs.filter((x)=>{
      return x.date>=minDate;
    })
    if(this.interval && this.interval.zeit) {
      maxDate = new Date(this.interval.zeit);
    }
    if(this.extremes && this.extremes.max) {
      maxDate = new Date(this.extremes.max);
    }
    return movs.filter((x)=>{
      return x.date<=maxDate;
    });
  }
  groupByConcept(movs) {

    if(this.interval.id.indexOf('yrs')!=-1) {
    }else if(movs.length > 200) {
      this.grouped = true;
    }else{
      this.grouped = false;
      return movs;
    }
    let groupedMovements = []
    let groupedMovs = Shared.groupBy(movs, ['movementUuid']);
    for(var mov in groupedMovs){
      let movements = groupedMovs[mov];
      let amount = 0;
      let concept = movements[0].concept;
      let movementUuid = movements[0].movementUuid;
      let type;
      let firstDate;
      let lastDate;
      for(var m of movements){
        type = m.type;
        if(type=='balance') amount = m.amount;
        else amount += type == 'outcome' ? -m.amount : m.amount;
        if(!firstDate) firstDate = m.date;
        else lastDate = m.date;
      }
      amount = Math.abs(amount);
      let movementsLength = movements.length ? movements.length : '';
      groupedMovements.push({
        movementUuid: movementUuid,
        concept: concept,
        grouped: movementsLength,
        type: type,
        amount: amount,
        from: firstDate,
        to: lastDate,
      });
    }
    return groupedMovements;
  }
  setTotal(movs) {    
    this.totalAmount = 0;
    movs.map((m) => {
      if(m.type!='balance')this.totalAmount += (m.type=='outcome' ? -m.amount: m.amount);
    });
  }
  searchMovements() {
    this.setMovements()
  }
  editMovement(movement) {
    this.clickedMovement.next(movement);
  }

}
