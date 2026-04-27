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
  pendingDeleteCategory: Category | null = null;
  deletingCategory = false;

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

    const normalizedName = this.name.trim();
    const normalizedDescription = this.description.trim();

    if (!normalizedName) {
      this.notificationService.error(
        'Nome obrigatorio',
        'Informe o nome da categoria antes de cadastrar.'
      );
      return;
    }

    this.categoryService.create({
      name: normalizedName,
      description: normalizedDescription
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
          error?.error?.message || (
            error?.status === 403
              ? 'Somente administradores podem cadastrar categorias.'
              : 'Revise os dados informados e tente novamente.'
          )
        );
      }
    });
  }

  deleteCategory(category: Category): void {
    if (!this.isAdmin) {
      this.notificationService.error(
        'Acesso negado',
        'Somente administradores podem excluir categorias.'
      );
      return;
    }

    this.pendingDeleteCategory = category;
  }

  cancelDeleteCategory(): void {
    if (this.deletingCategory) {
      return;
    }
    this.pendingDeleteCategory = null;
  }

  confirmDeleteCategory(): void {
    if (!this.pendingDeleteCategory) {
      return;
    }

    this.deletingCategory = true;

    this.categoryService.delete(this.pendingDeleteCategory.id).subscribe({
      next: () => {
        this.deletingCategory = false;
        this.pendingDeleteCategory = null;
        this.notificationService.success(
          'Categoria excluida',
          'A categoria foi removida com sucesso.'
        );
        this.loadCategories();
      },
      error: (error) => {
        this.deletingCategory = false;
        console.error('Erro ao excluir categoria', error);
        this.notificationService.error(
          'Falha ao excluir categoria',
          error?.error?.message || 'Nao foi possivel excluir a categoria selecionada.'
        );
      }
    });
  }
}
