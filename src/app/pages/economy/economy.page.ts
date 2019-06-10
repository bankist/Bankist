import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ModalController, NavController, IonContent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { subMonths } from 'date-fns';

import { DataService } from './../../providers/data/data';

import { AddModal } from '../add/add.modal';
import { PlanFormComponent } from '../../components/plan/plan-form/plan-form.component';

import * as Shared from './../../shared';

@Component({
  selector: 'page-economy',
  templateUrl: 'economy.page.html',
  styleUrls: ['economy.page.scss']
})
export class EconomyPage  {

  currency: any;
  currentLang: any;
  existingMovement: any = null;
  interval: any;
  newWallet: boolean = false;
  savingRates: any = null;
  showHistoric: boolean = false;
  type: any = null;
  wallet: any;
  walletBalanceToday: any;
  zeitgeist: any = null;
  zeitMovements: any = null;
  @ViewChild(IonContent) content: IonContent;
  constructor(
    public dataService: DataService,
    public platform: Platform,
    public router: Router,
    public modalController: ModalController,
    public navController: NavController,
    public translate: TranslateService,
  ) {
    this.currency = this.dataService.getCurrencySymbol()
    this.currentLang = this.translate.currentLang;
    this.savingRates = Shared.SAVING_RATES;
    this.dataService.updatedStatus.subscribe( 
      wallet => {
        this.wallet = wallet;
        this.zeitgeistWallet(wallet);
      }
    );
    this.dataService.currencyChanged.subscribe( 
      currency => {
        this.currency = this.dataService.getCurrencySymbol()
      }
    );
    this.dataService.languageChanged.subscribe( 
      language => {
        this.currentLang = language
      }
    );
  }

  ionViewWillEnter() {
    setTimeout(() => this.initWallet(), 750)
  }

  initWallet(wallet?) {
    this.dataService.getWallet().then((wallet) => {
      if(wallet) {
        this.wallet = wallet;
        this.zeitgeistWallet(this.wallet);
      }else{
        this.navController.navigateRoot(['']);
      }
    })
  }
  zeitgeistWallet(wallet?){
    this.setMonthInterval(wallet);
    this.existingMovement = null;
    this.newWallet = false;
    if(wallet && wallet.movements && wallet.movements.length) {
      let zeitMovements = Shared.getZeitMovements(wallet.movements, this.interval, this.type);
      this.wallet = Object.assign({}, this.wallet, {zeitMovements: zeitMovements});
      this.dispatchResize();
    }
  }
  setMonthInterval(wallet?) {
    let initialDate = new Date();
    if(wallet && wallet.movements && wallet.movements.length) {
      let movs = wallet.movements;
      movs.sort(function(a,b){return new Date(a.from).getTime() - (new Date(b.from).getTime())});
      let monthAgo = subMonths(new Date(), 1);
      if(movs[0].from<= monthAgo) initialDate = monthAgo;
      else initialDate = movs[0].from;
    }
    this.interval = Shared.getZeitInterval('month', initialDate, true);
  }
  updateMovement(movement) {
    this.dataService.updateMovement(movement);
  }
  changeWalletBalance(balance) {
    if(!this.walletBalanceToday) this.walletBalanceToday = balance;
  }
  async editMovement(movement?) {
    this.existingMovement = movement;
    let wallet = this.wallet;
    const modal = await this.modalController.create({component: AddModal, componentProps: {movement, wallet}});
    await modal.present();
  }
  async editPlan(plan?) {
    const modal = await this.modalController.create({
      component: PlanFormComponent,
      componentProps: { wallet: this.wallet, currency: this.currency, balance: this.walletBalanceToday, plan: plan }
    });
    return await modal.present();
  }
  async createPlan() {
    const modal = await this.modalController.create({
      component: PlanFormComponent,
      componentProps: { wallet: this.wallet, currency: this.currency, balance: this.walletBalanceToday }
    });
    return await modal.present();
  }
  dispatchResize(){
    setTimeout(()=>{window.dispatchEvent(new Event('resize')), 250});
  }
}
