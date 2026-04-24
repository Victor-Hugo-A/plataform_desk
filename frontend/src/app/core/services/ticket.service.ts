import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ticket, TicketCreateRequest } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly apiUrl = environment.apiUrl + '/tickets';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  findById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(this.apiUrl + '/' + id);
  }

  create(request: TicketCreateRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, request);
  }
}
