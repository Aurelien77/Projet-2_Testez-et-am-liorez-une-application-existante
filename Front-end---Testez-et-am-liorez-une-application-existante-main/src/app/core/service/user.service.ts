import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/user-response.model';
import { UpdateUser } from '../models/update-user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  register(user: Register): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }

  getAllUsers(): Observable<UserResponse[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.httpClient.get<UserResponse[]>('http://localhost:8080/api/users', { headers });
  }
  
  deleteUser(userId: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.httpClient.delete<void>(`http://localhost:8080/api/users/${userId}`, { headers });
  }

  getUserById(userId: number): Observable<UserResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.httpClient.get<UserResponse>(`http://localhost:8080/api/users/${userId}`, { headers });
  }

  updateUser(userId: number, user: UpdateUser): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.put(`http://localhost:8080/api/users/${userId}`, user, { headers });
  }
}