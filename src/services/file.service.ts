import { Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

export interface FileResponseInterface {
  statusCode: number;
  file: string;
}

@Injectable({ providedIn: 'any' })
export class CadrartFileService {
  constructor(public http: HttpClient) {}

  upload(image: File, name: string, category: string): Observable<FileResponseInterface> {
    const formData: FormData = new FormData();

    formData.append('file', image, `${name}`);
    formData.append('category', category);

    return this.http.post<FileResponseInterface>(`${environment.apiUrl}image/${category}`, formData).pipe(take(1));
  }

  delete(category: string, name: string): Observable<FileResponseInterface> {
    return this.http
      .delete<FileResponseInterface>(
        `${environment.apiUrl}image/${encodeURIComponent(category)}/${encodeURIComponent(name)}`
      )
      .pipe(take(1));
  }
}
