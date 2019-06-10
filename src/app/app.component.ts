import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

import { TranslateService } from '@ngx-translate/core';

import { DataService } from './providers/data/data';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class BankistApp {
  isReady: boolean = false;
  langs = ['es', 'en'];
  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public translate: TranslateService,
    public dataService: DataService,
    public globalization: Globalization
  ) {
    platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#4a2458');
      this.splashScreen.hide();
      this.dataService.loadBanking().then(()=>{
        this.globalization.getPreferredLanguage()
          .then(res => {
            let language;
            if(res && res.value) language = res.value.substring(0,2);
            if(!language || this.langs.indexOf(language)===-1) language = 'es';
            this.initTranslate(language)
          }) 
          .catch(e => this.initTranslate('en'));
      })
    });
  }

  initTranslate(language) {
    this.dataService.getBanking('language').then((lang) => {
      if (lang) language = lang;
      // Load last used language
      if(language=='es') this.translate.use('en');
      else this.translate.use('es');
      this.translate.use(language);
      this.dataService.changeLanguage(language);
      this.dataService.initCurrency(language);
      setTimeout(()=>{
        this.isReady = true;
      }, 250)
    })
  }
}
