import { Component } from '@angular/core';
import { ActivatedRoute, CanActivate } from '@angular/router';
import { Platform, ModalController } from '@ionic/angular';

import { DataService } from './../../providers/data/data';

@Component({
  selector: 'page-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss']
})
export class AddPage {

  currency;
  isCordovaBankist;
  movement;
  wallet;
  view: string = 'modal';
  edit: boolean = false;
  constructor(
    public dataService: DataService,
    public modalController: ModalController,
    public platform: Platform,
    public route: ActivatedRoute
    ) {
    this.isCordovaBankist = this.platform.is('cordova') || location.hostname == 'localhost';
    this.currency = this.dataService.getCurrencySymbol()
    this.movement = this.route.snapshot.paramMap.get('movement');
    this.wallet = this.route.snapshot.paramMap.get('wallet');
    this.dataService.currencyChanged.subscribe( 
      currency => {
        this.currency = this.dataService.getCurrencySymbol()
      }
    );
  }
  editMovement() {
    this.edit = true;
  }
  createMovement(movement) {
    this.dataService.createMovement(movement);
    window.history.back();
  }
  updateMovement(movement) {
    this.dataService.updateMovement(movement);
    window.history.back();
  }
  deleteMovement(movement) {
    this.dataService.deleteMovement(movement);
    window.history.back();
  }
  closeMovement(movement) {
    window.history.back();
  }
  closeModal() {
    this.modalController.dismiss();
  }
}
