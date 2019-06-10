import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'movement-card',
  templateUrl: './movement-card.component.html',
  styleUrls: ['./movement-card.component.scss']
})
export class MovementCardComponent implements OnInit {

  @Input('movement') movement;
  @Input('currency') currency;
  @Input('wallet') wallet;
  @Output('closedMovement') closedMovement = new EventEmitter();
  @Output('editedMovement') editedMovement = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
  }
  editMovement() {
    this.editedMovement.next();
  }
  closeMovementCard(event?){
    if(!event || event.target.nodeName=='ION-CARD-CONTENT') {
      this.closedMovement.next(this.movement);
    }
  }

}
