import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  UserProfileResponse,
  UserProfileRequest,
  ChangePasswordRequest,
  ApiResponse
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'token';
  private readonly currentUserKey = 'current_user';

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

register(req: RegisterRequest): Observable<AuthResponse> {
  return this.http.post<ApiResponse<AuthResponse>>(
    `${environment.userApi}/api/auth/register`, req
  ).pipe(
    map(res => res.data),
    tap(user => this.setCurrentUser(user))
  );
}

login(req: LoginRequest): Observable<AuthResponse> {
  return this.http.post<ApiResponse<AuthResponse>>(
    `${environment.userApi}/api/auth/login`, req
  ).pipe(
    map(res => res.data),
    tap(user => this.setCurrentUser(user))
  );
}

getMyProfile(): Observable<UserProfileResponse> {
  return this.http.get<ApiResponse<UserProfileResponse>>(
    `${environment.userApi}/api/profile/me`
  ).pipe(map(res => res.data));
}

updateMyProfile(req: UserProfileRequest): Observable<UserProfileResponse> {
  return this.http.put<ApiResponse<UserProfileResponse>>(
    `${environment.userApi}/api/profile/me`, req
  ).pipe(map(res => res.data));
}

  changePassword(req: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${environment.userApi}/api/profile/change-password`, req);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  refreshCurrentUser(): Observable<UserProfileResponse> {
    return this.getMyProfile().pipe(
      tap(profile => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser: AuthResponse = {
            ...currentUser,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            role: profile.role
          };
          this.setCurrentUser(updatedUser);
        }
      })
    );
  }

  private setCurrentUser(user: AuthResponse): void {
    localStorage.setItem(this.tokenKey, user.token);
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadCurrentUser(): AuthResponse | null {
    const rawUser = localStorage.getItem(this.currentUserKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthResponse;
    } catch {
      localStorage.removeItem(this.currentUserKey);
      return null;
    }
  }
}