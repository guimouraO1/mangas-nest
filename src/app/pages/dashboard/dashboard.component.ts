import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CardComponent } from '../../components/card/card.component';
import { Manga } from '../../models/manga.model';
import { MangaService } from '../../services/manga.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  mangaService = inject(MangaService);
  mangas: Manga[] = [];

  ngOnInit() {
    this.getAllMangas();
  }

  getAllMangas() {
    this.mangaService
      .getAllMangas()
      .pipe(take(1))
      .subscribe((mangas: Manga[]) => {
        console.log(mangas);
        this.mangas = mangas;
      });
  }
}
