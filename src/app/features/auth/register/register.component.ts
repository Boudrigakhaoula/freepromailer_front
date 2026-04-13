import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
<div class="register-page">
  <div class="register-bg-blob left"></div>
  <div class="register-bg-blob right"></div>

  <div class="register-card">
    <div class="register-logo">
      <div class="register-logo-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h1>Créer un compte</h1>
      <p>Rejoignez FreeProMailer en quelques secondes</p>
    </div>

    <form [formGroup]="registerForm" (ngSubmit)="submit()" class="register-form" novalidate>
      <div class="name-grid">
        <div class="form-group">
          <label class="form-label" for="firstName">Prénom</label>
          <div class="input-wrap" [class.invalid]="isInvalid('firstName')">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input id="firstName" type="text" formControlName="firstName" placeholder="Jean" class="form-input with-icon" />
          </div>
          @if (isInvalid('firstName')) {
            <p class="error-text">Le prénom est requis</p>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="lastName">Nom</label>
          <div class="input-wrap" [class.invalid]="isInvalid('lastName')">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input id="lastName" type="text" formControlName="lastName" placeholder="Dupont" class="form-input with-icon" />
          </div>
          @if (isInvalid('lastName')) {
            <p class="error-text">Le nom est requis</p>
          }
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <div class="input-wrap" [class.invalid]="isInvalid('email')">
          <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <input id="email" type="email" formControlName="email" placeholder="nom@entreprise.com" class="form-input with-icon" />
        </div>
        @if (isInvalid('email')) {
          <p class="error-text">Veuillez saisir un email valide</p>
        }
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Mot de passe</label>
        <div class="input-wrap" [class.invalid]="isInvalid('password')">
          <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <input id="password" [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="Minimum 6 caractères" class="form-input with-icon with-toggle" />
          <button type="button" class="toggle-btn" (click)="togglePassword()" [attr.aria-label]="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
            @if (!showPassword) {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.77 21.77 0 0 1 5.06-6.94"/><path d="M9.9 4.24A10.93 10.93 0 0 1 12 4c7 0 11 8 11 8a22.14 22.14 0 0 1-3.17 4.87"/><path d="M1 1l22 22"/></svg>
            }
          </button>
        </div>
        @if (isInvalid('password')) {
          <p class="error-text">Le mot de passe doit contenir au moins 6 caractères</p>
        }
      </div>

      <button type="submit" class="btn btn-primary register-btn" [disabled]="isSubmitting">
        @if (isSubmitting) {
          <span class="spinner" aria-hidden="true"></span>
          Inscription en cours...
        } @else {
          S'inscrire
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        }
      </button>
    </form>

    <p class="register-footer">
      Vous avez déjà un compte ?
      <a routerLink="/login" class="link-btn">Se connecter</a>
    </p>
  </div>
</div>
  `,
  styles: [`
    .register-page { min-height: 100vh; background: var(--color-surface); display: flex; align-items: center; justify-content: center; padding: 1.5rem; position: relative; overflow: hidden; }
    .register-bg-blob { position: absolute; width: 42%; height: 42%; border-radius: 50%; filter: blur(120px); pointer-events: none;
      &.left  { top: -10%; left: -10%; background: rgba(0,74,198,.06); }
      &.right { bottom: -10%; right: -10%; background: rgba(0,108,73,.06); }
    }
    .register-card { background: var(--color-surface-container-lowest); border-radius: 1.5rem; padding: 2rem; box-shadow: 0 25px 60px rgba(0,0,0,.08); border: 1px solid rgba(195,198,215,.1); width: 100%; max-width: 34rem; position: relative; z-index: 1; animation: cardIn .35s ease-out; }
    .register-logo { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 2rem;
      h1 { font-size: 1.75rem; font-weight: 900; font-family: var(--font-headline); letter-spacing: -.025em; margin: 1rem 0 .5rem; }
      p  { color: var(--color-on-surface-variant); font-weight: 500; font-size: .875rem; }
    }
    .register-logo-icon { width: 3.75rem; height: 3.75rem; background: var(--color-primary); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 8px 24px rgba(0,74,198,.25); }
    .register-form { display: flex; flex-direction: column; gap: 1rem; }
    .name-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .input-wrap { position: relative; border-radius: .5rem; transition: transform .15s ease, box-shadow .15s ease; }
    .input-wrap:focus-within { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,74,198,.08); }
    .input-wrap.invalid .form-input { box-shadow: 0 0 0 2px rgba(186,26,26,.2); }
    .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--color-on-surface-variant); pointer-events: none; }
    .form-input.with-icon { padding-left: 3rem; }
    .form-input.with-toggle { padding-right: 3rem; }
    .toggle-btn { position: absolute; top: 50%; right: .5rem; transform: translateY(-50%); border: none; background: none; color: var(--color-on-surface-variant); width: 2rem; height: 2rem; display: inline-flex; align-items: center; justify-content: center; border-radius: .5rem; cursor: pointer; transition: background .15s, color .15s;
      &:hover { background: var(--color-surface-container); color: var(--color-primary); }
    }
    .error-text { color: var(--color-error); font-size: .75rem; margin-top: .25rem; font-weight: 600; }
    .register-btn { width: 100%; justify-content: center; padding: 1rem; margin-top: .5rem; transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
      &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(0,74,198,.23); }
      &:disabled { opacity: .85; cursor: not-allowed; }
    }
    .spinner { width: 1rem; height: 1rem; border-radius: 50%; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; animation: spin .7s linear infinite; }
    .register-footer { margin-top: 1.5rem; text-align: center; font-size: .8rem; color: var(--color-on-surface-variant); }
    .link-btn { color: var(--color-primary); font-weight: 700; margin-left: .35rem; transition: opacity .2s;
      &:hover { opacity: .85; text-decoration: underline; }
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(10px) scale(.985); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (max-width: 640px) {
      .register-card { padding: 1.5rem; border-radius: 1.25rem; }
      .name-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authSvc = inject(AuthService);

  showPassword = false;
  isSubmitting = false;

  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isInvalid(controlName: 'firstName' | 'lastName' | 'email' | 'password'): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.registerForm.invalid || this.isSubmitting) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.registerForm.getRawValue();

    setTimeout(() => {
      this.authSvc.register(email ?? '', password ?? '');
      this.isSubmitting = false;
    }, 900);
  }
}