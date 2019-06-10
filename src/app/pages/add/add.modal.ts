import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, ModalController, NavParams } from '@ionic/angular';

import { DataService } from './../../providers/data/data';

@Component({
  selector: 'page-add-modal',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss']
})
export class AddModal {

  currency;
  isCordovaBankist;
  movement;
  wallet;
  view: string = 'modal';
  edit: boolean = false;
  constructor(
    public platform: Platform,
    public route: ActivatedRoute,
    public dataService: DataService,
    public navParams: NavParams,
    public modalController: ModalController
    ) {
    this.isCordovaBankist = this.platform.is('cordova') || location.hostname == 'localhost';
    this.currency = this.dataService.getCurrencySymbol()
    this.movement = this.route.snapshot.paramMap.get('movement');
    this.wallet = this.route.snapshot.paramMap.get('wallet');
    if(this.navParams && this.navParams.get('movement')) this.movement = this.navParams.get('movement');
    if(this.navParams && this.navParams.get('wallet')) this.wallet = this.navParams.get('wallet');
  }
  editMovement() {
    this.edit = true;
  }
  createMovement(movement) {
    this.dataService.createMovement(movement);
    this.closeModal();
  }
  updateMovement(movement) {
    this.dataService.updateMovement(movement);
    this.closeModal();
  }
  deleteMovement(movement) {
    this.dataService.deleteMovement(movement);
    this.closeModal();
  }
  closeMovement(movement) {
    this.closeModal();
  }
  closeModal() {
    this.modalController.dismiss();
  }
}
