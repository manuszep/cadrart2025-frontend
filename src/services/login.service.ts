import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ICadrartConnectedUser, ICadrartIsLoggedInResponse, ICadrartLoginResponse } from '@manuszep/cadrart2025-common';

import { getEndpointUrl } from '../utils/url';
import { CadrartNavigationService } from '../components/navigation/navigation.service';
import { CadrartHeaderService } from '../components/header/header.service';

import { AuthenticatedSocketService } from './authenticated-socket.service';

@Injectable({
  providedIn: 'root'
})
export class CadrartLoginService {
  private connected = false;

  public connectedUser: WritableSignal<ICadrartConnectedUser | null> = signal(null);
  private socketService = inject(AuthenticatedSocketService);

  constructor(
    private readonly http: HttpClient,
    private readonly navigationService: CadrartNavigationService,
    private readonly headerService: CadrartHeaderService,
    private readonly router: Router
  ) {}

  isConnected(): Observable<boolean> {
    const user = localStorage.getItem('connectedUser');

    if (!user) {
      this.logout();
      this.router.navigate(['/login']);
      return of(false);
    }

    const parsedUser = JSON.parse(user) as ICadrartConnectedUser;

    return (
      this.http.get(getEndpointUrl(`isLoggedIn/${parsedUser.id}`)) as Observable<ICadrartIsLoggedInResponse>
    ).pipe(
      map((result: ICadrartIsLoggedInResponse) => {
        const isLoggedIn = result.statusCode === 200;

        if (!isLoggedIn) {
          this.logout();
          this.router.navigate(['/login']);
        } else {
          this.connectedUser.set(result.user ?? null);
          this.enableInterface();
          this.connected = true;

          // Connect to WebSocket if not already connected
          this.socketService.connect();
        }

        return isLoggedIn;
      }),
      catchError(() => {
        this.logout();
        this.router.navigate(['/login']);

        return [false];
      })
    );
  }

  login(mail: string, password: string): Observable<boolean> {
    return (this.http.post(getEndpointUrl('login'), { mail, password }) as Observable<ICadrartLoginResponse>).pipe(
      map((result: ICadrartLoginResponse | boolean) => {
        if (typeof result === 'boolean' || !result.user || result.statusCode !== 200) {
          this.disableInterface();
          this.connected = false;

          return false;
        }

        this.connectedUser.set(result.user);
        localStorage.setItem('connectedUser', JSON.stringify(result.user));

        this.enableInterface();
        this.connected = true;

        // Connect to WebSocket after successful login
        this.socketService.connect();

        this.router.navigate(['/offers']);

        return true;
      })
    );
  }

  logout(): void {
    // logout
    this.connectedUser.set(null);
    this.connected = false;
    localStorage.removeItem('connectedUser');

    // Disconnect from WebSocket on logout
    this.socketService.disconnect();

    this.disableInterface();
  }

  public disableInterface(): void {
    this.navigationService.enabled.set(false);
    this.headerService.clearNavigation();
    this.headerService.setAction(null);
  }

  public enableInterface(): void {
    this.navigationService.enabled.set(true);
  }
}
