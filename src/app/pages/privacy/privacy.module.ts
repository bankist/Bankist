import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from "ngx-currency";

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { PrivacyPage } from './privacy.page';
import { PrivacyPageRoutingModule } from './privacy.router.module';
import { ComponentsModule } from './../../components/components.module';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    PrivacyPage
  ],
  imports: [
    PrivacyPageRoutingModule,
    TranslateModule.forChild(),
    IonicStorageModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    ComponentsModule,
    IonicModule,
    CommonModule,
    PipesModule
  ],
  exports: [
    PrivacyPage
  ]
})
export class PrivacyPageModule { }
