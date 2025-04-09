import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SocketIoModule } from 'ngx-socket-io';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../environments/environment';
import { CadrartAuthInterceptor } from '../interceptors/http.interceptor';
import { CadrartArticleService } from '../services/article.service';
import { CadrartClientService } from '../services/client.service';
import { CadrartFormulaService } from '../services/formula.service';
import { CadrartJobService } from '../services/job.service';
import { CadrartLocationService } from '../services/location.service';
import { CadrartOfferService } from '../services/offer.service';
import { CadrartProviderService } from '../services/provider.service';
import { CadrartTagService } from '../services/tag.service';
import { CadrartTaskService } from '../services/task.service';
import { CadrartTeamMemberService } from '../services/team-member.service';

import { cadrartRoutes } from './app.routes';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'i18n/');
}

const host = window.location.hostname;
const prot = window.location.protocol;
const port = environment.production ? window.location.port : 8001;
const interceptors = [{ provide: HTTP_INTERCEPTORS, useClass: CadrartAuthInterceptor, multi: true }];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(cadrartRoutes),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(cadrartRoutes),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    importProvidersFrom(SocketIoModule.forRoot({ url: `${prot}//${host}:${port}`, options: { path: '/ws' } })),
    interceptors,
    CadrartArticleService,
    CadrartClientService,
    CadrartFormulaService,
    CadrartJobService,
    CadrartLocationService,
    CadrartOfferService,
    CadrartProviderService,
    CadrartTagService,
    CadrartTaskService,
    CadrartTeamMemberService
  ]
};
