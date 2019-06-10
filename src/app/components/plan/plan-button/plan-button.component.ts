import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ModalController, ActionSheetController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { PlanFormComponent } from './../plan-form/plan-form.component';

@Component({
  selector: 'plan-button',
  templateUrl: 'plan-button.component.html',
  styleUrls: ['plan-button.component.scss']
})
export class PlanButtonComponent implements OnInit {

  @Input('wallet') wallet: any;
  @Input('currency') currency: any;
  @Input('balance') balance: any;
  @Input('showingPlans') showingPlans: boolean = false;
  @Output('showPlans') showPlans = new EventEmitter();
  @Output('changedPlan') changedPlan = new EventEmitter();
  constructor(
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public translate: TranslateService
    ) {}
  ngOnInit() {

  }
  ngOnChanges() {
  }
  showPlansButtons(show?) {
    this.showingPlans = show;
    this.showPlans.next(show);
  }
  async showPlansList() {
    let buttons = [];
    for(let plan of this.wallet.plans) {
      buttons.push({
        text: plan.name,
        handler: () => {
          this.updatePlan(plan);
        }
      })
    }
    let planList = await this.actionSheetController.create({
      header: this.translate.instant('PLANS_LIST'),
      buttons: buttons
    });
    await planList.present();
  }
  async createPlan() {
    const modal = await this.modalController.create({
      component: PlanFormComponent,
      componentProps: { wallet: this.wallet, currency: this.currency, balance: this.balance }
    });
    return await modal.present();
  }
  async updatePlan(plan) {
    const modal = await this.modalController.create({
      component: PlanFormComponent,
      componentProps: { wallet: this.wallet, currency: this.currency, balance: this.balance , plan: plan }
    });
    return await modal.present();
  }
}
