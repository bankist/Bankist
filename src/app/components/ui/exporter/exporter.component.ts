import { Component, OnInit } from '@angular/core';

import { Platform, ModalController, ToastController, NavParams } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

import saveAs from 'file-saver';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../../providers/data/data';

import * as Shared from './../../../shared';

@Component({
  selector: 'exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.scss']
})
export class ExporterComponent implements OnInit {

  copyText: boolean;
  type: string = 'movements';
  wallet: any;
  constructor(
    public platform: Platform, 
    public clipboard: Clipboard, 
    public translate: TranslateService, 
    public navParams: NavParams, 
    public modalController: ModalController,
    public toastController: ToastController,
    public dataService: DataService,
    private file: File,
    private fileOpener: FileOpener,
    ) {
    this.copyText = this.platform.is('cordova') ? true : false;
    if(this.navParams && this.navParams.get('wallet')) this.wallet = this.navParams.get('wallet');
  }

  ngOnInit() {
  }

  exporterExport(mode?) {
    let data = this.getExportData();
    data = JSON.stringify(data);
    if(mode&&mode=='copy') {
      if(this.platform.is('cordova')) {
        this.clipboard.copy(data);
      }else{
        var el: any = document.createElement('textarea');
        el.value = data;
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      this.showToast(this.translate.instant('EXPORT_MOVEMENTS_TEXT_COPIED'))
      this.closeExporter();
    }else{
      if(this.platform.is('cordova')){
        this.writeFile(data);
      }else{
        var workElement = document.createElement("a");
        let fileIdentity = this.wallet.name;
        if ('download' in workElement) {
            workElement.href = 'data:application/json;charset=utf-8,' + escape(data);
            workElement.setAttribute("download", fileIdentity);
            document.body.appendChild(workElement);
            var eventMouse = document.createEvent("MouseEvents");
            eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            workElement.dispatchEvent(eventMouse);
            document.body.removeChild(workElement);
            this.closeExporter();
        } else {
          this.clipboard.copy(data);
          this.showToast(this.translate.instant('EXPORT_MOVEMENTS_TEXT_COPIED'))
          this.closeExporter();
        }
      }
    }
  }

  getExportData() {
    if(this.type == 'movements') {
      let cleanMovements = [];
      for(var movement of this.wallet.movements) {
        let validMovement = Shared.validateMovement(movement);
        if(validMovement) cleanMovements.push(validMovement);
      }
      return cleanMovements;
    }else {
      return this.dataService.getWalletExport();
    }
    return this.wallet;
  }

  getExportFileName() {
    if(this.type == 'movements') {
      return this.wallet.name+'.movs.json';
    }else {
      return this.wallet.name+'.wallet.json';
    }
  }

  async showToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  writeFile(data) {
    const directory = ((this.platform.is('ios')||this.platform.is('iphone')) 
      ? this.file.documentsDirectory : this.file.externalRootDirectory) + '/Download/';
    const fileName = this.getExportFileName();
    let options: IWriteOptions = { replace: true };

    this.file.listDir(directory, '')
    .then(_ => {
      this.file.checkFile(directory, fileName).then((success)=> {
        this.file.writeFile(directory, fileName, data, options)
        .then((success)=> {
          this.showToast(this.translate.instant('EXPORT_SAVED'))
          this.fileOpener.open(directory + fileName, 'application/json')
        })
        .catch((error)=> {
          this.showToast(this.translate.instant('EXPORT_SAVED_FAILED'))
          // this.loading.dismiss();
        });
      })
      .catch((error)=> {
        this.file.writeFile(directory, fileName, data)
        .then((success)=> {
          this.showToast(this.translate.instant('EXPORT_SAVED'))
          this.fileOpener.open(directory + fileName, 'application/json')
        })
        .catch((error)=> {
          this.showToast(this.translate.instant('EXPORT_SAVED_FAILED'))
          // this.loading.dismiss();
        });
      });
    })
    .catch(err => console.log(err));
  }

  closeExporter(event?){
    this.modalController.dismiss();
  }

}
