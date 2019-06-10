import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, Platform, NavController } from '@ionic/angular';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

import { DataService } from './../../providers/';

@Component({
  selector: 'page-code',
  templateUrl: 'code.page.html',
  styleUrls: ['code.page.scss']
})
export class CodePage {
  codeKeys: any = ['1','2','3','4','5','6','7','8','9','←','0'];
  fingerPrint: any = null;
  shake: any = null;
  walletCode: string = '';
  walletCodeArray: any;
  walletExists: any;
  walletName: string = '';
  walletType: string = 'individual';
  constructor(
    private faio: FingerprintAIO,
    private route: ActivatedRoute,
    private navController: NavController,
    private router: Router,
    public dataService: DataService,
    public platform: Platform,
    public toastController: ToastController
    ) {
      this.walletName = this.route.snapshot.paramMap.get('wallet');
      let walletType = this.route.snapshot.paramMap.get('type');
      if(walletType) this.walletType = walletType;
      if(!this.walletName) {
        this.navController.navigateRoot(['']);
      }
      this.checkWallet();
  }

  checkWallet() {
    this.walletExists = this.dataService.checkWallet(this.walletName);
    if(this.walletExists) {
      this.checkFinger();
    }
  }

  insertKey(code) {
    switch(code) {
      case '←':
        this.deleteKey();
        break;
      default:
        this.addKey(code);
        break;
    }
  }

  addKey(code) {
    if(this.walletCode && this.walletCode.length > 7) return;
    this.walletCode = this.walletCode.toString() + code.toString();
    this.walletCodeArray = this.walletCode.split('');
  }

  deleteKey(){
    if(this.walletCode=='') {
      this.navController.navigateRoot(['']);
    }else{
      this.walletCode = this.walletCode ? this.walletCode.substring(0, this.walletCode.length - 1) : '';
      this.walletCodeArray = this.walletCode.split('');
    }
  }

  checkCode(code?) {
    code = code ? code : this.walletCode;
    if(this.walletExists) {
      this.dataService.checkCode(this.walletName, code).then((wallet) => {
        if(wallet && wallet.name) {
          this.dataService.setCode(this.walletName, code, wallet);
          this.openWallet(wallet);
        }else{
          this.wrongCode();
        }
      })
    }else{
      this.dataService.setCode(this.walletName, code);
      this.faio.isAvailable().then((isAvailable)=>{
        this.dataService.setSecureCode(code);
      })
      this.dataService.rememberWallet(this.walletName);
      let wallet = this.dataService.setWallet(this.walletName, {type: this.walletType});
      this.openWallet(wallet);
    }
  }

  checkFinger() {
    this.faio.isAvailable().then((isAvailable)=>{
      this.faio.show({
          clientId: 'Bankist',
          clientSecret: 'Bankrupt',
          disableBackup:true,
          localizedFallbackTitle: 'Use Pin',
          localizedReason: 'Please authenticate'
      })
      .then((result: any) => {
        this.dataService.getSecureCode().then((code) => {
          if(code) this.checkCode(code);
          else this.wrongCode();
        });
      })
      .catch((error: any) => {
        this.wrongCode();
      });
    })
    .catch((err) => {
      return;
    })
  }

  async wrongCode() {
    this.shake = true;
    setTimeout(()=>{this.shake = false;}, 3000);
    const toast = await this.toastController.create({
      message: 'Cannot open wallet',
      cssClass: "toast-error",
      duration: 3000
    });
    return await toast.present();
  }

  openWallet(wallet?) {
    if(wallet && wallet.movements && wallet.movements.length) {
      this.router.navigateByUrl('/tabs/tabs/wallet');
    }else{
      this.router.navigate(['/tutorial']);
    }
  }
}