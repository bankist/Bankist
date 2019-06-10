import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'economy-plans',
  templateUrl: './economy-plans.component.html',
  styleUrls: ['./economy-plans.component.scss']
})
export class EconomyPlansComponent implements OnInit {

  @Input('currency') currency: any;
  @Input('plans') plans: any;
  @Output('clickedPlan') clickedPlan = new EventEmitter();
  @Output('createdPlan') createdPlan = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  editPlan(plan) {
    this.clickedPlan.next(plan);
  }
  createPlan() {
    this.createdPlan.next();
  }
}
