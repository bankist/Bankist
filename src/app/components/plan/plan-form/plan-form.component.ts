import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Platform, ModalController, ToastController, NavParams } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { format, endOfYear, addYears } from 'date-fns';

import { Plan } from './../../../models/plan';

import { DataService } from './../../../providers/data/data';

import * as Shared from './../../../shared';

@Component({
  selector: 'plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss']
})
export class PlanFormComponent implements OnInit {

  balance: any;
  currency: any;
  dateDefault: string = null;
  dateMax: any = format(endOfYear(addYears(new Date(), 10)), 'YYYY');
  dateMin: any = format(new Date());
  dateTo: any = format(addYears(new Date(), 1));
  plan: any;
  wallet: any;
  @Output('createdPlan') createdPlan = new EventEmitter();
  @Output('updatedPlan') updatedPlan = new EventEmitter();
  @Output('deletedPlan') deletedPlan = new EventEmitter();
  @Output('closedPlan') closedPlan = new EventEmitter();
  constructor(
    public platform: Platform, 
    public translate: TranslateService, 
    public navParams: NavParams, 
    public dataService: DataService, 
    public modalController: ModalController,
    public toastController: ToastController,
    ) {
    if(this.navParams && this.navParams.get('currency')) this.currency = this.navParams.get('currency');
    if(this.navParams && this.navParams.get('wallet')) this.wallet = this.navParams.get('wallet');
    if(this.navParams && this.navParams.get('plan')) this.plan = this.navParams.get('plan');
    if(this.navParams && this.navParams.get('balance')) this.balance = this.navParams.get('balance');
    this.dateDefault = format(new Date());
    this.initialize();
  }

  ngOnInit() {
  }

  initialize() {
    this.initPlanForm(this.plan);
  }

  initPlanForm(plan?) {
    this.plan = new Plan();
    this.plan.amount = 0.00;
    this.plan.initial = this.balance;
    this.plan.from = this.dateDefault;
    this.plan.to = this.dateTo;
    if(plan) {
      this.plan = Object.assign(this.plan, plan);
    }
  }

  save(form: NgForm) {
    if(this.plan.from) {
      if(this.plan.from.month || this.plan.from.year) {
        let initialDate = new Date();
        if(this.plan.from.year) initialDate.setFullYear(this.plan.from.year.value);
        if(this.plan.from.month) initialDate.setMonth(this.plan.from.month.value-1);
        if(this.plan.from.day) initialDate.setDate(this.plan.from.day.value);
        this.plan.from = format(initialDate);
      }else this.plan.from = format(this.plan.from);
    }
    if(this.plan.to) {
      if(this.plan.to.month || this.plan.to.year) {
        let initialDate = new Date();
        if(this.plan.to.year) initialDate.setFullYear(this.plan.to.year.value);
        if(this.plan.to.month) initialDate.setMonth(this.plan.to.month.value-1);
        if(this.plan.to.day) initialDate.setDate(this.plan.to.day.value);
        this.plan.to = format(initialDate);
      }else this.plan.to = format(this.plan.to);
    }
    if(!this.plan.from) this.plan.from = this.dateDefault;
    if(this.plan.to && this.plan.to < this.plan.from) this.plan.to = this.plan.from;

    if(this.plan.planUuid) {
      this.updatePlan()
    }else{
      this.createPlan()
    }
  }

  createPlan() {
    let plan = Object.assign({}, this.plan);
    this.dataService.createPlan(plan);
    this.closePlanForm();
  }

  updatePlan() {
    let plan = Object.assign({}, this.plan);
    this.dataService.updatePlan(plan);
    this.closePlanForm();
  }

  deletePlan() {
    let plan = Object.assign({}, this.plan);
    this.dataService.deletePlan(plan);
    this.closePlanForm();
  }

  changeInput(input){
    this.plan.amount = input;
  }

  async showToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  closePlanForm(event?){
    if(!event || event.target.nodeName=='ION-CARD-CONTENT') {
      this.modalController.dismiss();
    }
  }

}
