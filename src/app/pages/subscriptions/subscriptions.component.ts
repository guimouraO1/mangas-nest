import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionsService } from '../../services/subscription.service';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { Subscription } from '../../models/subscriptions.model';
import { Router } from '@angular/router';
import { CreateChapterModalComponent } from './modal/create-chapter-modal/create-chapter-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { ChaptersService } from '../../services/chapters.service';
import { DeleteChapterModalComponent } from './modal/delete-chapter-modal/delete-chapter-modal.component';

@Component({
    selector: 'app-subscriptions',
    imports: [TranslateModule],
    templateUrl: './subscriptions.component.html'
})
export class SubscriptionsComponent implements OnInit {
    private subscriptionsService = inject(SubscriptionsService);
    private router = inject(Router);
    private chaptersService = inject(ChaptersService);

    protected readonly toast = toast;
    dialog = inject(Dialog);

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

    async addChapter(subscription: Subscription) {
        const chapter = subscription?.chapters?.[0]?.number ?? 0;
        const dialogRef = this.dialog.open(CreateChapterModalComponent, { data: chapter + 1 });
        const response: any = await firstValueFrom(dialogRef.closed);

        if (!response?.result  || !response.chapter) {
            return;
        }

        try {
            await firstValueFrom(this.chaptersService.createChapter(response.chapter, subscription.id));

            await this.getSubscriptions();
        } catch (error: any) {
            toast.error(error.error.message);
        }
    }

    async deleteChapter(subscription: Subscription, chapter: number) {
        const dialogRef = this.dialog.open(DeleteChapterModalComponent);
        const response: boolean | unknown = await firstValueFrom(dialogRef.closed);

        if (!response) {
            return;
        }

        try {
            await firstValueFrom(this.chaptersService.deleteChapter(chapter, subscription.id));
            await this.getSubscriptions();
        } catch (error: any) {
            toast.error(error.error.message);
        }
    }
}
