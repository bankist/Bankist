import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { format } from 'date-fns';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../../providers/data/data';

@Component({
  selector: 'assistant-recent',
  templateUrl: './assistant-recent.component.html',
  styleUrls: ['./assistant-recent.component.scss']
})
export class AssistantRecentComponent implements OnInit {
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
    this.options = {include: true, exclude: false, fields: ['amount', 'concept', 'dates']}
  }

  ngOnInit(){}
  ngOnChanges(){
    if(this.wallet)this.setRecent();
  }
  setRecent(){
    // this.dataService.setAssistant({recent: new Date()})
    this.movement = {
      concept: this.translate.instant('OUTCOME'),
      from: format(new Date()),
      amount: 0,
      type: 'outcome',
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
