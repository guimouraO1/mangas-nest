import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MangaService } from '../../services/manga.service';
import { Manga } from '../../models/manga.model';
import { Subscription } from '../../models/subscriptions.model';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-mangas-list',
  standalone: true,
  imports: [],
  templateUrl: './mangas-list.component.html'
})
export class MangasListComponent implements OnInit {
  subscriptionService = inject(SubscriptionService)
  mangaService = inject(MangaService);
  mangas: Manga[] = [];
  subscriptions: string[] = [];

  async ngOnInit() {
    await this.getSubscriptions();
    await this.getMangas();
  }

  async getSubscriptions() {
    const subscriptions = await firstValueFrom(this.subscriptionService.getSubscriptions(1, ''));
    this.subscriptions = subscriptions.map((subscription) => subscription.manga.id);
  }

  async getMangas() {
    try {
      const mangas = await firstValueFrom(this.mangaService.getMangas(1));
      this.mangas = mangas;
    } catch (error) {

    }
  }
}
