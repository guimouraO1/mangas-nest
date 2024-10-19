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

  data = new Date();

  weekdayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  // weekdayNames = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  dateString: string = '';

  getWeekdayAbbreviated(date: Date): string {
    if (!date) {
      return '';
    }
    return this.weekdayNames[date.getDay()];
  }

  ngOnInit() {
    this.dateString = this.getWeekdayAbbreviated(this.data);
    this.getAllMangas();
  }

  selectDay(day: string) {
    this.dateString = day;
    this.getAllMangas();
  }

  getAllMangas() {
    if (!this.dateString) return;
    this.mangaService
      .getAllMangas(1, this.dateString)
      .pipe(take(1))
      .subscribe((mangas: Manga[]) => {
        this.mangas = mangas;
      });
  }
}
