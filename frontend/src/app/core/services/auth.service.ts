import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';
  private readonly loggedUserSubject = new BehaviorSubject<LoginResponse | null>(this.readLoggedUser());

  readonly loggedUser$ = this.loggedUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + '/login', request)
      .pipe(
        tap((response) => {
          this.setLoggedUser(response);
        })
      );
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/register', request);
  }

  getLoggedUser(): LoginResponse | null {
    return this.loggedUserSubject.value;
  }

  setLoggedUser(user: LoginResponse | null): void {
    if (user) {
      localStorage.setItem('serviceflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('serviceflow_user');
    }

    this.loggedUserSubject.next(user);
  }

  updateLoggedUserProfile(name: string, email: string, role: LoginResponse['role']): void {
    const currentUser = this.getLoggedUser();
    if (!currentUser) {
      return;
    }

    this.setLoggedUser({
      ...currentUser,
      name,
      email,
      role
    });
  }

  logout(): void {
    this.setLoggedUser(null);
  }

  private readLoggedUser(): LoginResponse | null {
    const user = localStorage.getItem('serviceflow_user');
    return user ? JSON.parse(user) : null;
  }
}
