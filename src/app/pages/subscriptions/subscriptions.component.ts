import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';
import { SubscriptionService } from '../../services/subscription.service';
import { environment } from '../../../environments/environment';
import { Subscription } from '../../models/subscriptions.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, CardComponent, RouterLink],
  templateUrl: './subscriptions.component.html',
})
export class SubscriptionsComponent implements OnInit {
  subscriptionService = inject(SubscriptionService);
  subscriptions: Subscription[] = [];
  isLoadingGetSubscriptions: boolean = false;

  url = environment.urlImages;

  data = new Date();

  weekdayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  dateString: string = '';

  async ngOnInit() {
    this.dateString = this.getWeekdayAbbreviated(this.data);
    await this.getSubscriptions();
  }

  getWeekdayAbbreviated(date: Date): string {
    if (!date) {
      return '';
    }
    return this.weekdayNames[date.getDay()];
  }

  async selectDay(day: string) {
    this.dateString = day;
    await this.getSubscriptions();
  }

  async getSubscriptions() {
    this.subscriptions = [];
    this.isLoadingGetSubscriptions = true;
    try {
      const subscriptions: Subscription[] | [] = await firstValueFrom(this.subscriptionService.getSubscriptions(1, 5, this.dateString));
      this.isLoadingGetSubscriptions = false;
      this.subscriptions = subscriptions;

    } catch (error) {
      console.log(error)
    }
  }
}

