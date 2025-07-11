import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { cadrartVersion as frontendVersion } from '../version';

export interface IVersionInfo {
  version: string;
  color: string;
  environment: string;
  timestamp: string;
  frontendVersion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CadrartVersionService {
  constructor(private http: HttpClient) {}

  getVersion(): Observable<string> {
    return this.http.get('/api/version', { responseType: 'text' });
  }

  getVersionInfo(): Observable<IVersionInfo> {
    return this.http
      .get<IVersionInfo>('/api/version/info')
      .pipe(map((info: IVersionInfo) => ({ ...info, frontendVersion })));
  }
}
