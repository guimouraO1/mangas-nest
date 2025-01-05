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

  createChapter(number: number, subscriptionId: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/chapter`, { subscriptionId, number });
  }

  deleteChapter(number: number, subscriptionId: string): Observable<any> {
    const url = `${this.urlApi}/chapter/${subscriptionId}/${number}`;
    return this.http.delete(url);
  }
}
