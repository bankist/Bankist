import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyModule } from "ngx-currency";

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { TermsPage } from './terms.page';
import { TermsPageRoutingModule } from './terms.router.module';
import { ComponentsModule } from './../../components/components.module';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    TermsPage
  ],
  imports: [
    TermsPageRoutingModule,
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
    TermsPage
  ]
})
export class TermsPageModule { }
