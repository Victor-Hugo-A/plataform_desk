import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS
} from '../../core/models/ticket.model';

type StatusMetric = {
  status: TicketStatus;
  label: string;
  count: number;
  percentage: number;
};

type PriorityMetric = {
  priority: TicketPriority;
  label: string;
  count: number;
  percentage: number;
  color: string;
};

type CategoryMetric = {
  categoryName: string;
  count: number;
  percentage: number;
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  readonly statusOrder: TicketStatus[] = [
    'OPEN',
    'IN_ANALYSIS',
    'IN_PROGRESS',
    'WAITING_USER',
    'RESOLVED',
    'CANCELLED'
  ];

  readonly priorityOrder: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  readonly priorityColors: Record<TicketPriority, string> = {
    LOW: '#16a34a',
    MEDIUM: '#2563eb',
    HIGH: '#ea580c',
    CRITICAL: '#dc2626'
  };

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
    return this.countByStatus('OPEN');
  }

  get inProgressTickets(): number {
    return this.countByStatus('IN_PROGRESS');
  }

  get resolvedTickets(): number {
    return this.countByStatus('RESOLVED');
  }

  get overdueTickets(): number {
    const now = Date.now();
    return this.tickets.filter((ticket) => {
      if (ticket.status === 'RESOLVED' || ticket.status === 'CANCELLED') {
        return false;
      }

      const deadline = Date.parse(ticket.slaDeadline);
      return !Number.isNaN(deadline) && deadline < now;
    }).length;
  }

  get urgentTickets(): number {
    return this.tickets.filter((ticket) => ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL').length;
  }

  get recentTickets(): Ticket[] {
    return [...this.tickets]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 5);
  }

  get statusMetrics(): StatusMetric[] {
    return this.statusOrder.map((status) => {
      const count = this.countByStatus(status);
      return {
        status,
        label: TICKET_STATUS_LABELS[status],
        count,
        percentage: this.toPercentage(count, this.totalTickets)
      };
    });
  }

  get priorityMetrics(): PriorityMetric[] {
    return this.priorityOrder.map((priority) => {
      const count = this.tickets.filter((ticket) => ticket.priority === priority).length;
      return {
        priority,
        label: TICKET_PRIORITY_LABELS[priority],
        count,
        percentage: this.toPercentage(count, this.totalTickets),
        color: this.priorityColors[priority]
      };
    });
  }

  get categoryMetrics(): CategoryMetric[] {
    const counts = new Map<string, number>();

    for (const ticket of this.tickets) {
      counts.set(ticket.categoryName, (counts.get(ticket.categoryName) ?? 0) + 1);
    }

    return [...counts.entries()]
      .map(([categoryName, count]) => ({
        categoryName,
        count,
        percentage: this.toPercentage(count, this.totalTickets)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  get slaAlerts(): Ticket[] {
    const now = Date.now();
    return [...this.tickets]
      .filter((ticket) => {
        if (ticket.status === 'RESOLVED' || ticket.status === 'CANCELLED') {
          return false;
        }

        const deadline = Date.parse(ticket.slaDeadline);
        if (Number.isNaN(deadline)) {
          return false;
        }

        return deadline < now || deadline - now <= 24 * 60 * 60 * 1000;
      })
      .sort((a, b) => Date.parse(a.slaDeadline) - Date.parse(b.slaDeadline))
      .slice(0, 4);
  }

  get priorityDonutStyle(): Record<string, string> {
    const segments: string[] = [];
    let current = 0;

    for (const metric of this.priorityMetrics) {
      const next = current + metric.percentage * 3.6;
      segments.push(`${metric.color} ${current}deg ${next}deg`);
      current = next;
    }

    if (segments.length === 0) {
      return { background: 'conic-gradient(#e2e8f0 0deg 360deg)' };
    }

    return { background: `conic-gradient(${segments.join(', ')})` };
  }

  getStatusLabel(status: TicketStatus): string {
    return TICKET_STATUS_LABELS[status];
  }

  getPriorityLabel(priority: TicketPriority): string {
    return TICKET_PRIORITY_LABELS[priority];
  }

  formatDeadline(deadline: string): string {
    const parsed = Date.parse(deadline);
    if (Number.isNaN(parsed)) {
      return deadline;
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(parsed));
  }

  isOverdue(deadline: string): boolean {
    const parsed = Date.parse(deadline);
    return !Number.isNaN(parsed) && parsed < Date.now();
  }

  private countByStatus(status: TicketStatus): number {
    return this.tickets.filter((ticket) => ticket.status === status).length;
  }

  private toPercentage(value: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return Math.round((value / total) * 100);
  }
}
