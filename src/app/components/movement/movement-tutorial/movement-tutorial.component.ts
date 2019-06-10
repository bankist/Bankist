import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import * as Shared from './../../../shared';

@Component({
  selector: 'movement-tutorial',
  templateUrl: 'movement-tutorial.component.html',
  styleUrls: ['movement-tutorial.component.scss']
})
export class MovementTutorialComponent implements OnInit {

  amount: number;
  currencies: any;
  currencyOptions: any;
  demoMovements: any;
  infoSlide: boolean = false;
  lastInput: any;
  moreOptions: any;
  movement: any = null;
  movementIndex: number = 0;
  sliderOptions = {
    zoom: false,
    autoplay: false
  };
  stepMovements: any = [];
  visibleDemoMovements: any;
  @Input('currency') currency: any;
  @Output('createdMovements') createdMovements = new EventEmitter();
  @ViewChild(IonSlides) slides: IonSlides;
  constructor(public translate: TranslateService) {
    this.currencies = Shared.CURRENCIES;
    this.currencyOptions = Shared.CURRENCY_OPTIONS;
    this.demoMovements = Shared.DEMO_MOVEMENTS;
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.demoMovements = this.getDemoMovements(Shared.DEMO_MOVEMENTS);
    this.visibleDemoMovements = [this.demoMovements[0]];
    this.amount = this.demoMovements.length ? this.demoMovements[0].amount : 0;
  }

  getDemoMovements(movements) {
    let demoMovements = [];
    for(var mov of movements){
      demoMovements.push(Object.assign(
        {}, 
        mov,
        {
          movementUuid: Shared.utilsGetUuid(),
          from: Shared.getFromDate(mov.from),
          text: this.translate.instant(mov.text),
          concept: this.translate.instant(mov.concept),
          options: mov.decimals ? {precision: 2} : {precision: 0},
        }))
    }
    return demoMovements;
  }

  next(index?) {
    this.slides.isEnd().then((isEnd)=>{
      if(this.demoMovements[index+1]){
        if(isEnd && !this.visibleDemoMovements.filter((m)=>m.movementUuid==this.demoMovements[index+1]).length) {
          this.visibleDemoMovements.push(this.demoMovements[index+1]);
        }
        setTimeout(()=>this.slides.slideNext(250, true), 250)
      }else{
        if(this.infoSlide) {
          this.visibleDemoMovements = this.visibleDemoMovements
          .filter((m)=>!m.skipped)
          .map((m)=>{
            delete m.options;
            return m;
          })
          this.createdMovements.next(this.visibleDemoMovements);
        }else {
          this.infoSlide = true;
          setTimeout(()=>this.slides.slideNext(250, true), 250)
        }
      }
    })
  }

  saveStep(index?) {
    delete this.visibleDemoMovements[index].skipped;
    this.next(index)
  }

  skipStep(index?) {
    this.visibleDemoMovements[index]['skipped'] = true;
    this.next(index)
  }
}
