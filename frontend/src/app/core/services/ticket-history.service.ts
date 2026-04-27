import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TicketHistory {
  id: number;
  action: string;
  oldValue: string;
  newValue: string;
  performedByName: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TicketHistoryService {
  private readonly apiUrl = environment.apiUrl + '/ticket-history';

  constructor(private http: HttpClient) {}

  findByTicketId(ticketId: number): Observable<TicketHistory[]> {
    return this.http.get<TicketHistory[]>(this.apiUrl + '/ticket/' + ticketId);
  }
}
