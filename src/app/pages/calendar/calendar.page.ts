import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController } from '@ionic/angular';

import { CalendarEvent, CalendarDateFormatter } from 'angular-calendar';
import {
  addDays,
  addHours,
  addMonths,
  endOfDay,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays,
  subMonths,
} from 'date-fns';


import { DataService } from './../../providers/data/data';
import { CustomDateFormatter } from './calendar-date-formatter.provider';

import {AddModal} from './../add/add.modal';

import * as Shared from './../../shared';

declare var window: any;

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class CalendarPage  {

  activeDayIsOpen: boolean;
  clickedDate: Date;
  events: CalendarEvent[] = [];
  view: string = 'month';
  viewDate: Date = new Date();
  weekStartsOn: any;

  currency: any;
  currentLang: any = null;
  existingMovement: any = null;
  interval: any;
  movementList: boolean = false;
  newWallet: boolean = false;
  showHistoric: boolean = false;
  type: any = null;
  wallet: any;
  zeitEvents: CalendarEvent[] = null;
  zeitgeist: any = null;
  zeitMovements: any = null;
  constructor(
    public dataService: DataService,
    public modalController: ModalController,
    public navController: NavController,
    public platform: Platform,
    public router: Router, 
    public translate: TranslateService,
  ) {
      this.currency = this.dataService.getCurrencySymbol()
      this.currentLang = this.translate.currentLang;
      this.weekStartsOn = Shared.getWeekStart(this.currentLang);
      this.interval = Shared.getZeitInterval('month');
      this.dataService.updatedStatus.subscribe( 
        wallet => {
          this.wallet = wallet;
          this.zeitgeistWallet(wallet);
        }
      );
      this.dataService.currencyChanged.subscribe( 
        currency => {
          this.currency = this.dataService.getCurrencySymbol()
        }
      );
      this.dataService.languageChanged.subscribe( 
        language => {
          this.currentLang = language;
          this.weekStartsOn = Shared.getWeekStart(this.currentLang);
        }
      );
      this.onResize(null)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.movementList = window.innerWidth >= 992 ? true : false;
  }

  ionViewWillEnter() {
    this.initWallet();
  }

  initWallet(wallet?) {
    this.dataService.getWallet().then((wallet) => {
      if(wallet) {
        this.wallet = wallet;
        this.zeitgeistWallet(this.wallet);
      }else{
        this.navController.navigateRoot(['']);
      }
    })
  }

  zeitgeistWallet(wallet?){
    this.existingMovement = null;
    this.newWallet = false;
    if(wallet && wallet.movements && wallet.movements.length) {
      let zeitMovements = Shared.getZeitMovements(wallet.movements, this.interval, this.type);
      this.wallet = Object.assign({}, this.wallet, {zeitMovements: zeitMovements});
      this.zeitEvents = zeitMovements && zeitMovements.length ? zeitMovements.map((m)=>{
        let date = m.date;
        let zeitEvent = {
          start: new Date(date),
          end: new Date(date),
          title: m.concept,
          movement: m,
          allDay: true
        };
        return zeitEvent;
      }) : null;
      this.dispatchResize();
    }
  }

  changeCalendarDate(date?) {
    this.viewDate = date;
  }
  changeInterval(interval) {
    this.type = null;
    this.interval = interval;
    this.changeCalendarDate(this.interval.initial);
    this.zeitgeistWallet(this.wallet);
  }
  changeNext(interval){
    this.changeInterval(interval);
  }
  changePrev(interval){
    this.changeInterval(interval);
  } 
  changeRange(view) {
    this.view = view;
    let interval = Shared.getZeitInterval(view, this.interval.initial);
    this.changeInterval(interval);
  }
  changeType(type) {
    if(type == this.type) type = null;
    this.type = type;
    this.zeitgeistWallet(this.wallet);
  }
  changeView({date, event}) {
    if(event && event.start) date = new Date(event.start);
    let view = this.toggleView();
    this.changeCalendarDate(date);
    let interval = Shared.getZeitInterval(view, date);
    this.changeInterval(interval);
  }
  toggleView() {
    switch (this.view) {
      case "month":
        this.view = 'week';
        break;
      case "week":
        this.view = 'day';
        break;
    }
    return this.view;
  }
  async editMovement(movement?) {
    this.existingMovement = movement;
    let wallet = this.wallet;
    const modal = await this.modalController.create({component: AddModal, componentProps: {movement, wallet}});
    await modal.present();
  }
  dispatchResize(){
    setTimeout(()=>{window.dispatchEvent(new Event('resize')), 250});
  }
}
