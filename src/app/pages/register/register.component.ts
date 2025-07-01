import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false; // ✅ nueva bandera

  constructor(
    private UserService: UserService,
    private router: Router,
    private toast: ToastService
  ) {}

  onRegister() {
    if (this.loading) return;
  
    this.loading = true;
  
    this.UserService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.toast.showToast('Usuario creado con éxito. Ahora podés iniciar sesión.', 'success');
        this.loading = false; 
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.toast.showToast('Error al registrar', 'danger');
        this.loading = false; 
      }
    });
  }
  
}
