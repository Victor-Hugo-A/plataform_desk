import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import { Ticket } from '../../core/models/ticket.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  tickets: Ticket[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.findAll().subscribe({
      next: (tickets) => this.tickets = tickets,
      error: (error) => console.error('Erro ao buscar chamados', error)
    });
  }

  get totalTickets(): number {
    return this.tickets.length;
  }

  get openTickets(): number {
    return this.tickets.filter(ticket => ticket.status === 'OPEN').length;
  }

  get inProgressTickets(): number {
    return this.tickets.filter(ticket => ticket.status === 'IN_PROGRESS').length;
  }

  get resolvedTickets(): number {
    return this.tickets.filter(ticket => ticket.status === 'RESOLVED').length;
  }
}
