import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom, Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginForm } from '../models/login.model';
import { User } from '../models/user.model';

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

  async confirmAuthentication(): Promise<boolean> {
    const token: any = localStorage.getItem('token');
    const headers = new HttpHeaders().set('authorization', `${token}`);

    if (!token) {
      return false;
    }
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.urlApi}/auth`, { headers }).pipe(take(1))
      );

      this.userSubject.next(res.user);

      return true;
    } catch (error) {
      return false;
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
