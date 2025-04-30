import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionsService } from '../../services/subscription.service';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { Subscription } from '../../models/subscriptions.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-subscriptions',
    imports: [TranslateModule],
    templateUrl: './subscriptions.component.html'
})
export class SubscriptionsComponent implements OnInit {
    private subscriptionsService = inject(SubscriptionsService);
    private router = inject(Router);
    protected readonly toast = toast;

    isLoading = true;
    isError = false;

    page = 1;
    offset = 4;

    subscriptions: Subscription[] = [];
    subscriptionsCount: number = 0;

    async ngOnInit() {
        await this.getSubscriptions();
    }

    async getSubscriptions() {
        this.isLoading = true;

        try {
            const response = await firstValueFrom(this.subscriptionsService.getSubscriptions(this.page, this.offset));
            this.subscriptions = response.subscriptions;
            this.subscriptionsCount = response.subscriptionsCount;

            this.isError = false;
        } catch (error: any) {
            this.isError = true;
            toast.error(error.message);
        }

        this.isLoading = false;
    }

    async addFilterParam(filter: any) {
        this.router.navigate([], { queryParams: filter, queryParamsHandling: 'merge' });
        await this.getSubscriptions();
    }

    get startIndex(): number {
        return (this.page - 1) * this.offset + 1;
    }

    get endIndex(): number {
        return Math.min(this.page * this.offset, this.subscriptionsCount);
    }

    async nextPage() {
        if ((this.page * this.offset) < this.subscriptionsCount) {
            this.page++;
            await this.addFilterParam({ page: this.page });
        }
    }

    async previousPage() {
        if (this.page > 1) {
            this.page--;
            await this.addFilterParam({ page: this.page });
        }
    }

}
