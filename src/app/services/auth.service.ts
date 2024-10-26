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

    signin(loginForm: LoginForm): Observable<any> {
        return this.http.post(`${this.urlApi}/auth`, loginForm);
    }

    register(registerForm: RegisterForm): Observable<any> {
        return this.http.post(`${this.urlApi}/signup`, registerForm);
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

    protected setupRequestHeader() {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    async Authentication(): Promise<void> {
        const headers = this.setupRequestHeader();

        try {
            const res: any = await firstValueFrom(this.http.get(`${this.urlApi}/authorize`, { headers }));
            this.setUser(this.decodePayloadJWT(res.tokenJwt));
        } catch (error) {
            this.userSubject.next(undefined);
        }
    }

    decodePayloadJWT(token: string) {
        try {
            const jwt: any = jwtDecode(token);
            return jwt;
        } catch (Error) {
            return false;
        }
    }
}
