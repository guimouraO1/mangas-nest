import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MangaService } from '../../services/manga.service';
import { Manga } from '../../models/manga.model';
import { Subscription } from '../../models/subscriptions.model';
import { SubscriptionService } from '../../services/subscription.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SubscritionModalConfimation } from './subscription-modal/subscription-modal.component';
import { NotificationService } from '../../services/notification.service';
import { AlertType } from '../../models/notification.model';
import { UnSubscritionModalConfimation } from './unsubscription-modal/unsubscription-modal.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-mangas-list',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './mangas-list.component.html',
  styleUrl: './mangas-list-component.scss'
})
export class MangasListComponent implements OnInit {
  subscriptionService = inject(SubscriptionService)
  mangaService = inject(MangaService);
  dialog = inject(MatDialog);
  notificationService = inject(NotificationService);

  mangas: Manga[] = [];
  subscriptions: string[] = [];
  url = environment.urlImages;


  async ngOnInit() {
    await this.getMangas();
  }

  async getMangas() {
    try {
      const mangas = await firstValueFrom(this.mangaService.getMangas(1, 5));
      this.mangas = mangas;
    } catch (error) {

    }
  }

  async subscribe(mangaId: string) {
    const dialogRef = this.dialog.open(SubscritionModalConfimation, {});
    const result = await firstValueFrom(dialogRef.afterClosed());

    if (!result.modal) return;

    await firstValueFrom(this.subscriptionService.subscribe(mangaId, +result.rating));

    const mangas = await firstValueFrom(this.mangaService.getMangas(1, 5));
    this.mangas = mangas;

    this.notificationService.alert({
      message: 'Subscribed!',
      type: AlertType.Success,
    })
  }


  async unSubscribe(subscriptionId: string, mangaId: string){
    const dialogRef = this.dialog.open(UnSubscritionModalConfimation, {});
    const result = await firstValueFrom(dialogRef.afterClosed());

    if (!result) return;

    await firstValueFrom(this.subscriptionService.unSubscribe(subscriptionId));

    this.mangas = this.mangas.map(manga => {
      if (manga.id === mangaId) {
        return { ...manga, subscriptions: [] };
      }
      return manga;
    });

    this.notificationService.alert({
      message: 'Unsubscribed',
      type: AlertType.Info
    })
  }

}
