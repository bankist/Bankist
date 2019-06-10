import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';

import { DataService } from './../../providers/data/data';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.page.html',
  styleUrls: ['tutorial.page.scss']
})
export class TutorialPage {

  currency: any;

  constructor(
    public dataService: DataService,
    public platform: Platform,
    public navController: NavController,
    public router: Router
    ) {
      this.currency = this.dataService.getCurrencySymbol()
  }

  ionViewWillEnter() {
    setTimeout(() => this.initWallet(), 250)
  }

  initWallet(wallet?) {
    this.dataService.getWallet().then((wallet) => {
      if(!wallet) {
        this.navController.navigateRoot(['']);
      }
    })
  }

  createMovements(movements) {
    this.dataService.createMovements(movements);
    this.router.navigateByUrl('/tabs/tabs/wallet');
  }
}
