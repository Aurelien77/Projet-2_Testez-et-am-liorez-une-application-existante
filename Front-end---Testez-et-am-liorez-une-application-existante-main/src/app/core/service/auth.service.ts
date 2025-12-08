import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/Login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/login';

  constructor(private http: HttpClient) { }

login(credentials: Login) {
  return this.http.post('http://localhost:8080/api/login', credentials, { responseType: 'text' });
}

}
