import { Routes } from '@angular/router';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { ThemingPageComponent } from './pages/theming/theming.component';
import { I18nPageComponent } from './pages/i18n/i18n.component';
import { ComponentDocPageComponent } from './pages/component-docs/component-doc-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'docs', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'theming', component: ThemingPageComponent },
  { path: 'i18n', component: I18nPageComponent },
  { path: 'component/:component', component: ComponentDocPageComponent },
  { path: '**', redirectTo: 'getting-started' }
];
