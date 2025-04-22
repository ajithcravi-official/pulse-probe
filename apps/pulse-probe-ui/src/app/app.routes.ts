import { Route } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { loginGuard } from './guard/login.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  // Application layout route (post-login)
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/application/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/application/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
