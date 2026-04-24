import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationCenterComponent } from './shared/components/notification-center/notification-center.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationCenterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
