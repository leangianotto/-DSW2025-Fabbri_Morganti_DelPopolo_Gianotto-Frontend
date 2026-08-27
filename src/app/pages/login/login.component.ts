import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs/operators';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  captchaToken: string | null = null;

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent;

  blocked = false;        // ⬅️ Bloqueo temporal
  blockSeconds = 0;       // ⬅️ Cuenta regresiva
  isE2E = false;         // ⬅️ verdadero cuando se ejecutan pruebas E2E

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    try {
      // Activar modo E2E si `?e2e=true` está presente o la bandera window.__E2E__ está establecida
      const params = new URLSearchParams(window.location.search);
      this.isE2E = params.get('e2e') === 'true' || (window as any).__E2E__ === true;

      if (this.isE2E) {
        // Proporcionar un token de captcha falso para que el formulario se habilite de forma natural
        this.captchaToken = 'fake-recaptcha-token';
      }
    } catch (e) {
      // ignorar en entornos sin URL
    }
  }

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  resetCaptcha() {
    // En modo E2E mantenemos el token falso para que las pruebas no se bloqueen por resets
    if (this.isE2E) return;

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
