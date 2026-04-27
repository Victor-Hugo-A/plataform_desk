import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';

export interface UserUpdateRequest {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  active: boolean;
  actorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/' + id);
  }

  update(id: number, request: UserUpdateRequest): Observable<User> {
    return this.http.patch<User>(this.apiUrl + '/' + id, request);
  }

  delete(id: number, actorId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id + '?actorId=' + actorId);
  }
}
