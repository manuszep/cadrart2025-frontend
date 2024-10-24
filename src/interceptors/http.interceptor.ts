import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { CadrartLoginService } from '../services/login.service';

@Injectable()
export class CadrartAuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private readonly loginService: CadrartLoginService) {}

  private handleAuthError(err: HttpErrorResponse | HttpEvent<unknown>): void {
    if ((err as HttpErrorResponse).url?.endsWith('login')) {
      return;
    }

    if ((err as HttpErrorResponse).status === 401 || (err as HttpErrorResponse).status === 403) {
      this.router.navigateByUrl(`/login`);
      this.loginService.disableInterface();
    }

    return;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    req = req.clone({
      withCredentials: true
    });

    return next.handle(req).pipe(
      tap((x) => {
        this.handleAuthError(x);

        return x;
      })
    );
  }
}
