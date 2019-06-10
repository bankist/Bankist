import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ModalController, NavController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../providers/data/data';

import { AddModal } from '../add/add.modal';

import * as Shared from './../../shared';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.page.html',
  styleUrls: ['wallet.page.scss']
})
export class WalletPage  {

  currency: any;
  currentLang: any;
  existingMovement: any = null;
  interval: any;
  intervals: any;
  movementList: boolean = false;
  newWallet: boolean = false;
  type: any = null;
  showingPlans: boolean = false;
  wallet: any;
  walletBalance: any = 0;
  walletBalanceToday: any;
  walletDate: any;
  zeitgeist: any = null;
  zeitMovements: any = null;

  constructor(
    public dataService: DataService,
    public modalController: ModalController,
    public navController: NavController,
    public platform: Platform,
    public translate: TranslateService,
    public router: Router,
  ) {
      this.intervals = Shared.INTERVALS;
      this.currency = this.dataService.getCurrencySymbol()
      this.currentLang = this.translate.currentLang;
      this.interval = Shared.getZeitInterval('6months');
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
      this.dataService.planChanged.subscribe( 
        plan => {
          this.showPlans(true)
        }
      );
      this.router.events.subscribe((data: any)=>{
        if(data && data.url && data.url == '/tabs/tabs/wallet') {
          this.dispatchResize();
        }
      });
      this.onResize(null);
  }

  ionViewWillEnter() {
    setTimeout(() => this.initWallet(), 250)
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

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.movementList = window.innerWidth >= 992 ? true : false;
  }

  zeitgeistWallet(wallet?){
    this.existingMovement = null;
    this.newWallet = false;
    if(this.showingPlans) this.setPlansInterval();
    if(wallet && wallet.movements && wallet.movements.length) {
      let zeitMovements = Shared.getZeitMovements(wallet.movements, this.interval, this.type);
      this.wallet = Object.assign({}, this.wallet, {zeitMovements: zeitMovements});
      this.dispatchResize();
    }
  }
  changeInterval(interval) {
    this.type = null;
    this.interval = interval;
    this.zeitgeistWallet(this.wallet);
  }
  changeIntervalExtremes(extremes) {
    // this.dataService.changeIntervalExtremes(extremes);
  }
  changeNext(){
    let interval;
    let intervalIndex = this.intervals.findIndex((i)=>i.id == this.interval.id);
    if(intervalIndex < this.intervals.length - 1) {
      interval = this.intervals[intervalIndex+1];
      interval = Shared.getZeitInterval(interval.id);
      this.changeInterval(interval);
    }
  }
  changePrev(){
    let interval;
    let intervalIndex = this.intervals.findIndex((i)=>i.id == this.interval.id);
    if(intervalIndex > 0) {
      interval = this.intervals[intervalIndex-1];
      interval = Shared.getZeitInterval(interval.id);
      this.changeInterval(interval);
    }
  }
  changeType(type) {
    if(type == this.type) type = null;
    this.type = type;
    this.zeitgeistWallet(this.wallet);
  }
  changeWalletDate(walletDate) {
    this.walletBalance = walletDate.value;
    this.walletDate = new Date(walletDate.date);
  }
  changeWalletBalance(balance) {
    this.walletBalance = balance;
    if(!this.walletBalanceToday) this.walletBalanceToday = balance;
  }
  showPlans(show) {
    if(!this.wallet.plans.length) show = false;
    this.showingPlans = show ? true : false;
    if(show) {
      this.setPlansInterval();
    }else{
      this.interval = Shared.getZeitInterval('month');
    }
    this.zeitgeistWallet(this.wallet);
  }
  setPlansInterval() {
    let latestDate = new Date();
    for(let plan of this.wallet.plans) {
      latestDate = latestDate < new Date(plan.to) ? new Date(plan.to) : latestDate;
    }
    let interval = Shared.getZeitInterval('begining');
    let {initialDate, zeitDate} = Shared.getZeitDates(interval, this.wallet.movements);
    this.interval = Object.assign({}, interval, {zeit: latestDate, initial: initialDate})
  }
  async changeBalance() {
    // let todaysBalance = this.wallet ? this.wallet.zeitMovements.filter((m)=>m.date) : null;
    // const modal = await this.modalController.create({component: BalanceModal, componentProps: {todaysBalance}});
    // return await modal.present();
    // const modal = await this.modalController.create({component: AddModal, componentProps: {}});
    // return await modal.present();
  }
  async editMovement(movement?) {
    this.existingMovement = movement;
    let wallet = this.wallet;
    const modal = await this.modalController.create({component: AddModal, componentProps: {movement, wallet}});
    await modal.present();
  }
  dispatchResize(){
    setTimeout(()=>{window.dispatchEvent(new Event('resize')), 250});
  }
}
