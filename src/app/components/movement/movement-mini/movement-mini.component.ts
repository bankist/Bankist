import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'movement-mini',
  templateUrl: './movement-mini.component.html',
  styleUrls: ['./movement-mini.component.scss']
})
export class MovementMiniComponent implements OnInit {

  changed: any;
  @Input('check') check = false;
  @Input('movement') movement;
  @Input('currency') currency;
  @Output('movementClicked') movementClicked = new EventEmitter();
  @Output('movementChanged') movementChanged = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  checkMovement(event) {
    event.stopPropagation();
    this.movementChanged.next(this.movement);
  }
  editMovement() {
    this.movementClicked.next(this.movement);
  }

}
