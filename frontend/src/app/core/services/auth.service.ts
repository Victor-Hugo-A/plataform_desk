import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + '/login', request)
      .pipe(
        tap((response) => {
          localStorage.setItem('serviceflow_user', JSON.stringify(response));
        })
      );
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/register', request);
  }

  getLoggedUser(): LoginResponse | null {
    const user = localStorage.getItem('serviceflow_user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('serviceflow_user');
  }
}
