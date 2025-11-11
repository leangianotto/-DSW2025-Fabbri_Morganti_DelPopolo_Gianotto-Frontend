import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { finalize } from 'rxjs/operators';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  captchaToken: string | null = null;

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent; // Ajuste aquí

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  // Captcha resuelto
  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  // Reset del captcha
  resetCaptcha() {
    this.captchaToken = null;
    if (this.captchaRef) this.captchaRef.reset();
  }

  onSubmit(): void {
    if (!this.email || !this.password || !this.captchaToken) {
      this.toast.showToast(
        'Debe completar todos los campos y resolver el CAPTCHA.',
        'warning'
      );
      return;
    }

    this.loading = true;

    this.authService
      .login(this.email, this.password, this.captchaToken)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.toast.showToast('Inicio de sesión exitoso.', 'success');
          setTimeout(() => this.router.navigate(['/products']), 1500);
        },
        error: () => {
          // Mostrar error
          this.toast.showToast('Email o contraseña incorrectos.', 'danger');
          // Limpiar el captcha para reintento
          this.resetCaptcha();
        },
      });
  }
}
