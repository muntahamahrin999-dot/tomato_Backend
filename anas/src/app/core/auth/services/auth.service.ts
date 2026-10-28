import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

export interface User {
  name: string;
  email: string;
  phone?: string;
  role: string;
  username?: string;
  token?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  name: string;
  role: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly CURRENT_USER_KEY = 'tomatoCurrentUser';
  private readonly TOKEN_KEY = 'tomatoAuthToken';

  private readonly signinUrl = API_CONFIG.endpoints.auth.signin;
  private readonly signupUrl = API_CONFIG.endpoints.auth.signup;

  constructor(private http: HttpClient) {}

  // =====================================================
  // REGISTER (Live API)
  // =====================================================
  register(
    name: string,
    email: string,
    phone: string,
    password: string,
    role: string
  ): Observable<AuthResponse> {
    const payload = {
      name,
      email,
      phone,
      password,
      role: this.normalizeRoleForBackend(role)
    };

    return this.http.post<AuthResponse>(this.signupUrl, payload).pipe(
      tap((res) => {
        this.saveAuthSession(res);
      })
    );
  }

  // =====================================================
  // LOGIN (Live API)
  // =====================================================
  login(email: string, password: string): Observable<AuthResponse> {
    const payload = {
      email,
      username: email,
      password
    };

    return this.http.post<AuthResponse>(this.signinUrl, payload).pipe(
      tap((res) => {
        this.saveAuthSession(res);
      })
    );
  }

  // =====================================================
  // SAVE SESSION
  // =====================================================
  private saveAuthSession(res: AuthResponse): void {
    if (typeof window === 'undefined') {
      return;
    }

    const normalizedRole = this.normalizeRoleForFrontend(res.role || (res.roles && res.roles[0]) || 'customer');

    const currentUser: User = {
      name: res.name || res.username,
      email: res.email,
      username: res.username,
      role: normalizedRole,
      token: res.token
    };

    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(currentUser));
  }

  // =====================================================
  // LOGOUT
  // =====================================================
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // =====================================================
  // CHECK LOGIN
  // =====================================================
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // =====================================================
  // GET TOKEN
  // =====================================================
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // =====================================================
  // GET CURRENT USER
  // =====================================================
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Helper mappings
  private normalizeRoleForFrontend(backendRole: string): string {
    const upper = (backendRole || '').toUpperCase();
    if (upper.includes('ADMIN')) return 'admin';
    if (upper.includes('RESTAURANT')) return 'restaurant';
    if (upper.includes('RIDER')) return 'rider';
    return 'customer';
  }

  private normalizeRoleForBackend(frontendRole: string): string {
    const lower = (frontendRole || '').toLowerCase();
    if (lower === 'admin') return 'admin';
    if (lower === 'restaurant') return 'restaurant';
    if (lower === 'rider') return 'rider';
    return 'customer';
  }
}