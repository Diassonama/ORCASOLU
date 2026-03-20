import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, UserSession } from '../models/auth.models';
import { Router } from '@angular/router';

const SESSION_KEY = 'sqlflo.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/Auth`;
  private readonly currentSessionSignal = signal<UserSession | null>(this.readStoredSession());

  readonly currentSession = this.currentSessionSignal.asReadonly();

  constructor(private readonly http: HttpClient, private routerCtrl: Router) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((response) => {
        const session: UserSession = {
          token: response.token,
          email: response.email,
          fullName: response.fullName
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this.currentSessionSignal.set(session);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.clear();
    this.currentSessionSignal.set(null);
     this.routerCtrl.navigateByUrl('/login');

  }

  getToken(): string | null {
    return this.currentSessionSignal()?.token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private readStoredSession(): UserSession | null {
    const stored = localStorage.getItem(SESSION_KEY);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as UserSession;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
