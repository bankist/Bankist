import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../providers/data/data';

import { AddModal } from '../add/add.modal';

import * as Shared from './../../shared';

@Component({
  selector: 'page-movements',
  templateUrl: 'movements.page.html',
  styleUrls: ['movements.page.scss']
})
export class MovementsPage {

  currency: any;
  currentLang: any;
  existingMovement: any = null;
  extremes: {min: number, max: number};
  interval: any;
  intervals: any;
  newWallet: boolean = false;
  showHistoric: boolean = false;
  type: any = null;
  wallet: any;
  walletBalance: any;
  walletDate: any = new Date();
  zeitgeist: any = null;
  zeitMovements: any = null;

  constructor(
    public dataService: DataService,
    public modalController: ModalController,
    public navController: NavController,
    public platform: Platform,
    public router: Router,
    public translate: TranslateService
  ) {
      this.intervals = Shared.INTERVALS;
      this.currency = this.dataService.getCurrencySymbol()
      this.currentLang = this.translate.currentLang;
      this.interval = Shared.getZeitInterval('month');
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
      // this.dataService.walletDateChanged.subscribe( 
      //   walletDate => {
      //     this.walletBalance = walletDate.value;
      //     this.walletDate = new Date(walletDate.date);
      //   }
      // );
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
    this.existingMovement = null;
    this.newWallet = false;
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
  changeNext(interval){
    this.changeInterval(interval);
  }
  changePrev(interval){
    this.changeInterval(interval);
  }
  changeType(type) {
    if(type == this.type) type = null;
    this.type = type;
    this.zeitgeistWallet(this.wallet);
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
