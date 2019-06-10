import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as Shared from './../../../shared';

import { DataService } from './../../../providers/data/data';

@Component({
  selector: 'movement-relevants',
  templateUrl: './movement-relevants.component.html',
  styleUrls: ['./movement-relevants.component.scss']
})
export class MovementRelevantsComponent implements OnInit {

  relevants: any;
  @Input('currency') currency: any;
  @Input('movements') movements: any;
  @Input('wallet') wallet: any;
  @Output('clickedMovement') clickedMovement = new EventEmitter();
  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

  ngOnChanges(map) {
    this.setRelevants();
  }
  setRelevants() {
    let relevants = this.getRelevants(this.movements);
    this.relevants = relevants;
  }
  getRelevants(movs) {
    if(!movs) return null;
    movs = movs.filter((m)=>m.type=='outcome').sort(function(a,b){return b.amount - a.amount})
    return movs.slice(0, 3);
  }
  editMovement(movement) {
    this.clickedMovement.next(movement);
  }

}
