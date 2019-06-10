import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/identify', pathMatch: 'full' },
  { path: 'identify', loadChildren: './pages/identify/identify.module#IdentifyPageModule' },
  { path: 'code/:wallet', loadChildren: './pages/code/code.module#CodePageModule' },
  { path: 'code/:wallet/:type', loadChildren: './pages/code/code.module#CodePageModule' },
  { path: 'code/:wallet/:type/:next', loadChildren: './pages/code/code.module#CodePageModule' },
  { path: 'tutorial', loadChildren: './pages/tutorial/tutorial.module#TutorialPageModule' },
  { path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'privacy', loadChildren: './pages/privacy/privacy.module#PrivacyPageModule' },
  { path: 'terms', loadChildren: './pages/terms/terms.module#TermsPageModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
