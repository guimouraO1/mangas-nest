import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../models/subscriptions.model';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, CardComponent, RouterLink, TranslateModule],
  templateUrl: './subscriptions.component.html',
})
export class SubscriptionsComponent implements OnInit {
  subscriptionService = inject(SubscriptionService);
  subscriptions: Subscription[] = [];

  isLoadingGetSubscriptions: boolean = false;
  offset: number = 4;
  page: number = 1;
  subscriptionsCount: number = 1;

  async ngOnInit() {
    await this.getSubscriptionsCount();
    await this.getSubscriptions();
  }

  async incrementPage() {
    if (this.page >= this.subscriptionsCount) return;
    this.page += 1;
    await this.getSubscriptions();
  }
  
  async decrementPage() {
    if (this.page <= 1) return;
    this.page -= 1;
    await this.getSubscriptions();
  }

  async getSubscriptions() {
    this.subscriptions = [];
    this.isLoadingGetSubscriptions = true;

    try {
      const response = await firstValueFrom(this.subscriptionService.getSubscriptions(this.page, this.offset));

      this.isLoadingGetSubscriptions = false;
      this.subscriptions = response.subscriptions;

    } catch (error) {
      console.log(error)
    }
  }

  async getSubscriptionsCount() {
    try {
      const response = await firstValueFrom(this.subscriptionService.getSubscriptionsCount());
      this.subscriptionsCount = Math.ceil(response.subscriptionsCount / 4);;
    } catch (error) {
      console.log(error)
    }
  }
}

