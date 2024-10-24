import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, take } from 'rxjs';
import { ICadrartOffer } from '@manuszep/cadrart2025-common';

import { CadrartOfferService } from '../../../services/offer.service';

export const CadrartRouteOfferViewResolver: ResolveFn<ICadrartOffer> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  service: CadrartOfferService = inject(CadrartOfferService)
): Observable<ICadrartOffer> => service.getEntity(route.paramMap.get('id') as string).pipe(take(1));
