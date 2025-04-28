import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';

export type SignInForm = {
  email: string;
  password: string;
}

interface TokenResponse {
  token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private tokenService = inject(TokenService);
    private isUserAuthenticated = new BehaviorSubject<boolean>(false);
    private isUserAuthenticated$ = this.isUserAuthenticated.asObservable();

    initializeVerifyIsUserAuthenticated() {
        const token = this.tokenService.getAccessToken();
        if (!token) return;

        this.setIsUserAuthenticated(true);
    }

    getIsUserAuthenticated$(): Observable<boolean> {
        return this.isUserAuthenticated$;
    }

    getIsUserAuthenticated(): boolean {
        return this.isUserAuthenticated.value;
    }

    setIsUserAuthenticated(value: boolean): void {
        this.isUserAuthenticated.next(value);
    }

    refreshToken(): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(`${environment.apiUrl}/refresh-token`, {}, { withCredentials: true });
    }

    signOut() {
        return this.http.post(`${environment.apiUrl}/sign-out`, { withCredentials: true });
    }

    signIn(data: SignInForm) {
        return this.http.post<TokenResponse>(`${environment.apiUrl}/sign-in`, data, { withCredentials: true });
    }
}
