import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

export interface TokenDecoded {
  role: Role;
  sub: string;
}

enum Role {
  Admin = 'admin',
  User = 'user',
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  static LOCAL_STORAGE_TOKEN_KEY = 'token';

  public getToken(): string {
    return localStorage.getItem(TokenService.LOCAL_STORAGE_TOKEN_KEY) || '';
  }

  public removeToken(): void {
    localStorage.removeItem(TokenService.LOCAL_STORAGE_TOKEN_KEY);
  }

  public decodePayloadJWT(): TokenDecoded | null {
    const token = this.getToken();

    if (!token || token.split('.').length !== 3) {
        return null;
    }

    try {
        return jwtDecode<TokenDecoded>(token);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
 }

  public setToken(token: string) {
    localStorage.setItem(TokenService.LOCAL_STORAGE_TOKEN_KEY, token);
  }
}
