import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from "ngx-currency";

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { SettingsPage } from './settings.page';
import { SettingsPageRoutingModule } from './settings.router.module';
import { ComponentsModule } from './../../components/components.module';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  imports: [
    SettingsPageRoutingModule,
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
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
