import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  message: string;
  internal: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly apiUrl = environment.apiUrl + '/comments';

  constructor(private http: HttpClient) {}

  findByTicketId(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl + '/ticket/' + ticketId);
  }

  create(ticketId: number, message: string, authorId: number): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, { ticketId, message, authorId });
  }

  update(id: number, message: string, actorId: number): Observable<Comment> {
    return this.http.patch<Comment>(this.apiUrl + '/' + id, { message, actorId });
  }

  delete(id: number, actorId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id + '?actorId=' + actorId);
  }
}
