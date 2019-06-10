import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../providers/data/data';

declare var navigator: any;

@Component({
  selector: 'page-identify',
  templateUrl: 'identify.page.html',
  styleUrls: ['identify.page.scss']
})
export class IdentifyPage {

  wallets: any;
  showIdentify: boolean = false;
  showWallets: boolean = true;
  walletName: string;
  constructor(
    public dataService: DataService,
    public platform: Platform,
    public translate: TranslateService,
    public router: Router
    ) {
  }

  ionViewWillEnter() {
    this.dataService.getWallet().then((wallet) => {
      if(wallet && wallet.movements && wallet.movements.length) {
        navigator['app'].exitApp();
      }else if(wallet) {
        this.router.navigateByUrl('/tutorial');
      }else{
        this.initIdentify();
      }
    })
  }

  initIdentify() {
    this.dataService.getBanking('wallets').then((wallets) => {
      if(wallets&&wallets.length) {
        this.wallets = wallets;
        this.showIdentify = true;
      }else{
        this.router.navigate(['/welcome']);
      }
    });
  }

  selectWallet(wallet) {
    this.router.navigateByUrl('/code/' + wallet, { skipLocationChange: true });
  }

  showWalletsList() {
    this.showWallets = true;
  }

  showWalletForm() {
    this.showWallets = false;
  }

  createWallet() {
    this.router.navigateByUrl('/code/' + this.walletName, { skipLocationChange: true });
  }

  changeLanguage(language) {
    this.dataService.changeLanguage(language);
    this.dataService.initCurrency(language);
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }
}
