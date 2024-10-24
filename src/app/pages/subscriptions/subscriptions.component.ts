import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom, of, take } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';
import { Manga } from '../../models/manga.model';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../models/subscriptions.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './subscriptions.component.html',
})
export class SubscriptionsComponent implements OnInit {
  subscriptionService = inject(SubscriptionService);
  subscriptions: Subscription[] = [];
  url = environment.url;

  data = new Date();

  weekdayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  dateString: string = '';

  getWeekdayAbbreviated(date: Date): string {
    if (!date) {
      return '';
    }
    return this.weekdayNames[date.getDay()];
  }

  async ngOnInit() {
    this.dateString = this.getWeekdayAbbreviated(this.data);
    await this.getSubscriptions();
  }

  async selectDay(day: string) {
    this.dateString = day;
    await this.getSubscriptions();
  }

  async getSubscriptions() {
    try {
      const subscriptions = await firstValueFrom(this.subscriptionService.getSubscriptions(1, this.dateString));
      this.subscriptions = subscriptions;
    } catch (error) {

    }
  }
}
