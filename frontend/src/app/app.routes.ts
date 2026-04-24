import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TicketListComponent } from './pages/tickets/ticket-list/ticket-list.component';
import { TicketFormComponent } from './pages/tickets/ticket-form/ticket-form.component';
import { TicketDetailComponent } from './pages/tickets/ticket-detail/ticket-detail.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'tickets',
        component: TicketListComponent
      },
      {
        path: 'tickets/new',
        component: TicketFormComponent
      },
      {
        path: 'tickets/:id',
        component: TicketDetailComponent
      },
      {
        path: 'categories',
        component: CategoryListComponent
      },
      {
        path: 'users',
        component: UserListComponent
      }
    ]
  }
];
