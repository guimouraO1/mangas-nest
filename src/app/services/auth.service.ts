import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom, Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginForm } from '../models/login.model';
import { User } from '../models/user.model';
import { RegisterForm } from '../models/register.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
    private urlApi = environment.url;
    private userSubject = new BehaviorSubject<User | undefined>(undefined);
    user$ = this.userSubject.asObservable();

    login(loginForm: LoginForm): Observable<any> {
        return this.http.post(`${this.urlApi}/login`, loginForm);
    }

    register(registerForm: RegisterForm): Observable<any> {
        return this.http.post(`${this.urlApi}/register`, registerForm);
    }

    getUserObserver(): Observable<User | undefined> {
        return this.user$;
    }

    getUser(): User | undefined {
        return this.userSubject.value;
    }

    logout(): void {
        this.userSubject.next(undefined);
    }

    setUser(user: User): void {
        this.userSubject.next(user);
    }

    async Authentication(): Promise<void> {
        const token: any = localStorage.getItem('token');
        const headers = new HttpHeaders().set('authorization', `${token}`);

        if (!token) {
            return;
        }

        try {
            const res: any = await firstValueFrom(this.http.get(`${this.urlApi}/auth`, { headers }).pipe(take(1)));
            this.userSubject.next(res.user);
        } catch (error) {
            this.userSubject.next(undefined);
        }
    }

    decodePayloadJWT(token: string) {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return false;
        }
    }
}
