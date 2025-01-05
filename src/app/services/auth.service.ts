import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginForm } from '../models/login.model';
import { RegisterForm } from '../models/register.model';
import { TokenService } from './token.service';

interface RefreshTokenResponse {
    token: string;
}

interface StartSessionResponse {
    token: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
    private urlApi = environment.url;
    private tokenService = inject(TokenService)
    private isUserAuthenticated = new BehaviorSubject<boolean>(false);
    public isUserAuthenticated$ = this.isUserAuthenticated.asObservable();

    verifyUserAuth(): void {
        const user = this.tokenService.decodePayloadJWT();
        if (user && user.role && user.sub) {
            return this.setIsUserAuthenticated(true);
        };

        return this.setIsUserAuthenticated(false);
    }

    getIsUserAuthenticated(): Observable<boolean> {
        return this.isUserAuthenticated$;
    }

    setIsUserAuthenticated(value: boolean): void {
        this.isUserAuthenticated.next(value);
    }

    startSession(loginForm: LoginForm): Observable<StartSessionResponse> {
        return this.http.post<StartSessionResponse>(`${this.urlApi}/auth/session`, loginForm);
    }

    endSession(): Observable<any> {
        return this.http.post(`${this.urlApi}/auth/end-session`, {withCredentials: true});
    }

    refreshToken(): Observable<RefreshTokenResponse> {
        return this.http.patch<RefreshTokenResponse>(`${this.urlApi}/auth/refresh-token`, {withCredentials: true});
    }

    register(registerForm: RegisterForm): Observable<any> {
        return this.http.post(`${this.urlApi}/user`, registerForm);
    }
}
