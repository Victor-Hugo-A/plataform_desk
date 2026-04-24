import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-center',
  imports: [AsyncPipe],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.scss'
})
export class NotificationCenterComponent {
  constructor(readonly notificationService: NotificationService) {}
}
