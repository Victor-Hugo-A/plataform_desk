import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Category } from '../../../core/models/category.model';
import { TicketPriority } from '../../../core/models/ticket.model';
import { LoginResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-ticket-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.scss'
})
export class TicketFormComponent implements OnInit {
  categories: Category[] = [];
  currentUser: LoginResponse | null = null;
  loadingCategories = false;
  saving = false;

  title = '';
  description = '';
  priority: TicketPriority = 'MEDIUM';
  categoryId: number | null = null;

  constructor(
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getLoggedUser();
    this.loadCategories();
  }

  loadCategories(): void {
    this.loadingCategories = true;

    this.categoryService.findAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;

        if (categories.length === 0) {
          this.notificationService.info(
            'Cadastre uma categoria',
            'Crie pelo menos uma categoria antes de abrir um chamado.'
          );
        }
      },
      error: (error) => {
        this.loadingCategories = false;
        console.error('Erro ao carregar categorias', error);
        this.notificationService.error(
          'Falha ao carregar categorias',
          'Nao foi possivel buscar as categorias disponiveis.'
        );
      }
    });
  }

  createTicket(): void {
    if (!this.currentUser?.id) {
      this.notificationService.error(
        'Usuario nao identificado',
        'Faca login novamente antes de criar um chamado.'
      );
      return;
    }

    if (!this.categoryId) {
      this.notificationService.error(
        'Categoria obrigatoria',
        'Selecione uma categoria para continuar.'
      );
      return;
    }

    this.saving = true;

    this.ticketService.create({
      title: this.title,
      description: this.description,
      priority: this.priority,
      categoryId: Number(this.categoryId),
      requesterId: this.currentUser.id
    }).subscribe({
      next: () => {
        this.saving = false;
        this.notificationService.success(
          'Chamado criado',
          'O chamado foi registrado com sucesso.'
        );
        this.router.navigateByUrl('/tickets');
      },
      error: (error) => {
        this.saving = false;
        console.error('Erro ao criar chamado', error);
        this.notificationService.error(
          'Falha ao criar chamado',
          'Confira os dados informados e tente novamente.'
        );
      }
    });
  }
}
