import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, ModalController, NavController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { ExporterComponent } from './../../components/ui/exporter/exporter.component';
import { ImporterComponent } from './../../components/ui/importer/importer.component';

import { DataService } from './../../providers/data/data';

import * as Shared from './../../shared';

declare var window: any;

@Component({
  selector: 'settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  languages;
  currentLang;
  currentCurrency;
  originalLang;
  originalCurrency;
  currencies: any;
  wallet:any;
  constructor(
    public dataService: DataService,
    public alertController: AlertController,
    public modalController: ModalController,
    public navController: NavController,
    public translate: TranslateService,
    public router: Router,
    ) {
    this.languages = Shared.LANGUAGES;
    this.currencies = Shared.CURRENCIES;
    this.dataService.getWallet().then((wallet) => {
      if(wallet) {
        this.wallet = wallet;
      }else{
        this.navController.navigateRoot(['']);
      }
    })
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang;
    this.originalLang = this.currentLang;
    this.dataService.getBanking('currency').then((currency) => {
      this.currentCurrency = currency;
      this.originalCurrency = this.currentCurrency;
    });
  }

  changeCurrency(currency?) {
    if(!currency) currency = this.currentCurrency;
    if(!currency) {
      let currentLang = this.currentLang || this.translate.currentLang;
      let currency = 'USD';
      if (currentLang && ['es', 'fr', 'de', 'it'].indexOf(currentLang)!= -1) {
        currency = 'EUR';
      }
    }
    this.dataService.setBanking('currency', currency);
    this.dataService.changeCurrency(currency);
  }

  changeLanguage(language?) {
    if(!language) language = this.currentLang;
    this.dataService.changeLanguage(language);
    this.translate.setDefaultLang(language);
    setTimeout(()=>{
      this.translate.use(language);
    })

  }

  initWeekStart(language) {
    if(language=='en') {
      window.__weekStartsOn__ = 0;
    }else{
      window.__weekStartsOn__ = 1;
    }
  }

  async importMovements() {
    const modal = await this.modalController.create({
      component: ImporterComponent,
      componentProps: { wallet: this.wallet }
    });
    return await modal.present();
  }

  async exportMovements() {
    const modal = await this.modalController.create({
      component: ExporterComponent,
      componentProps: { wallet: this.wallet }
    });
    return await modal.present();
  }

  async deleteWallet() {
    const alert = await this.alertController.create({
      header: this.translate.instant('SETTINGS_ALERT_DELETE_HEADER'),
      message: this.translate.instant('SETTINGS_ALERT_DELETE_TEXT'),
      buttons: [
        {
          text: this.translate.instant('SETTINGS_ALERT_DELETE_CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.translate.instant('SETTINGS_ALERT_DELETE_CONFIRM'),
          cssClass: 'primary',
          handler: () => {
            window.history.pushState('', '', '/');
            this.dataService.deleteWallet();
          }
        }
      ]
    });

    await alert.present();
  }

  close() {
    // let backpath = decodeURIComponent(window.location.search.substring(1).split('back=')[1].split('&')[0]);
    this.navController.navigateRoot(['/tabs/tabs/wallet']);
  }

  save() {
    // this.router.navigate(['/settings'], { queryParams: { back: pathname });
    // let backpath = decodeURIComponent(window.location.search.substring(1).split('back=')[1].split('&')[0]);
    this.navController.navigateRoot(['/tabs/tabs/wallet']);
  }
}