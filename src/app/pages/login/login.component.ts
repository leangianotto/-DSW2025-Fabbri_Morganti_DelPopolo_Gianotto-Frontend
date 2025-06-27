import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.toast.showToast('Debe completar todos los campos.', 'warning');
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.toast.showToast('Inicio de sesión exitoso.', 'success');
          setTimeout(() => this.router.navigate(['/products']), 1500);
        },
        error: () => {
          this.toast.showToast('Email o contraseña incorrectos.', 'danger');
        },
      });
  }
}


