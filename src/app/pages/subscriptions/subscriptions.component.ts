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
  offset: number = 4;
  page: number = 1;
  subscriptionsCount: number = 1;

  async ngOnInit() {
    await this.getSubscriptionsCount();
    await this.getSubscriptions();
  }

  incrementPage(): void {
    if (this.page >= this.subscriptionsCount) return;
    this.page += 1;
  }
  
  decrementPage(): void {
    if (this.page <= 1) return;
    this.page -= 1;
  }

  async getSubscriptions() {
    this.subscriptions = [];
    this.isLoadingGetSubscriptions = true;
    try {
      const subscriptions: Subscription[] = await firstValueFrom(this.subscriptionService.getSubscriptions(this.page, this.offset));
      this.isLoadingGetSubscriptions = false;
      this.subscriptions = subscriptions;

    } catch (error) {
      console.log(error)
    }
  }

  async getSubscriptionsCount() {
    try {
      const res: any = await firstValueFrom(this.subscriptionService.getSubscriptionsCount());
      
      this.subscriptionsCount = res.subscriptions;

    } catch (error) {
      console.log(error)
    }
  }
}

