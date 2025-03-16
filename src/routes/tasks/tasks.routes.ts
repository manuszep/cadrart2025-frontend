import { Routes } from '@angular/router';

import { CadrartRouteTasksComponent } from './tasks.component';
import { CadrartRouteTasksWoodComponent } from './wood/wood.component';
import { CadrartRouteTasksCardboardComponent } from './cardboard/cardboard.component';
import { CadrartRouteTasksGlassComponent } from './glass/glass.component';
import { CadrartRouteTasksAssemblyComponent } from './assembly/assembly.component';
import { CadrartRouteTasksPassComponent } from './pass/pass.component';

export const cadrartTasksRoutes: Routes = [
  {
    path: '',
    component: CadrartRouteTasksComponent,
    children: [
      { path: 'wood', component: CadrartRouteTasksWoodComponent },
      { path: 'cardboard', component: CadrartRouteTasksCardboardComponent },
      { path: 'glass', component: CadrartRouteTasksGlassComponent },
      { path: 'assembly', component: CadrartRouteTasksAssemblyComponent },
      { path: 'pass', component: CadrartRouteTasksPassComponent }
    ]
  }
];
