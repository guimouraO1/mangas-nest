import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscriptions.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  protected http = inject(HttpClient);
  protected authService = inject(AuthService)
  private urlApi = environment.url;

  protected setupRequestHeader() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSubscriptions(page: number, offset: number): Observable<Subscription[]> {
    const headers = this.setupRequestHeader();

    let params = new HttpParams();

    params = params.set('page', page);
    params = params.set('offset', offset);

    return this.http.get<Subscription[]>(`${this.urlApi}/sub`, { params, headers });
  }

  subscribe(mangaId: string, rating: number) {
    const headers = this.setupRequestHeader();
    const body = { mangaId, rating }

    return this.http.post(`${this.urlApi}/sub`, body, { headers });
  }

  unSubscribe(subscriptionId: string) {
    const headers = this.setupRequestHeader();
    let params = new HttpParams().set('subscriptionId', subscriptionId);

    return this.http.delete(`${this.urlApi}/sub`, { params, headers });
  }
}
