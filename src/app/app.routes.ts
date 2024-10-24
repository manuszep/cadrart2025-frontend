import { Routes } from '@angular/router';
import { cadrartSettingsRoutes } from '../routes/settings/settings.routes';
import { cadrartAuthGuard } from '../guards/guard.service';
import { CadrartRouteOfferViewResolver } from '../routes/offer/view/offer-view.resolver';

export const cadrartRoutes: Routes = [
  {
    path: '',
    redirectTo: 'offers',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    loadComponent: () => import('../routes/settings/settings.component').then((m) => m.CadrartRouteSettingsComponent),
    children: cadrartSettingsRoutes,
    canActivate: [cadrartAuthGuard],
    canActivateChild: [cadrartAuthGuard]
  },
  {
    path: 'offer/new',
    loadComponent: () =>
      import('../routes/offer/form/offer-form.component').then((m) => m.CadrartRouteOfferFormComponent),
    canActivate: [cadrartAuthGuard],
    canActivateChild: [cadrartAuthGuard]
  },
  {
    path: 'offer/:id',
    loadComponent: () =>
      import('../routes/offer/view/offer-view.component').then((m) => m.CadrartRouteOfferViewComponent),
    canActivate: [cadrartAuthGuard],
    canActivateChild: [cadrartAuthGuard],
    resolve: { offer: CadrartRouteOfferViewResolver }
  },
  {
    path: 'offer/:id/edit',
    loadComponent: () =>
      import('../routes/offer/form/offer-form.component').then((m) => m.CadrartRouteOfferFormComponent),
    canActivate: [cadrartAuthGuard],
    canActivateChild: [cadrartAuthGuard]
  },
  {
    path: 'offers',
    loadComponent: () =>
      import('../routes/offer/list/offer-list.component').then((m) => m.CadrartRouteOfferListComponent),
    canActivate: [cadrartAuthGuard],
    canActivateChild: [cadrartAuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('../routes/login/login.component').then((m) => m.CadrartRouteLoginComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('../routes/tasks/tasks.component').then((m) => m.CadrartRouteTasksComponent)
  }
];
