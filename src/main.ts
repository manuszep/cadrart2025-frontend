import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { appConfig } from './app/app.config';
import { CadrartAppComponent } from './app/app.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'i18n/');
}

bootstrapApplication(CadrartAppComponent, appConfig).catch((err) => console.error(err));
