import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',

  styleUrls: ['./register.component.css']})
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