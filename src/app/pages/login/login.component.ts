
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.success = 'Inicio de sesión exitoso!';
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1500);
      },
      error: () => {
        this.error = 'Email o contraseña incorrectos';
        this.success = '';
      },
    });
  }
}
