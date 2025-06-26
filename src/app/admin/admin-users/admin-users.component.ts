import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  newUser: User = { name: '', email: '', password: '', role: 'user' };
  editUser: User | null = null;
  error = '';
  success = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: (user) => {
        this.success = 'Usuario creado con éxito.';
        this.error = '';
        this.newUser = { name: '', email: '', password: '', role: 'user' };
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'Error al crear usuario.';
        this.success = '';
        console.error(err);
      }
    });
  }

  edit(user: User): void {
    this.editUser = { ...user };
    this.error = '';
    this.success = '';
  }

  updateUser(): void {
    if (!this.editUser) return;

    const { id, ...data } = this.editUser;

    this.userService.updateUser(id!, data).subscribe({
      next: () => {
        this.success = 'Usuario actualizado.';
        this.error = '';
        this.editUser = null;
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'Error al actualizar usuario.';
        this.success = '';
        console.error(err);
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.success = 'Usuario eliminado.';
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'Error al eliminar usuario.';
        console.error(err);
      }
    });
  }

  cancelEdit(): void {
    this.editUser = null;
  }
}
