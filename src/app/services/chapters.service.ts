import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ChaptersService {
    private urlApi = environment.apiUrl;
    protected http = inject(HttpClient);

    createChapter(number: number, subscriptionId: string) {
        return this.http.post(`${this.urlApi}/chapter`, { subscriptionId, number });
    }

    deleteChapter(number: number, subscriptionId: string) {
        const url = `${this.urlApi}/chapter/${subscriptionId}/${number}`;
        return this.http.delete(url);
    }
}
