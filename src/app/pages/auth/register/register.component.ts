import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.models';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Méthode utilisée dans le HTML
  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const req: RegisterRequest = this.registerForm.value;

    this.authService.register(req)
      .pipe(finalize(() => { this.isSubmitting = false; }))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = this.extractErrorMessage(err);
          console.error(err);
        }
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Helper pour afficher les erreurs dans le template
  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(controlName: 'firstName' | 'lastName' | 'email' | 'password'): string {
    const control = this.registerForm.get(controlName);

    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return '';
    }

    if (control.errors['required']) {
      return 'Ce champ est obligatoire';
    }

    if (controlName === 'email' && control.errors['email']) {
      return 'Veuillez saisir un email valide';
    }

    if ((controlName === 'firstName' || controlName === 'lastName') && control.errors['minlength']) {
      return 'Minimum 2 caractères';
    }

    if (controlName === 'password' && control.errors['minlength']) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }

    return 'Valeur invalide';
  }

  private extractErrorMessage(err: unknown): string {
    const fallback = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';

    if (!err || typeof err !== 'object') {
      return fallback;
    }

    const httpErr = err as { error?: unknown; message?: unknown };
    const payload = httpErr.error;

    if (typeof payload === 'string' && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const obj = payload as { message?: unknown; error?: unknown };

      if (typeof obj.message === 'string' && obj.message.trim()) {
        return obj.message;
      }

      if (typeof obj.error === 'string' && obj.error.trim()) {
        return obj.error;
      }
    }

    if (typeof httpErr.message === 'string' && httpErr.message.trim()) {
      return httpErr.message;
    }

    return fallback;
  }
}