import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Manga, MangaWithImage } from '../models/manga.model';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  protected http = inject(HttpClient);
  private urlApi = environment.url;

  getMangas(page: number): Observable<Manga[]> {
    return this.http.get<Manga[]>(
      `${this.urlApi}/manga?page=${page}`
    );
  }

  uploadManga(manga: MangaWithImage): Observable<Manga[]> {
    const token: string | null = localStorage.getItem('token');
    const headers = new HttpHeaders().set('authorization', `${token}`);

    const formData = new FormData();
    formData.append('image', manga.image);
    const { image, ...mangaData } = manga;
    formData.append('data', JSON.stringify(mangaData));

    return this.http.post<any>(`${this.urlApi}/manga`, formData, { headers });
  }
}
