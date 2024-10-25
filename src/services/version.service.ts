import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getEndpointUrl } from '../utils';

@Injectable({ providedIn: 'root' })
export class CadrartVersionService {
  constructor(private readonly http: HttpClient) {}

  getVersion(): Observable<string> {
    return this.http.get(getEndpointUrl('version'), { responseType: 'text' }) as Observable<string>;
  }
}
