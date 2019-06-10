import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Platform, ActionSheetController, ModalController, ToastController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../../providers/'
import { AssistantSliderComponent } from './../../../components/assistant/assistant-slider/assistant-slider.component';

import {
  format,
  addYears,
  addMonths,
  addDays,
  subDays,
  subMonths,
  subYears,
  endOfYear,
  startOfYear,
  differenceInDays
} from 'date-fns';

import * as Shared from './../../../shared';

@Component({
  selector: 'summary',
  templateUrl: 'summary.component.html',
  styleUrls: ['summary.component.scss']
})
export class SummaryComponent implements OnInit {

  assistantStatus: any;
  currentLang: string = null;
  dateFormat: string = null;
  dateMax: any = format(endOfYear(addYears(new Date(), 10)), 'YYYY');
  dateMin: any = format(startOfYear(subYears(new Date(), 3)), 'YYYY');
  expenses: any;
  incomes: any;
  intervalIndex: any;
  intervalInitial: any;
  intervals: any;
  menu: any;
  savings: any;
  walletBalance: any;
  walletIntervalChange: Subject<string> = new Subject();

  @ViewChild('chartSummary') chartSummary: ElementRef;
  @Input('wallet') wallet: any;
  @Input('interval') interval: any;
  @Input('currency') currency: any;
  @Input('language') language: any;
  @Input('date') date: any;
  @Input('balance') balance: any;
  @Input('slim') slim: boolean = false;
  @Input('range') range: string;
  @Input('type') type: string;
  @Input('title') title: string;
  @Output('clickedBalance') clickedBalance = new EventEmitter();
  @Output('clickedNext') clickedNext = new EventEmitter();
  @Output('clickedPrev') clickedPrev = new EventEmitter();
  @Output('changedInterval') changedInterval = new EventEmitter();
  @Output('changedType') changedType = new EventEmitter();
  @Output('changedWalletBalance') changedWalletBalance = new EventEmitter();
  constructor(
    public translate: TranslateService, 
    public dataService: DataService,
    public router: Router,
    public platform: Platform,
    public toast: ToastController,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController) {
    this.currentLang = this.translate.currentLang;
    this.dateFormat = this.translate.instant('DATE_FORMAT_SHORT');
    this.intervals = Shared.INTERVALS;
    this.changeIntervalSuscription();
  }

  ngOnInit() {
    if(this.wallet) this.setSummary(this.wallet);
  }

  ngOnChanges(map) {
    if(map.interval && map.interval.currentValue) this.interval = map.interval.currentValue;
    if(this.interval && this.interval.initial) this.intervalInitial = format(this.interval.initial);
    if(this.wallet && map.balance) this.wallet.balance = this.balance;
    if(map.wallet||map.interval) this.setSummary(this.wallet);
    this.assistantStatus = Shared.checkAssistant(this.wallet);
    if(!this.date) this.date = new Date();
  }
  changeIntervalSuscription() {
    this.walletIntervalChange.pipe(debounceTime(500), distinctUntilChanged()).subscribe(interval => {
      this.changedInterval.next(interval);
    });
  }
  setInterval(interval){
    interval = Object.assign({}, this.interval, interval);
    this.changedInterval.next(interval);
  }
  setBalance() {
    this.clickedBalance.next();
  }
  setType(type){
    this.changedType.next(type);
  }
  setSummary(wallet){
    if(wallet && wallet.zeitMovements) {
      let movs = this.wallet.zeitMovements;
      this.setTypesSummary(movs);
    }
  }

  next() {
    if(this.range) {
      let initial = new Date();
      if(this.range == 'day') initial = addDays(this.interval.initial, 1);
      else if(this.range == 'week') initial = addDays(this.interval.initial, 7);
      else if(this.range == 'month') initial = addMonths(this.interval.initial, 1);
      let interval = Shared.getZeitInterval(this.range, initial);
      this.changeIntervalDebounce(interval);
      this.interval = interval;
    }else {
      let interval;
      let intervalIndex = this.intervals.findIndex((i)=>i.id == this.interval.id);
      if(intervalIndex < this.intervals.length - 1) {
        interval = this.intervals[intervalIndex+1];
        interval = Shared.getZeitInterval(interval.id);
        this.changeIntervalDebounce(interval);
        this.interval = interval;
      }
    }
  }

  prev() {
    if(this.range) {
      let initial = new Date();
      if(this.range == 'day') initial = subDays(this.interval.initial, 1);
      else if(this.range == 'week') initial = subDays(this.interval.initial, 7);
      else if(this.range == 'month') initial = subMonths(this.interval.initial, 1);
      let interval = Shared.getZeitInterval(this.range, initial);
      this.changeIntervalDebounce(interval);
      this.interval = interval;
    }else{
      let interval;
      let intervalIndex = this.intervals.findIndex((i)=>i.id == this.interval.id);
      if(intervalIndex > 0) {
        interval = this.intervals[intervalIndex-1];
        interval = Shared.getZeitInterval(interval.id);
        this.changeIntervalDebounce(interval);
        this.interval = interval;
      }
    }
  }

  changeIntervalDebounce(interval) {
    this.walletIntervalChange.next(interval);
  }

  onChangeInterval(intervalId){
    if(intervalId != this.interval.id) {
      let interval = this.intervals.find((i)=>i.id == intervalId);
      interval = Shared.getZeitInterval(interval.id, new Date());
      this.setInterval(interval);
    }
  }

  onChangeIntervalInitial(intervalInitial){
    let initialDate = new Date();
    if(intervalInitial.month || intervalInitial.year) {
      if(intervalInitial.year) initialDate.setFullYear(intervalInitial.year.value);
      if(intervalInitial.month) initialDate.setMonth(intervalInitial.month.value-1);
      let interval = Shared.getZeitInterval(this.range, initialDate);
      this.setInterval(interval);
    }
  }

  setTypesSummary(movs){
    if(this.type && this.type!='economy') {
      let incomes = this.incomes;
      let expenses = this.expenses;
      let savings = this.savings;
      this.wallet = Object.assign({}, this.wallet, {incomes, expenses, savings});
    }else{
      if(!this.date) this.date = new Date();
      if(movs && movs.length){
        let balance = 0, incomes = 0, savings = 0, expenses = 0;
        for(let mov of movs){
          let movDate = new Date(mov.date);
          if(!balance || movDate < this.date || movDate.toDateString() === this.date.toDateString()){
            if(mov.type == 'balance') balance = mov.amount;
            else if(mov.type == 'income') balance += mov.amount;
            else balance -= mov.amount;
          }
          if(mov.type=='income') incomes += mov.amount;
          if(mov.type=='outcome') expenses += mov.amount;
          savings = incomes - expenses;
        }
        this.wallet = Object.assign({}, this.wallet, {balance, incomes, expenses, savings});
        this.incomes = incomes;
        this.expenses = expenses;
        this.savings = savings;
        this.balance = balance;
        if(!this.walletBalance) {
          this.walletBalance = balance;
          setTimeout(()=>this.changedWalletBalance.next(this.walletBalance))
        }
      }
    }
  }

  async assistant() {
    const modal = await this.modalController.create({
      component: AssistantSliderComponent,
      componentProps: { wallet: this.wallet, balance: this.walletBalance }
    });
    return await modal.present();
  }

  async showMenu() {
    this.menu = await this.actionSheetController.create({
      header: 'Menu',
      buttons: [{
        text: this.translate.instant('MENU_SETTINGS'),
        icon: 'md-settings',
        handler: () => {
          this.settings();
        }
      },{
        text: this.translate.instant('MENU_LOGOUT'),
        icon: 'md-log-out',
        handler: () => {
          this.logOut();
        }
      }]
    });
    await this.menu.present();
  }

  settings() {
    this.router.navigate(['/settings'], {skipLocationChange: true});
  }

  logOut() {
    this.dataService.logout();
  }

}


