import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MangaService } from '../../services/manga.service';
import { Manga } from '../../models/manga.model';

@Component({
  selector: 'app-mangas-list',
  standalone: true,
  imports: [],
  templateUrl: './mangas-list.component.html'
})
export class MangasListComponent implements OnInit {

  mangaService = inject(MangaService);
  mangas: Manga[] = [];

  async ngOnInit() {
    await this.getMangas();
  }

  async getMangas() {
    try {
      const mangas = await firstValueFrom(this.mangaService.getMangas(1));
      this.mangas = mangas;
    } catch (error) {

    }
  }
}
