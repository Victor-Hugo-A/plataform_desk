import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginResponse, User, USER_ROLE_LABELS, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  currentUser: LoginResponse | null = null;
  editingUserId: number | null = null;
  editModel: { name: string; email: string; role: UserRole; department: string; active: boolean } | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getLoggedUser();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.findAll().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Erro ao carregar usuários', error)
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  getRoleLabel(role: UserRole): string {
    return USER_ROLE_LABELS[role];
  }

  startEditing(user: User): void {
    this.editingUserId = user.id;
    this.editModel = {
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      active: user.active
    };
  }

  cancelEditing(): void {
    this.editingUserId = null;
    this.editModel = null;
  }

  saveUser(user: User): void {
    if (!this.currentUser?.id || !this.editModel) {
      return;
    }

    this.userService.update(user.id, {
      ...this.editModel,
      actorId: this.currentUser.id
    }).subscribe({
      next: () => {
        if (this.currentUser?.id === user.id) {
          this.authService.updateLoggedUserProfile(
            this.editModel!.name,
            this.editModel!.email,
            this.editModel!.role
          );
          this.currentUser = this.authService.getLoggedUser();
        }

        this.notificationService.success('Usuário atualizado', 'As informações do usuário foram salvas.');
        this.cancelEditing();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erro ao atualizar usuario', error);
        this.notificationService.error('Falha ao atualizar usuário', 'Nao foi possivel salvar as alteracoes.');
      }
    });
  }

  deleteUser(user: User): void {
    if (!this.currentUser?.id) {
      return;
    }

    if (!window.confirm(`Deseja excluir o usuário ${user.name}?`)) {
      return;
    }

    this.userService.delete(user.id, this.currentUser.id).subscribe({
      next: () => {
        this.notificationService.success('Usuário excluído', 'O usuário foi removido com sucesso.');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erro ao excluir usuario', error);
        this.notificationService.error('Falha ao excluir usuário', 'Nao foi possivel excluir este usuário.');
      }
    });
  }
}
