import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as Shared from './../../../shared';

import { DataService } from './../../../providers/data/data';

@Component({
  selector: 'movement-essentials',
  templateUrl: './movement-essentials.component.html',
  styleUrls: ['./movement-essentials.component.scss']
})
export class MovementEssentialsComponent implements OnInit {

  essentials: any;
  @Input('currency') currency: any;
  @Input('movements') movements: any;
  @Input('wallet') wallet: any;
  @Input('max') max: any = 6;
  @Output('clickedMovement') clickedMovement = new EventEmitter();
  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

  ngOnChanges(map) {
    this.setEssentials();
  }
  setEssentials() {
    let essentials = this.getEssentials(this.movements);
    this.essentials = essentials;
  }
  getEssentials(movs) {
    if(!movs) return null;
    movs = movs.filter((m)=>m.essential).sort(function(a,b){return b.amount - a.amount})
    return movs.slice(0, this.max);
  }
  editEssential(movement) {
    if(movement.repeat && movement.repeat.length) {
      movement.essential = false;
      let originalMovement = Shared.setToOriginalMovement(this.wallet, movement);
      movement = originalMovement;
    } else {
      movement.essential = false;
    }
    this.essentials = this.essentials.map((e)=>{
      if(e.date == movement.date && e.movementUuid == movement.movementUuid) e.essential = false;
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
