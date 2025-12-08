import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/Login';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/login';
  private tokenKey = 'token';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: Login): Observable<string> {
    return this.http.post(this.apiUrl, credentials, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem(this.tokenKey, token); // stocker le token
        this.loggedInSubject.next(true);           // notifier tous les abonnés
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasValidToken(): boolean {
    return !!localStorage.getItem(this.tokenKey); // simple check pour le moment
  }
}



//Gère l'application state
