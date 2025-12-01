import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  private currentUserSignal = signal<User | null>(this.getStoredUser());
  
  currentUser = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => !!this.currentUserSignal());
  isProvider = computed(() => this.currentUserSignal()?.role === 'PROVIDER');
  isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  
  constructor(private http: HttpClient) {}
  
  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        if (response.success) {
          this.storeAuth(response.data);
        }
      })
    );
  }
  
  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/register`, request).pipe(
      tap(response => {
        if (response.success) {
          this.storeAuth(response.data);
        }
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/me`);
  }
  
  private storeAuth(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
    this.currentUserSignal.set(auth.user);
  }
  
  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}


