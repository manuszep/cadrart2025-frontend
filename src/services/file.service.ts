import { Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICadrartFileResponse } from '@manuszep/cadrart2025-common';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'any' })
export class CadrartFileService {
  constructor(public http: HttpClient) {}

  upload(image: File, name: string, category: string): Observable<ICadrartFileResponse> {
    const formData: FormData = new FormData();

    formData.append('file', image, `${name}`);
    formData.append('category', category);

    return this.http.post<ICadrartFileResponse>(`${environment.apiUrl}image/${category}`, formData).pipe(take(1));
  }

  delete(category: string, name: string): Observable<ICadrartFileResponse> {
    return this.http
      .delete<ICadrartFileResponse>(
        `${environment.apiUrl}image/${encodeURIComponent(category)}/${encodeURIComponent(name)}`
      )
      .pipe(take(1));
  }
}
