import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, TRANSLATIONS } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateManga, Manga } from '../models/manga.model';

interface GetMangasResponse {
  mangas: Manga[];
  mangasCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class MangaService {
    protected http = inject(HttpClient);
    private urlApi = environment.apiUrl;

    getMangas(page: number, offset: number): Observable<GetMangasResponse> {
        let params = new HttpParams();

        params = params.set('page', page);
        params = params.set('offset', offset);

        return this.http.get<GetMangasResponse>(`${this.urlApi}/manga`, { params });
    }

    createManga(manga: CreateManga) {
        return this.http.post(`${this.urlApi}/manga`, manga);
    }
}
