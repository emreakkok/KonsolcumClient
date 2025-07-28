import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private jwtHelper : JwtHelperService) { 
    this.identityCheck();
  }

  identityCheck(){
    if (typeof window !== 'undefined' && window.localStorage) {
      const token: string | null = localStorage.getItem("accessToken");
      const refreshToken: string | null = localStorage.getItem("refreshToken");

      let expired: boolean;
      try {
        expired = this.jwtHelper.isTokenExpired(token);
      } catch {
        expired = true;
      }

      // Hem accessToken hem de refreshToken kontrol et
      const isAuth = token != null && !expired && refreshToken != null;
      this._isAuthenticated.next(isAuth);
    } else {
      this._isAuthenticated.next(false);
    }
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }

  // Observable olarak da sunabilirsiniz
  get isAuthenticated$() {
    return this._isAuthenticated.asObservable();
  }


  get userRoles(): string[] {
  const token = localStorage.getItem("accessToken");
  if (!token) return [];

  const decodedToken: any = this.jwtHelper.decodeToken(token);

  const roleClaim = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!roleClaim) return [];
  return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
}

  hasOnlyRole(role: string): boolean {
  const roles = this.userRoles.map(r => r.trim());
  return roles.length === 1 && roles[0] === role;
}


  // Çıkış için ayrı bir metod
  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this._isAuthenticated.next(false);
  }

}
