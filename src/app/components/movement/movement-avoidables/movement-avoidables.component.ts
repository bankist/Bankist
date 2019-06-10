import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as Shared from './../../../shared';

import { DataService } from './../../../providers/data/data';

@Component({
  selector: 'movement-avoidables',
  templateUrl: './movement-avoidables.component.html',
  styleUrls: ['./movement-avoidables.component.scss']
})
export class MovementAvoidablesComponent implements OnInit {

  avoidables: any;
  @Input('currency') currency: any;
  @Input('movements') movements: any;
  @Input('wallet') wallet: any;
  @Output('clickedMovement') clickedMovement = new EventEmitter();
  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

  ngOnChanges(map) {
    this.setAvoidables();
  }
  setAvoidables() {
    let avoidables = this.getAvoidables(this.movements);
    this.avoidables = avoidables;
  }
  getAvoidables(movs) {
    if(!movs) return null;
    movs = movs.filter((m)=>!m.essential).sort(function(a,b){return b.amount - a.amount})
    return movs.slice(0, 6);
  }
  editAvoidable(movement) {
    if(movement.repeat && movement.repeat.length) {
      movement.essential = true;
      let originalMovement = Shared.setToOriginalMovement(this.wallet, movement);
      movement = originalMovement;
    } else {
      movement.essential = true;
    }
    this.avoidables = this.avoidables.map((e)=>{
      if(e.date == movement.date && e.movementUuid == movement.movementUuid) e.essential = true;
      return e;
    })
    setTimeout(()=>{
      this.dataService.updateMovement(movement);
    }, 1000)
  }
  editMovement(movement) {
    this.clickedMovement.next(movement);
  }

}
