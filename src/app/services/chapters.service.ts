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

  protected setupRequestHeader() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createChapter(number: number, subscriptionId: string): Observable<any> {
    const headers = this.setupRequestHeader();
    const body = { subscriptionId, number };

    return this.http.post<any>(`${this.urlApi}/chapter`, body, { headers });
  }

  deleteChapter(number: number, subscriptionId: string): Observable<any> {
    const headers = this.setupRequestHeader();
    const params = new HttpParams().set('subscriptionId', subscriptionId).set('number', number.toString());

    return this.http.delete<any>(`${this.urlApi}/chapter`, { headers, params });
  }
}
