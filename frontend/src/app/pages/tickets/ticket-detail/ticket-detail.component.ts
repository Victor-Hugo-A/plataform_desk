import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { TicketHistoryService } from '../../../core/services/ticket-history.service';
import { Comment, CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS
} from '../../../core/models/ticket.model';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginResponse } from '../../../core/models/user.model';

interface TicketHistory {
  id: number;
  action: string;
  oldValue: string;
  newValue: string;
  performedByName: string;
  createdAt: Date;
}

@Component({
  selector: 'app-ticket-detail',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class TicketDetailComponent implements OnInit {
  readonly statusOptions: { value: TicketStatus; label: string; icon: string }[] = [
    { value: 'OPEN', label: 'Aberto', icon: '🔴' },
    { value: 'IN_ANALYSIS', label: 'Em análise', icon: '🔍' },
    { value: 'IN_PROGRESS', label: 'Em progresso', icon: '⚙️' },
    { value: 'WAITING_USER', label: 'Aguardando usuário', icon: '⏳' },
    { value: 'RESOLVED', label: 'Resolvido', icon: '✅' },
    { value: 'CANCELLED', label: 'Cancelado', icon: '❌' }
  ];

  ticket: Ticket | null = null;
  ticketHistory: TicketHistory[] = [];
  comments: Comment[] = [];
  selectedStatus: TicketStatus = 'OPEN';
  newComment = '';
  ticketId = 0;
  currentUser: LoginResponse | null = null;
  editingCommentId: number | null = null;
  editedCommentMessage = '';

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private historyService: TicketHistoryService,
    private commentService: CommentService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getLoggedUser();
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTicket();
    this.loadHistory();
    this.loadComments();
  }

  loadTicket(): void {
    this.ticketService.findById(this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.selectedStatus = ticket.status;
      },
      error: (error) => {
        console.error('Erro ao carregar chamado', error);
        this.notificationService.error(
          'Falha ao carregar chamado',
          'Nao foi possivel buscar os detalhes do chamado.'
        );
      }
    });
  }

  loadHistory(): void {
    this.historyService.findByTicketId(this.ticketId).subscribe({
      next: (history) => {
        this.ticketHistory = history.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (error) => console.error('Erro ao carregar histórico', error)
    });
  }

  loadComments(): void {
    this.commentService.findByTicketId(this.ticketId).subscribe({
      next: (comments) => {
        this.comments = comments.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (error) => console.error('Erro ao carregar comentários', error)
    });
  }

  updateStatus(): void {
    if (this.ticket && this.selectedStatus !== this.ticket.status) {
      this.ticketService.updateStatus(this.ticketId, this.selectedStatus).subscribe({
        next: () => {
          this.notificationService.success(
            'Status atualizado',
            'O status do chamado foi alterado com sucesso.'
          );
          this.loadTicket();
          this.loadHistory();
        },
        error: (error) => {
          console.error('Erro ao atualizar status', error);
          this.notificationService.error(
            'Falha ao atualizar status',
            'Nao foi possivel atualizar o status do chamado.'
          );
          this.selectedStatus = this.ticket!.status;
        }
      });
    }
  }

  addComment(): void {
    if (!this.currentUser?.id) {
      this.notificationService.error(
        'Usuario nao identificado',
        'Faca login novamente antes de enviar um comentario.'
      );
      return;
    }

    if (this.newComment.trim()) {
      this.commentService.create(this.ticketId, this.newComment, this.currentUser.id).subscribe({
        next: () => {
          this.newComment = '';
          this.notificationService.success(
            'Comentario enviado',
            'O comentario foi registrado com sucesso.'
          );
          this.loadComments();
        },
        error: (error) => {
          console.error('Erro ao adicionar comentário', error);
          this.notificationService.error(
            'Falha ao enviar comentario',
            'Nao foi possivel registrar o comentario para este chamado.'
          );
        }
      });
    }
  }

  canManageComment(comment: Comment): boolean {
    if (!this.currentUser) {
      return false;
    }

    return this.currentUser.role === 'ADMIN' || this.currentUser.id === comment.authorId;
  }

  startEditingComment(comment: Comment): void {
    this.editingCommentId = comment.id;
    this.editedCommentMessage = comment.message;
  }

  cancelEditingComment(): void {
    this.editingCommentId = null;
    this.editedCommentMessage = '';
  }

  saveComment(comment: Comment): void {
    if (!this.currentUser?.id || !this.editedCommentMessage.trim()) {
      return;
    }

    this.commentService.update(comment.id, this.editedCommentMessage, this.currentUser.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Comentario atualizado',
          'O comentario foi atualizado com sucesso.'
        );
        this.cancelEditingComment();
        this.loadComments();
      },
      error: (error) => {
        console.error('Erro ao atualizar comentario', error);
        this.notificationService.error(
          'Falha ao atualizar comentario',
          'Nao foi possivel atualizar este comentario.'
        );
      }
    });
  }

  deleteComment(comment: Comment): void {
    if (!this.currentUser?.id) {
      return;
    }

    if (!window.confirm('Deseja excluir este comentário?')) {
      return;
    }

    this.commentService.delete(comment.id, this.currentUser.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Comentario excluido',
          'O comentario foi removido com sucesso.'
        );
        this.loadComments();
      },
      error: (error) => {
        console.error('Erro ao excluir comentario', error);
        this.notificationService.error(
          'Falha ao excluir comentario',
          'Nao foi possivel excluir este comentario.'
        );
      }
    });
  }

  getStatusLabel(status: TicketStatus): string {
    return TICKET_STATUS_LABELS[status];
  }

  getPriorityLabel(priority: TicketPriority): string {
    return TICKET_PRIORITY_LABELS[priority];
  }
}
