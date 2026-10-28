import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { API_CONFIG } from '../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = API_CONFIG.endpoints.users;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(userName: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userName}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(userName: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userName}`, user);
  }

  delete(userName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userName}`);
  }
}
