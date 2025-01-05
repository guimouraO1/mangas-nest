import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, TRANSLATIONS } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Manga } from '../models/manga.model';

interface GetMangasResponse {
  mangas: Manga[];
}

interface GetMangasCountResponse {
  mangasCount: number;
}

interface GetPresignedResponse {
  signedUrl: string;
  fileExtension: string;
  key: string;
}

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  protected http = inject(HttpClient);
  private urlApi = environment.url;

  getMangas(page: number, offset: number): Observable<GetMangasResponse> {
    let params = new HttpParams();

    params = params.set('page', page);
    params = params.set('offset', offset);

    return this.http.get<GetMangasResponse>(`${this.urlApi}/manga`, { params });
  }

  getMangasCount(): Observable<GetMangasCountResponse> {
    return this.http.get<GetMangasCountResponse>(`${this.urlApi}/manga/count`);
  }

  createManga(manga: Manga): Observable<Manga> {
    return this.http.post<Manga>(`${this.urlApi}/manga`, manga);
  }

  getPresignedUrl(imageType: string): Observable<GetPresignedResponse> {
    let params = new HttpParams().set('fileType', imageType);
    return this.http.get<GetPresignedResponse>(`${this.urlApi}/manga/upload/image`, { params });
  }

  uploadImageToS3(urlPresigned: string, file: File) {
    const headers = new HttpHeaders({ 'Content-Type': file.type });
    return this.http.put(urlPresigned, file, { headers });
  }
}
