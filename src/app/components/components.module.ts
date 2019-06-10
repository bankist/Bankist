import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxCurrencyModule } from "ngx-currency";
import { PipesModule } from './../pipes/pipes.module';

import { AssistantBalanceComponent } from './assistant/assistant-balance/assistant-balance.component';
import { AssistantEssentialComponent } from './assistant/assistant-essential/assistant-essential.component';
import { AssistantProductComponent } from './assistant/assistant-product/assistant-product.component';
import { AssistantRecentComponent } from './assistant/assistant-recent/assistant-recent.component';
import { AssistantSliderComponent } from './assistant/assistant-slider/assistant-slider.component';
import { EconomyAveragesComponent } from './economy/economy-averages/economy-averages.component';
import { EconomyPlansComponent } from './economy/economy-plans/economy-plans.component';
import { EconomyProductsComponent } from './economy/economy-products/economy-products.component';
import { EconomySavingsComponent } from './economy/economy-savings/economy-savings.component';
import { ExporterComponent } from './ui/exporter/exporter.component';
import { HeaderlogoComponent } from './ui/headerlogo/headerlogo.component';
import { ImporterComponent } from './ui/importer/importer.component';
import { LanguageComponent } from './ui/language/language.component';
import { LoadingComponent } from './ui/loading/loading.component';
import { MovementAvoidablesComponent } from './movement/movement-avoidables/movement-avoidables.component';
import { MovementCardComponent } from './movement/movement-card/movement-card.component';
import { MovementChartComponent } from './movement/movement-chart/movement-chart.component';
import { MovementEssentialsComponent } from './movement/movement-essentials/movement-essentials.component';
import { MovementFormComponent } from './movement/movement-form/movement-form.component';
import { MovementInputComponent } from './movement/movement-input/movement-input.component';
import { MovementListComponent } from './movement/movement-list/movement-list.component';
import { MovementMiniComponent } from './movement/movement-mini/movement-mini.component';
import { MovementProductsComponent } from './movement/movement-products/movement-products.component';
import { MovementRelevantsComponent } from './movement/movement-relevants/movement-relevants.component';
import { MovementTutorialComponent } from './movement/movement-tutorial/movement-tutorial.component';
import { NomovsComponent } from './ui/nomovs/nomovs.component';
import { PlanButtonComponent } from './plan/plan-button/plan-button.component';
import { PlanFormComponent } from './plan/plan-form/plan-form.component';
import { PrivacyTextComponent } from './ui/privacy-text/privacy-text.component';
import { StoresComponent } from './ui/stores/stores.component';
import { SummaryComponent } from './ui/summary/summary.component';
import { TermsTextComponent } from './ui/terms-text/terms-text.component';

@NgModule({
  declarations: [
    AssistantBalanceComponent,
    AssistantEssentialComponent,
    AssistantProductComponent,
    AssistantRecentComponent,
    AssistantSliderComponent,
    EconomyAveragesComponent,
    EconomyPlansComponent,
    EconomyProductsComponent,
    EconomySavingsComponent,
    ExporterComponent,
    HeaderlogoComponent,
    ImporterComponent,
    LanguageComponent,
    LoadingComponent,
    MovementAvoidablesComponent,
    MovementCardComponent,
    MovementChartComponent,
    MovementEssentialsComponent,
    MovementFormComponent,
    MovementInputComponent,
    MovementListComponent,
    MovementMiniComponent,
    MovementProductsComponent,
    MovementRelevantsComponent,
    MovementTutorialComponent,
    NomovsComponent,
    PlanButtonComponent,
    PlanFormComponent,
    PrivacyTextComponent,
    StoresComponent,
    SummaryComponent,
    TermsTextComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgxCurrencyModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PipesModule
  ],
  entryComponents: [
    MovementProductsComponent,
    AssistantSliderComponent,
    ExporterComponent,
    ImporterComponent,
    PlanFormComponent,
  ],
  exports: [
    AssistantBalanceComponent,
    AssistantEssentialComponent,
    AssistantProductComponent,
    AssistantRecentComponent,
    AssistantSliderComponent,
    EconomyAveragesComponent,
    EconomyPlansComponent,
    EconomyProductsComponent,
    EconomySavingsComponent,
    ExporterComponent,
    HeaderlogoComponent,
    ImporterComponent,
    LanguageComponent,
    LoadingComponent,
    MovementAvoidablesComponent,
    MovementCardComponent,
    MovementChartComponent,
    MovementEssentialsComponent,
    MovementFormComponent,
    MovementInputComponent,
    MovementListComponent,
    MovementMiniComponent,
    MovementProductsComponent,
    MovementRelevantsComponent,
    MovementTutorialComponent,
    NomovsComponent,
    PlanButtonComponent,
    PlanFormComponent,
    PrivacyTextComponent,
    StoresComponent,
    SummaryComponent,
    TermsTextComponent,
  ]
})
export class ComponentsModule { }
