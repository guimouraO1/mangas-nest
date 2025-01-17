import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { MangaService } from '../../services/manga.service';
import { Manga } from '../../models/manga.model';
import { SubscriptionService } from '../../services/subscription.service';
import { MatDialog } from '@angular/material/dialog';
import { SubscritionModalConfimation } from './subscription-modal/subscription-modal.component';
import { NotificationService } from '../../services/notification.service';
import { AlertType } from '../../models/notification.model';
import { UnSubscritionModalConfimation } from './unsubscription-modal/unsubscription-modal.component';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateMangaModal } from './create-manga/create-manga-modal';
import { AuthService } from '../../services/auth.service';
import { TokenDecoded, TokenService } from '../../services/token.service';

@Component({
    selector: 'app-mangas-list',
    standalone: true,
    imports: [NgOptimizedImage, TranslateModule],
    templateUrl: './mangas-list.component.html',
    styleUrl: './mangas-list-component.scss',
})
export class MangasListComponent implements OnInit, OnDestroy {
    subscriptionService = inject(SubscriptionService);
    mangaService = inject(MangaService);
    dialog = inject(MatDialog);
    notificationService = inject(NotificationService);
    translateService = inject(TranslateService);
    authService = inject(AuthService);
    tokenService = inject(TokenService);

    offset: number = 4;
    page: number = 1;
    mangaPages: number = 1;
    private ngUnsubscribe = new Subject<void>();

    mangas: Manga[] = [];
    subscriptions: string[] = [];
    isUserAuthenticated: boolean = false;
    user: TokenDecoded | null = null;
    isLoading: boolean = false;

    async ngOnInit() {
        this.isLoading = true;
        await this.getMangasCount();
        await this.getMangas();

        this.authService.getIsUserAuthenticated().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
            this.isUserAuthenticated = value;
            
            if (value) {
                this.user = this.tokenService.decodePayloadJWT();
            }
        });

        this.isLoading = false;
    }

    async incrementPage() {
        if (this.page >= this.mangaPages) return;
        this.page += 1;
        await this.getMangas();
    }

    async decrementPage() {
        if (this.page <= 1) return;
        this.page -= 1;

        await this.getMangas();
    }

    async getMangas() {
        try {
            const response = await firstValueFrom(this.mangaService.getMangas(this.page, this.offset));
            this.mangas = response.mangas;
        } catch (error) {
            console.log(error);
        }
    }

    async getMangasCount() {
        try {
            const response = await firstValueFrom(this.mangaService.getMangasCount());
            this.mangaPages = Math.ceil(response.mangasCount / 4);
        } catch (error) {
            console.log(error);
        }
    }

    async subscribe(mangaId: string) {
        try {
            const dialogRef = this.dialog.open(SubscritionModalConfimation);
            const result = await firstValueFrom(dialogRef.afterClosed());

            if (!result.modal) return;

            await firstValueFrom(this.subscriptionService.subscribe(mangaId, +result.rating));

            const response = await firstValueFrom(this.mangaService.getMangas(this.page, this.offset));
            this.mangas = response.mangas;

            const successMessage = await firstValueFrom(this.translateService.get('pages.mangas-list.alerts.subscribed'));
            this.notificationService.alert({
                message: successMessage,
                type: AlertType.Success,
            });
        } catch (error) {
            const errorMessage = await firstValueFrom(this.translateService.get('pages.mangas-list.alerts.error'));
            this.notificationService.alert({
                message: errorMessage,
                type: AlertType.Error,
            });
        }
    }

    async unSubscribe(subscriptionId: string, mangaId: string) {
        try {
            const dialogRef = this.dialog.open(UnSubscritionModalConfimation);
            const result = await firstValueFrom(dialogRef.afterClosed());

            if (!result) return;

            await firstValueFrom(this.subscriptionService.unSubscribe(subscriptionId));

            this.mangas = this.mangas.map((manga) => {
                if (manga.id === mangaId) {
                    return { ...manga, subscriptions: [] };
                }
                return manga;
            });

            const successMessage = await firstValueFrom(this.translateService.get('pages.mangas-list.alerts.unsubscribed'));
            this.notificationService.alert({
                message: successMessage,
                type: AlertType.Success,
            });
        } catch (error: any) {
            const errorMessage = await firstValueFrom(this.translateService.get('pages.mangas-list.alerts.error'));
            this.notificationService.alert({
                message: errorMessage,
                type: AlertType.Error,
            });
        }
    }


    async createManga() {
        const dialogRef = this.dialog.open(CreateMangaModal);
        const result = await firstValueFrom(dialogRef.afterClosed());
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
