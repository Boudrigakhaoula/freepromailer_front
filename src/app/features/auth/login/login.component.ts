import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
<div class="login-page">
  <div class="login-bg-blob left"></div>
  <div class="login-bg-blob right"></div>

  <div class="login-card">
    <div class="login-logo">
      <div class="login-logo-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h1>FreeProMailer</h1>
      <p>Connectez-vous pour gérer vos campagnes</p>
    </div>

    <form (ngSubmit)="login()" class="login-form">
      <div class="form-group">
        <label class="form-label">Email Professionnel</label>
        <div class="input-wrap">
          <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <input type="email" [(ngModel)]="email" name="email" placeholder="nom@entreprise.com" class="form-input with-icon" />
        </div>
      </div>

      <div class="form-group">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <label class="form-label">Mot de passe</label>
          <button type="button" class="link-btn">Oublié ?</button>
        </div>
        <div class="input-wrap">
          <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••••••" class="form-input with-icon" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:1rem">
        Se connecter
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </form>

    <div class="login-divider"><div class="div-line"></div><span>Ou continuer avec</span><div class="div-line"></div></div>

    <div class="oauth-grid">
      <button class="oauth-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
        Google
      </button>
      <button class="oauth-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        GitHub
      </button>
    </div>

    <p class="login-footer">
      Pas encore de compte ? <button class="link-btn">Créer un compte gratuitement</button>
    </p>
  </div>
</div>
  `,
  styles: [`
    .login-page { min-height: 100vh; background: var(--color-surface); display: flex; align-items: center; justify-content: center; padding: 1.5rem; position: relative; overflow: hidden; }
    .login-bg-blob { position: absolute; width: 40%; height: 40%; border-radius: 50%; filter: blur(120px); pointer-events: none;
      &.left  { top: -10%; left: -10%; background: rgba(0,74,198,.05); }
      &.right { bottom: -10%; right: -10%; background: rgba(0,108,73,.05); }
    }
    .login-card { background: var(--color-surface-container-lowest); border-radius: 1.5rem; padding: 2.5rem; box-shadow: 0 25px 60px rgba(0,0,0,.08); border: 1px solid rgba(195,198,215,.1); width: 100%; max-width: 28rem; position: relative; z-index: 1; }
    .login-logo { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 2.5rem;
      h1 { font-size: 1.875rem; font-weight: 900; font-family: var(--font-headline); letter-spacing: -.025em; margin: 1rem 0 .5rem; }
      p  { color: var(--color-on-surface-variant); font-weight: 500; font-size: .875rem; }
    }
    .login-logo-icon { width: 4rem; height: 4rem; background: var(--color-primary); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 8px 24px rgba(0,74,198,.25); }
    .login-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .input-wrap { position: relative; }
    .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--color-on-surface-variant); pointer-events: none; }
    .form-input.with-icon { padding-left: 3rem; }
    .login-divider { display: flex; align-items: center; gap: 1rem; margin: 2rem 0;
      .div-line { flex: 1; height: 1px; background: rgba(195,198,215,.3); }
      span { font-size: .625rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--color-on-surface-variant); white-space: nowrap; }
    }
    .oauth-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .oauth-btn { display: flex; align-items: center; justify-content: center; gap: .5rem; padding: .75rem 1rem; border-radius: .75rem; border: 1px solid rgba(195,198,215,.3); background: none; cursor: pointer; font-size: .875rem; font-weight: 700; color: var(--color-on-surface); transition: background .15s;
      &:hover { background: var(--color-surface-container-low); }
    }
    .login-footer { margin-top: 2.5rem; text-align: center; font-size: .75rem; color: var(--color-on-surface-variant); }
    .link-btn { background: none; border: none; cursor: pointer; color: var(--color-primary); font-size: inherit; font-weight: 700; &:hover { text-decoration: underline; } }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  authSvc = inject(AuthService);

  login() { this.authSvc.login(this.email, this.password); }
}
