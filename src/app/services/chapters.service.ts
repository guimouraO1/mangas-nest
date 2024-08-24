import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChaptersService {
  private urlApi = environment.url;
  protected http = inject(HttpClient);

  constructor() {}

  newChapter(number: number, mangaId: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    const headers = new HttpHeaders().set('authorization', `${token}`);

    const body = {
      mangaId,
      number,
    };

    return this.http.post<any>(`${this.urlApi}/chapter`, body, { headers });
  }

  delChapter(number: number, mangaId: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    const headers = new HttpHeaders().set('authorization', `${token}`);

    const params = new HttpParams()
      .set('mangaId', mangaId)
      .set('number', number.toString());

    return this.http.delete<any>(`${this.urlApi}/chapter`, { headers, params });
  }
}
