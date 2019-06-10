import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonContent, IonSlides, AlertController, ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import {
  format,
  startOfDay,
  addDays,
  addYears,
  subYears,
  endOfYear,
  endOfDay,
  startOfYear,
  isSameDay
} from 'date-fns';

import { Movement } from './../../../models/movement';

import { MovementProductsComponent } from './../movement-products/movement-products.component';

import * as Shared from './../../../shared';

@Component({
  selector: 'movement-form',
  templateUrl: 'movement-form.component.html',
  styleUrls: ['movement-form.component.scss']
})
export class MovementFormComponent implements OnInit {

  currentLang: string = null;
  dateDefault: string = null;
  dateFormat: string = null;
  dateFrom: any;
  dateTo: any;
  dateMax: any = format(endOfYear(addYears(new Date(), 10)), 'YYYY');
  dateMin: any = format(startOfYear(subYears(new Date(), 3)), 'YYYY');
  dateMovement: any;
  repeatType: any;
  lastInput: any;
  moreOptions: any;
  originalMovement: Movement;
  products: any;
  @Input('currency') currency: any;
  @Input('movement') movement: any = new Movement();
  @Input('wallet') wallet: any;
  @Input('view') view: any = 'modal'
  @Input('options') options: any = {include: false, exclude: false, fields: null};
  @Output('createdMovement') createdMovement = new EventEmitter();
  @Output('updatedMovement') updatedMovement = new EventEmitter();
  @Output('deletedMovement') deletedMovement = new EventEmitter();
  @Output('closedMovement') closedMovement = new EventEmitter();
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('movementForm') movementForm: NgForm;
  constructor(public translate: TranslateService, 
    public alertController: AlertController,
    public modalController: ModalController) {
    this.products = Shared.PRODUCTS;
    this.dateDefault = format(new Date());
    this.dateFormat = this.translate.instant('DATE_FORMAT');
    this.currentLang = this.translate.currentLang;
  }

  ngOnInit() {
  }

  ngOnChanges(map) {
    if(map && map.wallet && map.movement) this.initialize();
  }

  initialize() {
    this.initMovementForm(this.movement);
  }

  initMovementForm(movement?) {
    this.movement = new Movement();
    this.movement.amount = 0.00;
    this.movement.repeat = null;
    this.movement.type = 'outcome';
    this.movement.from = this.dateDefault;
    this.movement.essential = true;
    if(movement) {
      this.movement = Object.assign(this.movement, movement);
      this.dateMovement = format(this.movement.date);
      this.originalMovement = Object.assign({}, movement);
      if(this.originalMovement.repeat) this.repeatType = 'event';
    }
  }
  changeInput(input){
    this.movement.amount = input;
  }
  frecuencyChanged() {
    if(!this.movement.repeat) this.movement.to = null;
    else if(!this.movement.movementUuid) this.movement.to = format(Shared.getNextDate(this.movement));
  }
  clearDateTo() {
    setTimeout(()=>this.movement.to = null)
  }
  changeRepeat(mode) {
    this.repeatType = mode;
  }
  showMore(){
    this.moreOptions = true;
  }
  closeMovementForm(event?){
    if(!event || event.target.nodeName=='ION-CARD-CONTENT') {
      if(this.movement && this.movement.movementUuid) {
        this.cleanMovement();
        this.closedMovement.next(this.movement);
      } else {
        window.history.back();
      }
    }
  }

  save(form: NgForm) {
    if(this.movement.from) {
      if(this.movement.from.month || this.movement.from.year) {
        let initialDate = new Date();
        if(this.movement.from.year) initialDate.setFullYear(this.movement.from.year.value);
        if(this.movement.from.month) initialDate.setMonth(this.movement.from.month.value-1);
        if(this.movement.from.day) initialDate.setDate(this.movement.from.day.value);
        this.movement.from = format(initialDate);
      }else this.movement.from = format(this.movement.from);
    }
    if(this.movement.to) {
      if(this.movement.to.month || this.movement.to.year) {
        let initialDate = new Date();
        if(this.movement.to.year) initialDate.setFullYear(this.movement.to.year.value);
        if(this.movement.to.month) initialDate.setMonth(this.movement.to.month.value-1);
        if(this.movement.to.day) initialDate.setDate(this.movement.to.day.value);
        this.movement.to = format(initialDate);
      }else this.movement.to = format(this.movement.to);
    }
    if(!this.movement.from) this.movement.from = this.dateDefault;
    if(this.movement.to && this.movement.to < this.movement.from) this.movement.to = this.movement.from;
    if(this.movement.to == this.movement.from ) this.movement.to = null;

    if(this.movement.movementUuid) {
      this.updateMovement()
    }else{
      this.createMovement()
    }
  }

  createMovement() {
    let movement = Object.assign({}, this.movement);
    this.cleanMovement();
    this.createdMovement.next(movement);
  }

  updateMovement() {
    let movement = Object.assign({}, this.movement);
    // delete movement.date;
    // delete movement.events;
    if(this.repeatType == 'event') {
      delete movement.events;
      this.originalMovement = Shared.setToOriginalMovement(this.wallet, movement);
      this.cleanMovement();
      this.updatedMovement.next(this.originalMovement);
    }else if(this.repeatType == 'repeat') {
      this.updateRepeatedConfirm(movement);
    }else if(this.repeatType == 'nowon') {
      let event = Object.assign({}, this.originalMovement, {to : format(endOfDay(new Date()))});
      let nextDate = Shared.getNextDate(event);
      let newEvent = Object.assign({}, movement, {movementUuid: null, from: nextDate});
      this.cleanMovement();
      this.updatedMovement.next(event);
      this.createdMovement.next(newEvent);
    }else{
      this.cleanMovement();
      this.updatedMovement.next(movement);
    }
  }

  deleteMovement() {
    let movement = Object.assign({}, this.movement);
    if(this.repeatType=='event') {
      movement = Object.assign({}, movement, {deleted: true});
      this.originalMovement = Shared.setToOriginalMovement(this.wallet, movement);
      this.cleanMovement();
      this.updatedMovement.next(this.originalMovement);
    }else if(this.repeatType == 'repeat') {
      this.deleteRepeatedConfirm(movement);
    }else if(this.repeatType == 'nowon') {
      movement = Object.assign({}, movement, {to : format(endOfDay(new Date()))});
      this.cleanMovement();
      this.updatedMovement.next(movement);
    }else{
      movement.deleted = true;
      this.cleanMovement();
      this.deletedMovement.next(movement);
    }
  }

  cleanMovement() {
    try{
      this.movementForm.reset();
      this.initMovementForm();
      window ? window.scrollTo(0, 0) : null;
    }catch(e){}
  }

  async changeProduct() {
    let product = this.movement.product ? this.movement.product : null;
    const modal = await this.modalController.create({
      component: MovementProductsComponent, 
      componentProps: { product }, 
      cssClass: 'productsModal'
    });
    modal.onDidDismiss().then(data => {
      if(data.data) {
        let product = data.data.product;
        setTimeout(()=>this.movement = Object.assign({}, this.movement, {product}))
      }
    });
    return await modal.present();
  }

  async updateRepeatedConfirm(movement) {
    const alert = await this.alertController.create({
      header: this.translate.instant('MOVEMENT_UPDATE_ALERT_HEADER_REPEAT'),
      message: this.translate.instant('MOVEMENT_UPDATE_ALERT_HEADER_TEXT_REPEAT'),
      buttons: [
        {
          text: this.translate.instant('MOVEMENT_UPDATE_ALERT_CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.translate.instant('MOVEMENT_UPDATE_ALERT_CONFIRM'),
          cssClass: 'primary',
          handler: () => {
            this.cleanMovement();
            this.originalMovement = Object.assign({}, this.originalMovement, movement);
            this.updatedMovement.next(this.originalMovement);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteRepeatedConfirm(movement) {
    const header = this.repeatType == 'repeat' ? 
      this.translate.instant('MOVEMENT_DELETE_ALERT_HEADER_REPEAT')
        : this.translate.instant('MOVEMENT_DELETE_ALERT_HEADER');
    const message = this.repeatType == 'repeat' ? 
      this.translate.instant('MOVEMENT_DELETE_ALERT_HEADER_TEXT_REPEAT')
        : this.translate.instant('MOVEMENT_DELETE_ALERT_HEADER_TEXT');
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: this.translate.instant('MOVEMENT_DELETE_ALERT_CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.translate.instant('MOVEMENT_DELETE_ALERT_CONFIRM'),
          cssClass: 'primary',
          handler: () => {
            this.cleanMovement();
            this.originalMovement = Object.assign({}, this.originalMovement, movement);
            this.deletedMovement.next(this.originalMovement);
          }
        }
      ]
    });

    await alert.present();
  }

}
