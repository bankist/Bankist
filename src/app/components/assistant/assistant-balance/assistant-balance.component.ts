import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, ModalController, NavParams } from '@ionic/angular';

import { format } from 'date-fns';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../../providers/data/data';

@Component({
  selector: 'assistant-balance',
  templateUrl: './assistant-balance.component.html',
  styleUrls: ['./assistant-balance.component.scss']
})
export class AssistantBalanceComponent implements OnInit {

  currency;
  movement;
  options;
  view: string = 'page';
  @Input('wallet') wallet;
  @Input('balance') balance;
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
    if(this.wallet)this.setBalance();
  }
  setBalance(){
    // this.dataService.setAssistant({balance: new Date()})
    this.movement = {
      amount: this.balance,
      concept: this.translate.instant('BALANCE'),
      from: format(new Date()),
      type: 'balance',
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
