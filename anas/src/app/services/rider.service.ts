import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rider } from '../models/rider.model';
import { API_CONFIG } from '../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RiderService {

  private readonly apiUrl = API_CONFIG.endpoints.riders;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rider[]> {
    return this.http.get<Rider[]>(this.apiUrl);
  }

  getById(id: number): Observable<Rider> {
    return this.http.get<Rider>(`${this.apiUrl}/${id}`);
  }

  create(rider: Rider): Observable<Rider> {
    return this.http.post<Rider>(this.apiUrl, rider);
  }

  update(id: number, rider: Rider): Observable<Rider> {
    return this.http.put<Rider>(`${this.apiUrl}/${id}`, rider);
  }

  updateStatus(id: number, status: string): Observable<Rider> {
    return this.http.patch<Rider>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
