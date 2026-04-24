import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  login(): void {
    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.notificationService.success('Login realizado', `Bem-vindo, ${response.name}.`);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.loading = false;
        this.notificationService.error(
          'Falha no login',
          'Verifique o e-mail e a senha e tente novamente.'
        );
      }
    });
  }
}
