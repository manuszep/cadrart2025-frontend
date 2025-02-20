import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { CadrartAppComponent } from './app/app.component';

bootstrapApplication(CadrartAppComponent, appConfig).catch((err) => console.error(err));
