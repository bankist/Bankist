import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from "ngx-currency";

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { MovementsPage } from './movements.page';
import { MovementsPageRoutingModule } from './movements.router.module';
import { ComponentsModule } from './../../components/components.module';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    MovementsPage
  ],
  imports: [
    MovementsPageRoutingModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    NgxCurrencyModule,
    TranslateModule.forChild(),
  ],
  exports: [
    MovementsPage
  ]
})
export class MovementsPageModule { }
