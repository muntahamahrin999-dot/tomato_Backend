import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rider } from '../models/rider.model';
import { Delivery } from '../models/delivery.model';
import { API_CONFIG } from '../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private readonly ridersUrl = API_CONFIG.endpoints.riders;

  constructor(private http: HttpClient) {}

  getRiders(): Observable<Rider[]> {
    return this.http.get<Rider[]>(this.ridersUrl);
  }

  getRiderById(id: number): Observable<Rider> {
    return this.http.get<Rider>(`${this.ridersUrl}/${id}`);
  }

  createRider(rider: Rider): Observable<Rider> {
    return this.http.post<Rider>(this.ridersUrl, rider);
  }

  updateRider(id: number, rider: Rider): Observable<Rider> {
    return this.http.put<Rider>(`${this.ridersUrl}/${id}`, rider);
  }

  deleteRider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ridersUrl}/${id}`);
  }
}
