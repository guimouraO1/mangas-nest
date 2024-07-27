import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Manga } from '../models/manga.model';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  protected http = inject(HttpClient);
  private urlApi = environment.url;

  getAllMangas(page: number = 1): Observable<Manga[]> {
    return this.http.get<Manga[]>(`${this.urlApi}/manga?page=${page}`);
  }
}
