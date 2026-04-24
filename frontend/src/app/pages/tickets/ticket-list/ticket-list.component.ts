import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-ticket-list',
  imports: [RouterLink],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = false;

  constructor(
    private ticketService: TicketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.ticketService.findAll().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao carregar chamados', error);
        this.notificationService.error(
          'Falha ao carregar chamados',
          'Nao foi possivel consultar a lista de chamados agora.'
        );
      }
    });
  }
}
