import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/checkout-page/checkout-page.component')
      .then(m => m.CheckoutPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
