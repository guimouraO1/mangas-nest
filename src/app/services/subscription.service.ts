import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscriptions.model';
import { AuthService } from './auth.service';

type GetSubscriptionsResponse = {
  subscriptions: Subscription[];
}

type GetSubscriptionsCountResponse = {
  subscriptionsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  protected http = inject(HttpClient);
  protected authService = inject(AuthService)
  private urlApi = environment.url;

  getSubscriptions(page: number, offset: number): Observable<GetSubscriptionsResponse> {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('offset', offset);

    return this.http.get<GetSubscriptionsResponse>(`${this.urlApi}/subscriptions`, { params });
  }

  getSubscriptionsCount(): Observable<GetSubscriptionsCountResponse> {
    return this.http.get<GetSubscriptionsCountResponse>(`${this.urlApi}/subscriptions/count`);
  }

  subscribe(mangaId: string, rating: number) {
    return this.http.post(`${this.urlApi}/subscriptions`, { mangaId, rating });
  }

  unSubscribe(subscriptionId: string) {
    return this.http.delete(`${this.urlApi}/subscriptions/${subscriptionId}`);
  }
}
