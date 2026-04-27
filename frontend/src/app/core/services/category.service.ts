import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryRequest } from '../models/category.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = environment.apiUrl + '/categories';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  create(request: CategoryRequest): Observable<Category> {
    const user = this.authService.getLoggedUser();
    const headers = new HttpHeaders({
      'X-User-Role': user?.role ?? '',
      'X-User-Id': user?.id?.toString() ?? ''
    });

    return this.http.post<Category>(this.apiUrl, request, { headers });
  }

  delete(id: number): Observable<void> {
    const user = this.authService.getLoggedUser();
    const headers = new HttpHeaders({
      'X-User-Role': user?.role ?? '',
      'X-User-Id': user?.id?.toString() ?? ''
    });

    return this.http.delete<void>(this.apiUrl + '/' + id, { headers });
  }
}
