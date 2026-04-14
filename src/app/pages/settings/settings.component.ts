import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserProfileResponse, UserProfileRequest, ChangePasswordRequest } from '../../models/auth.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  active = signal('profile');

  // Données utilisateur
  currentProfile: UserProfileResponse | null = null;
  isLoading = false;
  profileSuccessMessage = '';
  profileErrorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  // Forms
  profileForm: FormGroup;
  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  sections = [
    { id: 'profile', label: 'Profil & Compte', desc: 'Informations personnelles', 
      iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { id: 'security', label: 'Sécurité', desc: 'Changer le mot de passe ', 
      iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  ];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment && this.sections.some(s => s.id === fragment)) {
        this.active.set(fragment);
      } else {
        // Si pas de fragment ou fragment invalide, afficher 'profile' par défaut
        this.active.set('profile');
      }
    });
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.authService.getMyProfile().subscribe({
      next: (profile) => {
        this.currentProfile = profile;
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email
        });
        this.profileErrorMessage = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement profil', err);
        this.profileErrorMessage = 'Impossible de charger votre profil';
        this.isLoading = false;
      }
    });
  }

  // ====================== MISE À JOUR PROFIL ======================
  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';
    const req: UserProfileRequest = this.profileForm.value;

    this.authService.updateMyProfile(req).subscribe({
      next: (updatedProfile) => {
        this.currentProfile = updatedProfile;
        this.authService.refreshCurrentUser().subscribe({
          next: () => {
            this.profileSuccessMessage = 'Profil modifié avec succès !';
            this.isLoading = false;
            setTimeout(() => this.profileSuccessMessage = '', 3000);
          },
          error: () => {
            this.profileSuccessMessage = 'Profil modifié avec succès !';
            this.isLoading = false;
            setTimeout(() => this.profileSuccessMessage = '', 3000);
          }
        });
      },
      error: (err) => {
        this.profileSuccessMessage = '';
        this.profileErrorMessage = err.error?.message || 'Erreur lors de la mise à jour';
        this.isLoading = false;
      }
    });
  }

  // ====================== CHANGEMENT DE MOT DE PASSE ======================
  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const req: ChangePasswordRequest = this.passwordForm.value;

    if (req.newPassword !== req.confirmPassword) {
      this.passwordSuccessMessage = '';
      this.passwordErrorMessage = 'Les nouveaux mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    this.authService.changePassword(req).subscribe({
      next: () => {
        this.passwordSuccessMessage = 'Mot de passe changé avec succès !';
        this.passwordForm.reset();
        this.isLoading = false;
        setTimeout(() => this.passwordSuccessMessage = '', 3000);
      },
      error: (err) => {
        this.passwordSuccessMessage = '';
        this.passwordErrorMessage = err.error?.message || 'Erreur lors du changement de mot de passe';
        this.isLoading = false;
      }
    });
  }

  // Helper pour les erreurs de formulaire
  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  clearProfileForm(): void {
    this.profileForm.reset({
      firstName: '',
      lastName: '',
      email: ''
    });
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';
  }

  getProfileError(controlName: 'firstName' | 'lastName' | 'email'): string {
    const control = this.profileForm.get(controlName);

    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return '';
    }

    if (control.errors['required']) {
      return 'Ce champ est obligatoire';
    }

    if (controlName === 'email' && control.errors['email']) {
      return 'Adresse email invalide';
    }

    return 'Valeur invalide';
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
      return;
    }

    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
      return;
    }

    this.showConfirmPassword = !this.showConfirmPassword;
  }
}