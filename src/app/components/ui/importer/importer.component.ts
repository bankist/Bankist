import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, ModalController, ToastController, NavParams } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { format } from 'date-fns';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../../providers/data/data';

import * as Shared from './../../../shared';

@Component({
  selector: 'importer',
  templateUrl: './importer.component.html',
  styleUrls: ['./importer.component.scss']
})
export class ImporterComponent implements OnInit {

  type: string = 'movements';
  wallet: string = '';
  walletformatjson: any = `
  [{
    "amount": "120",
    "concept": "Lottery",
    "date": "2018-10-28T18:00:00"
  },{
    "amount": "-60",
    "concept": "New shoes",
    "date": "2018-11-04T18:00:00"
  }]`;
  walletformat : string;
  constructor(
    public router: Router, 
    public navParams: NavParams, 
    public modalController: ModalController, 
    public dataService: DataService, 
    public translate: TranslateService,
    ) {
    this.walletformat = JSON.stringify(this.walletformatjson);
  }

  ngOnInit() {
  }

  importMovements() {
    var importedMovements = [];
    if(this.wallet) {
      try {
        let movements = [];
        movements = JSON.parse(this.wallet);
        if(movements && movements.length) {
          for(let movement of movements) {
            if(movement.date && !movement.from) movement.from = movement.date;
            movement.from = movement.from ? format(new Date(movement.from)) : null;
            movement.to = movement.to ? format(new Date(movement.to)) : null;
            movement.amount = parseFloat((''+movement.amount).replace(/\./g,"").replace(',', '.'));
            movement.type = movement.amount > 0 ? 'income' : 'outcome';
            movement.amount = Math.abs(movement.amount);
            movement.repeat = movement.repeat ? movement.repeat : null;
            movement.essential = movement.essential ? movement.essential : false;
            movement.movementUuid = Shared.utilsGetUuid();
            let validMovement: any = Shared.validateMovement(movement);
            if(validMovement) {
              importedMovements.push(validMovement);
            }else{
              console.log('movement not valid');
            }
          }
        }
      }catch(e){
        return;
      }
      this.dataService.addMovements(importedMovements);
      this.closeImporter();
    }
  }

  importWallet() {

  }

  importFile() {
    document.getElementById('csvFile').click();
  }

  onFileChange(onChangeEvent: any) {
    var reader = new FileReader();
    var that = this;
    reader.onload = function(onLoadEvent: any) {
       that.wallet = onLoadEvent.target.result;
    };
    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
  }
  closeImporter(event?){
    this.modalController.dismiss();
  }

}
