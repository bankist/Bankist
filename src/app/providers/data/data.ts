import { Injectable } from '@angular/core';
import { Router, CanActivate } from "@angular/router";
import { Storage } from '@ionic/storage';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import * as CryptoJS from 'crypto-js';

import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Wallet } from './../../models/wallet';
import * as Shared from './../../shared';

declare var window: any;
declare var navigator: any;

// @Injectable({ providedIn: 'root' })
export class DataService implements CanActivate{

  private DATA_KEY: string = '_banking';

  banking: any = {}
  session: any = {}

  _defaults: any;
  _currencies: any;
  _readyPromise: Promise<any>;
  _wallet: string = '';

  private currencyChange = new Subject<boolean>();
  currencyChanged = this.currencyChange.asObservable();

  private languageChange = new Subject<boolean>();
  languageChanged = this.languageChange.asObservable();

  private intervalChange = new Subject<boolean>();
  intervalChanged = this.intervalChange.asObservable();

  private intervalExtremesChange = new Subject<boolean>();
  intervalExtremesChanged = this.intervalExtremesChange.asObservable();

  private typeChange = new Subject<boolean>();
  typeChanged = this.typeChange.asObservable();

  private walletDateChange = new Subject<any>();
  walletDateChanged = this.walletDateChange.asObservable();

  private planChange = new Subject<boolean>();
  planChanged = this.planChange.asObservable();

  private statusUpdate = new Subject<boolean>();
  updatedStatus = this.statusUpdate.asObservable();

  constructor(public storage: Storage, public secureStorage: SecureStorage, public router: Router, defaults: any) {
    this._defaults = defaults;
    this._currencies = Shared.CURRENCIES;
  }

  canActivate() {
    if(this.session.wallet) {
      return true;
    }else{
      this.router.navigateByUrl('/identify');
      return false;
    }
  }

  loadBanking() {
    return this.storage.get(this.DATA_KEY).then((value) => {
      if (value) {
        this.banking = value;
        return this._mergeBankingDefaults(this._defaults);
      } else {
        return this.setBankingAll(this._defaults).then((val) => {
          this.banking = val;
        })
      }
    });
  }

  _mergeBankingDefaults(defaults: any) {
    for (let k in defaults) {
      if (!(k in this.banking)) {
        this.banking[k] = defaults[k];
      }
    }
    return this.setBankingAll(this.banking);
  }

  setBankingAll(value: any) {
    return this.storage.set(this.DATA_KEY, value);
  }

  setBanking(key: string, value: any) {
    this.banking[key] = value;
    return this.storage.set(this.DATA_KEY, this.banking);
  }

  setSecureCode(code: string) {
    return new Promise((resolve, reject) => {
      this.secureStorage.create('bankist')
        .then((storage: SecureStorageObject) => {
           storage.set('code', code)
             .then(
              data => resolve(data),
               error => resolve(null)
           );
        });
    })
  }

  getBanking(key: string) {
    return this.storage.get(this.DATA_KEY)
      .then(value => {
        return value ? value[key] : null;
      });
  }

  getSecureCode() {
    return new Promise((resolve, reject) => {
      this.secureStorage.create('bankist')
        .then((storage: SecureStorageObject) => {
           storage.get('code')
             .then(
               data => resolve(data),
               error => resolve(null)
           );
        });
    })
  }

  getCurrencySymbol() {
    return this._currencies.filter((c)=>c.id==this.banking.currency)[0].symbol;
  }

  checkWallet(name) {
    return this.banking && this.banking.wallets && this.banking.wallets.indexOf(name)!=-1 ? true : false;
  }

  checkCode(name, code) {
    let walletUuid = this.getWalletUuid(name, code);
    return this.storage.get(walletUuid)
      .then((wallet) => {
        if(wallet){
          return this.decryptWallet(wallet, name, code);
        }else{
          return null;
        }
      }, (err) => { return null; });
  }

  setCode(name, code, wallet?) {
    this.session['code'] = code;
    this.session['name'] = name;
    this.session['walletUuid'] = this.getWalletUuid(name, code);
    if(wallet) this.session['wallet'] = wallet;
    return this.session.walletUuid;
  }

  getWallet() {
    let walletUuid = this.getWalletUuid(this.session.name, this.session.code);
    return this.storage.get(walletUuid)
      .then((wallet) => {
        this._wallet = wallet;
        this.session.wallet = this.decryptWallet(this._wallet);
        return this.session.wallet;
      }, (err) => { return false; });
  }

  setWallet(name, wallet?) {
    if(!wallet||!wallet.walletUuid) {
      let walletUuid = this.getWalletUuid(name, this.session.code);
      let newWallet = new Wallet({
        walletUuid: walletUuid,
        name: name, 
        type: 'individual', 
        movements: [],
        plans: [],
        assistant: {}
      });
      wallet = Object.assign({}, newWallet, wallet);
    }
    let walletENC = this.encryptWallet(wallet);
    this.session['wallet'] = wallet;
    this.storage.set(wallet.walletUuid, walletENC);
    this.updateStatus(wallet);
    return wallet;
  }

  deleteWallet() {
    this.storage.remove(this.session.wallet.walletUuid);
    this.banking.wallets = this.banking.wallets.filter((w)=>w!=this.session.wallet.name);
    this.setBankingAll(this.banking).then(()=>{
      this.logout();
    })
  }

  setAssistant(assistant) {
    let wallet = this.session.wallet;
    wallet.assistant = wallet.assistant ? Object.assign(wallet.assistant, assistant) : assistant;
    return this.setWallet(wallet.walletUuid, wallet);
  }

  rememberWallet(name) {
    if(!this.banking.wallets) this.banking['wallets'] = [];
    if(this.banking.wallets.indexOf(name)==-1) this.banking.wallets.push(name);
    return this.setBanking('wallets', this.banking.wallets);
  }

  createMovements(movements) {
    let wallet = this.session.wallet;
    wallet.movements = movements;
    return this.setWallet(wallet.walletUuid, wallet);
  }

  addMovements(movements) {
    let wallet = this.session.wallet;
    wallet.movements = wallet.movements.concat(movements);
    return this.setWallet(wallet.walletUuid, wallet);
  }

  createMovement(movement) {
    let wallet = this.session.wallet;
    movement.movementUuid = Shared.utilsGetUuid();
    wallet.movements.push(movement);
    return this.setWallet(wallet.walletUuid, wallet);
  }

  updateMovement(movement) {
    let wallet = this.session.wallet;
    if(movement.movementUuid) wallet.movements = wallet.movements.map((m)=>m.movementUuid==movement.movementUuid?movement:m);
    return this.setWallet(wallet.walletUuid, wallet);
  }

  deleteMovement(movement) {
    let wallet = this.session.wallet;
    if(movement.movementUuid) wallet.movements = wallet.movements.filter((m)=>m.movementUuid!=movement.movementUuid);
    return this.setWallet(wallet.walletUuid, wallet);
  }

  createPlan(plan) {
    let wallet = this.session.wallet;
    plan.planUuid = Shared.utilsGetUuid();
    wallet.plans.push(plan);
    this.setWallet(wallet.walletUuid, wallet);
    this.changePlan();
    return;
  }

  updatePlan(plan) {
    let wallet = this.session.wallet;
    if(plan.planUuid) wallet.plans = wallet.plans.map((p)=>p.planUuid==plan.planUuid?plan:p);
    this.setWallet(wallet.walletUuid, wallet);
    this.changePlan();
    return;
  }

  deletePlan(plan) {
    let wallet = this.session.wallet;
    if(plan.planUuid) wallet.plans = wallet.plans.filter((p)=>p.planUuid!=plan.planUuid);
    this.setWallet(wallet.walletUuid, wallet);
    this.changePlan();
    return;
  }

  logout() {
    this.session = null;
    this.banking = null;
    navigator['app'].exitApp();
  }

  public initCurrency(language?) {
    this.getBanking('currency').then((currency) => {
      if(!currency || language) {
        currency = 'USD';
        if (language && ['es', 'fr', 'de', 'it'].indexOf(language)!= -1) {
          currency = 'EUR';
        }
      }
      this.changeCurrency(currency);
    });
  }

  public initWeekStart(language) {
    if(language=='en') {
      window.__weekStartsOn__ = 0;
    }else{
      window.__weekStartsOn__ = 1;
    }
  }

  public changeInterval(interval) {
    this.intervalChange.next(interval);
  }

  public changeCurrency(currency) {
    this.setBanking('currency', currency);
    this.currencyChange.next(currency);
  }

  public changeLanguage(language) {
    this.setBanking('language', language);
    this.initWeekStart(language);
    this.languageChange.next(language);
  }

  public changeType(type) {
    this.typeChange.next(type);
  }

  public changeIntervalExtremes(intervalExtremes) {
    this.intervalExtremesChange.next(intervalExtremes);
  }

  public changeWalletDate(walletDate) {
    this.walletDateChange.next(walletDate);
  }

  public changePlan() {
    this.planChange.next();
  }

  public updateStatus(wallet) {
    this.statusUpdate.next(wallet);
  }

  public getWalletExport() {
    return {
      uuid: this.banking.uuid,
      name: this.session.name,
      walletUuid: this.session.walletUuid,
      wallet: this._wallet
    }
  }

  private getWalletUuid(name?, code?) {
    return CryptoJS.SHA256(name + this.banking.uuid).toString();
  }

  private encryptWallet(wallet, name?, code?) {
    return this.encrypt(JSON.stringify(wallet), name, code);
  }

  private decryptWallet(encryptedString, name?, code?) {
    let wallet;
    try {
      wallet = JSON.parse(this.decrypt(encryptedString, name, code));
    } catch (e) {
      wallet = null;
    }
    return wallet;
  }

  private encrypt(data?, name?, code?) {
    name = name ? name : this.session.name;
    code = code ? code : this.session.code;
    return CryptoJS.AES.encrypt(data, name + code + this.banking.uuid).toString();
    // return data;
  }

  private decrypt(ciphertext, name?, code?) {
    name = name ? name : this.session.name;
    code = code ? code : this.session.code;
    let wallet;
    try {
      var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), name + code + this.banking.uuid);
      wallet = bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      wallet = null;
    }
    return wallet;
    // return ciphertext;
  }

}



