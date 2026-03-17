import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`);
  }

  post<T>(path: string, payload: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, payload);
  }

  put(path: string, payload: unknown): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${path}`, payload);
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${path}`);
  }
}
