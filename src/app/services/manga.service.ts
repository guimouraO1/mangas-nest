import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getMangas(page: number, offset: number): Observable<Manga[]> {
    const headers = this.setupRequestHeader();

    let params = new HttpParams();

    params = params.set('page', page);
    params = params.set('offset', offset);

    return this.http.get<Manga[]>(`${this.urlApi}/manga`, { params, headers });
  }

  createManga(manga: Manga): Observable<Manga[]> {
    const headers = this.setupRequestHeader();
    return this.http.post<any>(`${this.urlApi}/manga`, manga, { headers });
  }

  getPresignedUrl(imageType: string) {
    const headers = this.setupRequestHeader();
    let params = new HttpParams().set('fileType', imageType);

    return this.http.get<any>(`${this.urlApi}/uploads`, { params, headers });
  }

  uploadImageToS3(urlPresigned: string, file: File) {
    const headers = new HttpHeaders({
      'Content-Type': file.type
    });

    return this.http.put(urlPresigned, file, { headers });
  }

  subscribe(mangaId: string, rating: number) {
    const headers = this.setupRequestHeader();
    const body = { mangaId, rating }

    return this.http.post(`${this.urlApi}/sub`, body, { headers });
  }

  protected setupRequestHeader() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
