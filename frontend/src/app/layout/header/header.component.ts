import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginResponse } from '../../core/models/user.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user: LoginResponse | null = null;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedUser();
  }

  get initials(): string {
    const name = this.user?.name?.trim();

    if (!name) {
      return 'SD';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.info('Sessao encerrada', 'Voce saiu do sistema.');
    this.router.navigateByUrl('/login');
  }
}
