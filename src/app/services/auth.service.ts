import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'fpm_token';
  isLoggedIn = signal(true); // demo: always logged in

  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) ?? 'demo_token';
  }

  login(email: string, password: string): void {
    localStorage.setItem(this.TOKEN_KEY, 'demo_token');
    this.isLoggedIn.set(true);
    this.router.navigate(['/']);
  }

  register(email: string, password: string): void {
    this.login(email, password);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
