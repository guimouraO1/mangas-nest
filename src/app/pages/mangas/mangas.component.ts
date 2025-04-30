import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { MangaService } from '../../services/manga.service';
import { CreateManga, Manga } from '../../models/manga.model';
import { toast } from 'ngx-sonner';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { SubscribeModalComponent } from './modal/subscribe-modal/subscribe-modal.component';
import { SubscriptionsService } from '../../services/subscription.service';
import { UnsubscribeModalComponent } from './modal/unsubscribe-modal/unsubscribe-modal.component';
import { CreateMangaModalComponent } from './modal/create-manga-modal/create-manga-modal.component';

@Component({
    selector: 'app-mangas',
    imports: [TranslateModule, ReactiveFormsModule, CommonModule],
    templateUrl: './mangas.component.html'
})
export class MangasComponent implements OnInit, OnDestroy {
    mangaService = inject(MangaService);
    subscriptionService = inject(SubscriptionsService);
    tokenService = inject(TokenService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    dialog = inject(Dialog);
    protected readonly toast = toast;

    isLoading = true;
    isError = false;

    page = 1;
    offset = 4;

    mangas: Manga[] = [];
    mangasCount = 0;
    selectedManga: Manga | null = null;

    selectedName = new FormControl<string>({ value: '', disabled: true });
    private destroy$ = new Subject<void>();

    isAdmin: boolean = false;

    async ngOnInit() {
        this.verifyToken();
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.selectedName.setValue(params['name'] || '');
            this.page = params['page'] ? Number(params['page']) : 1;
        });

        await this.getMangas();
    }

    async subscribe() {
        const dialogRef = this.dialog.open<{result: boolean, rating: number } | undefined>(SubscribeModalComponent);
        const response = await firstValueFrom(dialogRef.closed);

        if (!response || !response.result || !this.selectedManga || !response.rating) {
            return;
        }

        try {
            await firstValueFrom(this.subscriptionService.subscribe(this.selectedManga.id, response.rating));
            this.selectedManga = null;
            await this.getMangas();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    async unsubscribe() {
        const dialogRef = this.dialog.open(UnsubscribeModalComponent);
        const response = await firstValueFrom(dialogRef.closed);

        if (!response || !this.selectedManga) {
            return;
        }

        try {
            await firstValueFrom(this.subscriptionService.unSubscribe(this.selectedManga.id));
            this.selectedManga = null;
            await this.getMangas();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    async createManga() {
        const dialogRef = this.dialog.open(CreateMangaModalComponent);
        const response: any = await firstValueFrom(dialogRef.closed);

        if (!response?.result || !response.manga) {
            return;
        }

        try {
            await firstValueFrom(this.mangaService.createManga(response.manga as CreateManga));
            await this.getMangas();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    verifyToken() {
        const jwtDecoded = this.tokenService.decodeToken();
        if(jwtDecoded && jwtDecoded.role === 'admin') {
            this.isAdmin = true;
        } else {
            this.isAdmin = false;
        }
    }

    async getMangas() {
        this.isLoading = true;

        try {
            const { mangas, mangasCount } = await firstValueFrom(this.mangaService.getMangas(this.page, this.offset));
            this.mangas = mangas;
            this.mangasCount = mangasCount;

            this.isError = false;
        } catch (error: any) {
            this.isError = true;
            toast.error(error.message);
        }

        this.isLoading = false;
    }

    async addFilterParam(filter: any) {
        this.router.navigate([], { queryParams: filter, queryParamsHandling: 'merge' });
        await this.getMangas();
    }

    get startIndex(): number {
        return (this.page - 1) * this.offset + 1;
    }

    get endIndex(): number {
        return Math.min(this.page * this.offset, this.mangasCount);
    }

    async nextPage() {
        if ((this.page * this.offset) < this.mangasCount) {
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

    async searchByName() {
        this.page = 1;
        await this.addFilterParam({ name: this.selectedName.value });
    }

    async removeNameFilter() {
        this.selectedName.reset('');
        this.page = 1;
        await this.addFilterParam({ name: null });
    }

    toggleSelection(manga: Manga) {
        if (this.selectedManga && this.selectedManga.id === manga.id) {
            this.selectedManga = null;
        } else {
            this.selectedManga = manga;
        }
    }

    async resetFilters() {
        this.selectedName.reset('');
        this.router.navigate([], { queryParams: {} });
        await this.getMangas();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
