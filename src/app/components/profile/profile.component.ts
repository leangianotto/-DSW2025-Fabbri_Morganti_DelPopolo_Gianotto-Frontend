import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  editando = false;
  mensaje = '';
  newPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUser(); 
    this.authService.getProfile().subscribe({
      next: (data) => (this.user = data),
      error: (err) => console.error('Error al cargar perfil', err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  guardarCambios() {
    const datos = {
      name: this.user.name,
      email: this.user.email,
      password: this.newPassword || undefined, 
    };

    this.authService.updateProfile(datos).subscribe({
      next: () => {
        this.mensaje = 'Perfil actualizado con éxito';
        this.editando = false;
        this.newPassword = '';
      },
      error: (err) => {
        console.error('Error al actualizar perfil', err);
        this.mensaje = 'Error al actualizar perfil';
      },
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.ngOnInit(); // carg datos originales
  }
}
