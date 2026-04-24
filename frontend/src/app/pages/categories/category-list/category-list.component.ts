import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-category-list',
  imports: [FormsModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  currentUser: LoginResponse | null = null;
  isAdmin = false;

  name = '';
  description = '';

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getLoggedUser();
    this.isAdmin = this.currentUser?.role === 'ADMIN';
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;

    this.categoryService.findAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao buscar categorias', error);
        this.notificationService.error(
          'Falha ao carregar categorias',
          'Nao foi possivel consultar as categorias cadastradas.'
        );
      }
    });
  }

  createCategory(): void {
    if (!this.isAdmin) {
      this.notificationService.error(
        'Acesso negado',
        'Somente administradores podem cadastrar categorias.'
      );
      return;
    }

    this.categoryService.create({
      name: this.name,
      description: this.description
    }).subscribe({
      next: () => {
        this.name = '';
        this.description = '';
        this.notificationService.success(
          'Categoria criada',
          'A nova categoria ja pode ser usada nos chamados.'
        );
        this.loadCategories();
      },
      error: (error) => {
        console.error('Erro ao criar categoria', error);
        this.notificationService.error(
          'Falha ao criar categoria',
          error?.status === 403
            ? 'Somente administradores podem cadastrar categorias.'
            : 'Revise os dados informados e tente novamente.'
        );
      }
    });
  }
}
