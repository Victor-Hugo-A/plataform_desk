import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  private nextId = 1;

  readonly notifications$ = this.notificationsSubject.asObservable();

  show(type: NotificationType, title: string, message: string, duration = 4500): void {
    const notification: AppNotification = {
      id: this.nextId++,
      type,
      title,
      message
    };

    this.notificationsSubject.next([...this.notificationsSubject.value, notification]);
    window.setTimeout(() => this.dismiss(notification.id), duration);
  }

  success(title: string, message: string, duration?: number): void {
    this.show('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number): void {
    this.show('error', title, message, duration);
  }

  info(title: string, message: string, duration?: number): void {
    this.show('info', title, message, duration);
  }

  dismiss(id: number): void {
    this.notificationsSubject.next(
      this.notificationsSubject.value.filter((notification) => notification.id !== id)
    );
  }
}
