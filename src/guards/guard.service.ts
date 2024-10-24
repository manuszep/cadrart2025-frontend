import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { CadrartLoginService } from '../services/login.service';

export const cadrartAuthGuard: CanActivateFn = (route, state) => {
  const loginService = inject(CadrartLoginService);

  return loginService.isConnected();
};
