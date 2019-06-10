import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from "ngx-currency";

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { TabsPageRoutingModule } from './tabs.router.module';
import { AddPageModule } from './../add/add.module';
import { CalendarPageModule } from './../calendar/calendar.module';
import { ComponentsModule } from './../../components/components.module';
import { MovementsPageModule } from './../movements/movements.module';
import { EconomyPageModule } from './../economy/economy.module';
import { TabsPage } from './tabs.page';
import { WalletPageModule } from './../wallet/wallet.module';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    TabsPage
  ],
  imports: [
    TabsPageRoutingModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    NgxCurrencyModule,
    TranslateModule.forChild(),
    AddPageModule,
    CalendarPageModule,
    EconomyPageModule,
    MovementsPageModule,
    WalletPageModule,
  ],
  exports: [
    TabsPage,
  ]
})
export class TabsPageModule { }
