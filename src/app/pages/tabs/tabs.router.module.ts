import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { WalletPage } from './../wallet/wallet.page';
import { MovementsPage } from './../movements/movements.page';
import { AddPage } from './../add/add.page';
import { CalendarPage } from './../calendar/calendar.page';
import { EconomyPage } from './../economy/economy.page';

import { DataService } from './../../providers/data/data';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'wallet',
        children: [
          {
            path: '',
            loadChildren: '../wallet/wallet.module#WalletPageModule'
          }
        ]
      },{
        path: 'movements',
        children: [
          {
            path: '',
            loadChildren: '../movements/movements.module#MovementsPageModule'
          }
        ]
      },{
        path: 'add',
        children: [
          {
            path: '',
            loadChildren: '../add/add.module#AddPageModule'
          }
        ]
      },{
        path: 'calendar',
        children: [
          {
            path: '',
            loadChildren: '../calendar/calendar.module#CalendarPageModule'
          }
        ]
      },{
        path: 'economy',
        children: [
          {
            path: '',
            loadChildren: '../economy/economy.module#EconomyPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/wallet',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/wallet',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
