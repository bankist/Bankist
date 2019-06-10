import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, ModalController, NavParams } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../../providers/data/data';

@Component({
  selector: 'assistant-essential',
  templateUrl: './assistant-essential.component.html',
  styleUrls: ['./assistant-essential.component.scss']
})
export class AssistantEssentialComponent implements OnInit {
  currency;
  movement;
  options;
  @Input('wallet') wallet;
  constructor(
    public platform: Platform,
    public route: ActivatedRoute,
    public dataService: DataService,
    public translate: TranslateService,
    public navParams: NavParams,
    public modalController: ModalController
    ) {
    this.currency = this.dataService.getCurrencySymbol();
    this.options = {include: true, exclude: false, fields: ['amount']}
  }

  ngOnInit(){}
  ngOnChanges(){
    if(this.wallet)this.setEssential();
  }
  setEssential(){
    // this.dataService.setAssistant({essential: new Date()})
    this.movement = {
      concept: this.translate.instant('BALANCE'),
      amount: this.wallet.balance,
    };
  }
  createMovement(movement) {
    this.dataService.createMovement(movement);
    this.closeModal();
  }
  closeModal() {
    this.modalController.dismiss();
  }

}
