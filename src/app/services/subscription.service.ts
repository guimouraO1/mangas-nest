import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscriptions.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  protected http = inject(HttpClient);
  private urlApi = environment.url;

  getSubscriptions(page: number, date: string): Observable<Subscription[]> {
    const token: string | null = localStorage.getItem('token');
    const headers = new HttpHeaders().set('authorization', `${token}`);

    let params = new HttpParams().set('page', page);

    if (date) {
      params = params.set('date', date);
    }

    return this.http.get<Subscription[]>(`${this.urlApi}/sub`, { params, headers });
  }

}
