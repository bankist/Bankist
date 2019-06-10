import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonSlides } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './../../providers/data/data';

declare var window: any;

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss']
})
export class WelcomePage implements OnInit {
  dir: string = 'ltr';
  initialSlide: boolean = true;
  isCordova: boolean = true;
  sliderOptions = {
    allowTouchMove: false,
    zoom: false,
    autoplay: false
  };
  unlockedIonSlides: number = 1;
  walletName: string = '';
  walletPlaceholder: string = '';
  walletType: string = '';
  @ViewChild('walletNameInput', {read: ElementRef}) walletNameInput: ElementRef;
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(
    public dataService: DataService, 
    public platform: Platform,
    public router: Router, 
    public translate: TranslateService
    ) {
    this.isCordova = this.platform.is('cordova');
  }

  ngOnInit() {
  }

  animateWalletName(name, char?) {
    if(!char) char = 0;
    if(char > name.length) return;
    let walletName = name.substring(0, char);
    this.walletNameInput.nativeElement.value = walletName;
    this.walletName = walletName;
    setTimeout(()=>{
      this.animateWalletName(name, char+1)
    }, Math.floor(Math.random() * 45) + 35
    )
  }

  nextSlide() {
    this.initialSlide = false;
    this.slides.slideNext(250, true);
    this.unlockedIonSlides = this.unlockedIonSlides+1;
    if(this.unlockedIonSlides==3) {
      if(this.walletName!='') return;
      this.walletNameInput.nativeElement.focus()
      this.setPlaceholder();
    }
  }

  changeLanguage(language) {
    this.dataService.changeLanguage(language);
    this.dataService.initCurrency(language);
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }

  setPlaceholder() {
    if(!this.walletName || this.walletName == this.walletPlaceholder) {
      this.translate.get(["WALLET_PLACEHOLDER",
      ]).subscribe(
        (values) => {
          this.walletPlaceholder = values.WALLET_PLACEHOLDER;
          this.animateWalletName(this.walletPlaceholder);
        });
    }
  }

  setWalletType(type) {
    this.walletType = type;
    this.unlockWallet();
  }

  unlockWallet() {
    this.router.navigateByUrl('/code/' + this.walletName + '/' + this.walletType , { skipLocationChange: true });
  }
}
