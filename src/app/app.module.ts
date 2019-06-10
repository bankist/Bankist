import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, RouteReuseStrategy } from '@angular/router';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEn);
registerLocaleData(localeEs);

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { IonicStorageModule, Storage } from '@ionic/storage';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { Crashlytics } from '@ionic-native/fabric/ngx';


import { HighchartsChartModule } from 'highcharts-angular';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxCurrencyModule } from "ngx-currency";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ngx-currency/src/currency-mask.config";

import { AppRoutingModule } from './app-routing.module';
import { BankistApp } from './app.component';

import { ComponentsModule } from './components/components.module';

import { DataService } from './providers/data/data';
import { PipesModule } from './pipes/pipes.module';
import * as Shared from './shared';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideData(storage: Storage, secureStorage: SecureStorage, router: Router) {
  return new DataService(storage, secureStorage, router, {
    uuid: Shared.utilsGetUuid(),
    currency: 'USD',
    wallets: []
  });
}

import { CURRENCY_OPTIONS } from './shared/defs';
let currencyMaskConfig: CurrencyMaskConfig = CURRENCY_OPTIONS;
let currency = localStorage.getItem('currency');
if(currency=='€') currencyMaskConfig.suffix = ' €';
else currencyMaskConfig.prefix = '$ ';
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = currencyMaskConfig;


@NgModule({
  declarations: [BankistApp],
  entryComponents: [],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot({
      mode: 'md',
      rippleEffect: false
    }), 
    IonicStorageModule.forRoot({
      name: '__mybankist',
      driverOrder: ['localstorage', 'indexeddb', 'sqlite', 'websql']
    }),
    AppRoutingModule,
    PipesModule,
    ComponentsModule
  ],
  providers: [
    HighchartsChartModule,
    StatusBar,
    SplashScreen,
    FingerprintAIO,
    File,
    FileOpener,
    SecureStorage,
    Clipboard,
    Globalization,
    Crashlytics,
    { provide: DataService, useFactory: provideData, deps: [Storage, SecureStorage, Router] },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  bootstrap: [BankistApp]
})
export class AppModule {}
