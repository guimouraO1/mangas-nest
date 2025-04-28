import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscriptions.model';

type GetSubscriptionsResponse = {
    subscriptions: Subscription[];
    subscriptionsCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class SubscriptionsService {
    private http = inject(HttpClient);
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

    unSubscribe(mangaId: string) {
        return this.http.delete(`${this.urlApi}/subscriptions/${mangaId}`);
    }
}
