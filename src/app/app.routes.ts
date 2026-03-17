import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/login-page.component';
import { CategoriasPageComponent } from './features/categorias/categorias-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { ShellComponent } from './features/layout/shell.component';
import { OrdensPageComponent } from './features/ordens/ordens-page.component';
import { ProdutosPageComponent } from './features/produtos/produtos-page.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'ordens-producao', component: OrdensPageComponent },
      { path: 'produtos', component: ProdutosPageComponent },
      { path: 'categorias', component: CategoriasPageComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
