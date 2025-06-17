import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private UserService: UserService) {}

  onRegister() {
    this.UserService.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        this.message = 'Usuario registrado con éxito. Ahora podés iniciar sesión.';
      },
      error: (err) => {
        this.message = 'Error al registrar: ' + (err.error.message || err.message);
      },
    });
  }
}

