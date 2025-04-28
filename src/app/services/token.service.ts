import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Role } from '../models/user.model';

export type JwtPayload = {
    role: Role;
    sub: string;
    iat: number;
    exp: number;
};

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    getAccessToken(): string | null {
        return localStorage.getItem('AccessToken');
    }

    clearAccessToken() {
        localStorage.removeItem('AccessToken');
    }

    setToken(token: string) {
        localStorage.setItem('AccessToken', token);
    }

    decodeToken(): JwtPayload | null {
        const token = this.getAccessToken();
        if (!token) return null;
        return jwtDecode(token);
    }
}
