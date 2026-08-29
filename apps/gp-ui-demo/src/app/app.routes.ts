import { Routes } from '@angular/router';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { ThemingPageComponent } from './pages/theming/theming.component';
import { GpCssPageComponent } from './pages/gp-css/gp-css.component';
import { I18nPageComponent } from './pages/i18n/i18n.component';
import { ComponentDocPageComponent } from './pages/component-docs/component-doc-page.component';
import { BlocksPageComponent } from './pages/blocks/blocks.component';
import { BlocksPlaygroundPageComponent } from './pages/blocks/blocks-playground.component';
import { GridDemoComponent } from './pages/grid/grid-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'docs', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'blocks', component: BlocksPageComponent },
  { path: 'blocks-playground', component: BlocksPlaygroundPageComponent },
  { path: 'theming', component: ThemingPageComponent },
  { path: 'gp-css', component: GpCssPageComponent },
  { path: 'i18n', component: I18nPageComponent },
  { path: 'grid', component: GridDemoComponent },
  { path: 'component/grid', component: GridDemoComponent },
  { path: 'component/:component', component: ComponentDocPageComponent },
  { path: '**', redirectTo: 'getting-started' }
];
