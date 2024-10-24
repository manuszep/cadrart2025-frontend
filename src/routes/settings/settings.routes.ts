import { Routes } from '@angular/router';

export const cadrartSettingsRoutes: Routes = [
  {
    path: 'articles',
    loadComponent: () => import('./article/article.component').then((m) => m.CadrartRouteSettingsArticleComponent)
  },
  {
    path: 'clients',
    loadComponent: () => import('./client/client.component').then((m) => m.CadrartRouteSettingsClientComponent)
  },
  {
    path: 'formulas',
    loadComponent: () => import('./formula/formula.component').then((m) => m.CadrartRouteSettingsFormulaComponent)
  },
  {
    path: 'locations',
    loadComponent: () => import('./location/location.component').then((m) => m.CadrartRouteSettingsLocationComponent)
  },
  {
    path: 'providers',
    loadComponent: () => import('./provider/provider.component').then((m) => m.CadrartRouteSettingsProviderComponent)
  },
  {
    path: 'tags',
    loadComponent: () => import('./tag/tag.component').then((m) => m.CadrartRouteSettingsTagComponent)
  },
  {
    path: 'team-members',
    loadComponent: () =>
      import('./team-member/team-member.component').then((m) => m.CadrartRouteSettingsTeamMemberComponent)
  }
];
