export type TicketStatus =
  | 'OPEN'
  | 'IN_ANALYSIS'
  | 'IN_PROGRESS'
  | 'WAITING_USER'
  | 'RESOLVED'
  | 'CANCELLED';

export type TicketPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface Ticket {
  id: number;
  protocol: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  categoryName: string;
  requesterName: string;
  assignedTechnicianName: string | null;
  createdAt: string;
  updatedAt: string | null;
  resolvedAt: string | null;
  slaDeadline: string;
}

export interface TicketCreateRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  categoryId: number;
  requesterId: number;
}
