import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from "ngx-currency";

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { AddPage } from './add.page';
import { AddModal } from './add.modal';
import { AddPageRoutingModule } from './add.router.module';
import { ComponentsModule } from './../../components/components.module';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  entryComponents: [
    AddPage,
    AddModal
  ],
  declarations: [
    AddPage,
    AddModal
  ],
  imports: [
    AddPageRoutingModule,
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
    AddPage,
    AddModal
  ]
})
export class AddPageModule { }
