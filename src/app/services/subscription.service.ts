import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Subscription } from '../models/subscriptions.model';

type GetSubscriptionsResponse = {
    subscriptions: Subscription[];
    subscriptionsCount: number;
}

type GetSubscriptionsCountResponse = {
    subscriptionsCount: number;
  }

@Injectable({
    providedIn: 'root'
})
export class SubscriptionsService {
    private http = inject(HttpClient);
    private tokenService = inject(TokenService);
    private isUserAuthenticated = new BehaviorSubject<boolean>(false);
    private isUserAuthenticated$ = this.isUserAuthenticated.asObservable();
    private urlApi = environment.apiUrl;

    getSubscriptions(page: number, offset: number): Observable<GetSubscriptionsResponse> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('offset', offset);

        return this.http.get<GetSubscriptionsResponse>(`${this.urlApi}/subscriptions`, { params });
    }

    subscribe(mangaId: string, rating: number) {
        return this.http.post(`${this.urlApi}/subscriptions`, { mangaId, rating });
    }

    unSubscribe(subscriptionId: string) {
        return this.http.delete(`${this.urlApi}/subscriptions/${subscriptionId}`);
    }
}
