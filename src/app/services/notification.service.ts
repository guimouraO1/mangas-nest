import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private subject = new BehaviorSubject<Alert | null>(null);
  alert$ = this.subject.asObservable();

  alert(alert: Alert): void {
    this.subject.next(alert);
  }
}
