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

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent;

  blocked = false;        // ⬅️ Bloqueo temporal
  blockSeconds = 0;       // ⬅️ Cuenta regresiva

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  resetCaptcha() {
    this.captchaToken = null;
    if (this.captchaRef) this.captchaRef.reset();
  }

  // ⬅️ Nueva función para bloquear el login X segundos
  startBlock(seconds: number) {
    this.blocked = true;
    this.blockSeconds = seconds;

    const interval = setInterval(() => {
      this.blockSeconds--;

      if (this.blockSeconds <= 0) {
        this.blocked = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  onSubmit(): void {
    if (this.blocked) {
      this.toast.showToast(
        `Demasiados intentos. Espera ${this.blockSeconds} segundos.`,
        'warning'
      );
      return;
    }

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
        error: (error) => {
          // ⬅️ Si es error 429 (demasiados intentos)
          if (error.status === 429) {
            this.toast.showToast(
              'Demasiados intentos. Intenta nuevamente en 60 segundos.',
              'danger'
            );

            this.startBlock(60); // ⬅️ Bloqueamos 60 segundos
          } else {
            // Error normal de credenciales incorrectas
            this.toast.showToast('Email o contraseña incorrectos.', 'danger');
          }

          this.resetCaptcha();
        },
      });
  }
}
