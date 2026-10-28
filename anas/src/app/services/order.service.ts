import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { API_CONFIG } from '../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly apiUrl = API_CONFIG.endpoints.orders;
  private readonly STORAGE_KEY = 'tomato_restaurant_orders';

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    const newOrder: Order = {
      ...order,
      id: order.id || Date.now(),
      orderNumber: order.orderNumber || `#TOM-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: order.createdAt || new Date().toISOString(),
      status: order.status || 'PENDING',
      paymentStatus: order.paymentStatus || 'PAID'
    };

    const existing = this.getLocalOrders();
    existing.unshift(newOrder);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
      localStorage.setItem('lastOrder', JSON.stringify(newOrder));
    }

    return this.http.post<Order>(this.apiUrl, newOrder);
  }

  getAllOrders(status?: string, restaurant?: string, email?: string, phone?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (status && status !== 'All') {
      params = params.set('status', status);
    }
    if (restaurant && restaurant.trim() !== '') {
      params = params.set('restaurant', restaurant.trim());
    }
    if (email && email.trim() !== '') {
      params = params.set('email', email.trim());
    }
    if (phone && phone.trim() !== '') {
      params = params.set('phone', phone.trim());
    }

    return this.http.get<Order[]>(this.apiUrl, { params }).pipe(
      map(apiOrders => {
        const localOrders = this.getLocalOrders();
        const mapOrders = new Map<any, Order>();
        [...(apiOrders || []), ...localOrders].forEach(o => {
          mapOrders.set(o.id || o.orderNumber, o);
        });
        let result = Array.from(mapOrders.values());
        
        if (status && status !== 'All') {
          result = result.filter(o => (o.status || '').toUpperCase() === status.toUpperCase());
        }
        return result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }),
      catchError(() => {
        return of(this.getLocalOrders());
      })
    );
  }

  private getLocalOrders(): Order[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
        const last = localStorage.getItem('lastOrder');
        if (last) {
          const parsedLast = JSON.parse(last);
          return [parsedLast];
        }
      } catch (e) {}
    }
    return [];
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.getLocalOrders().find(o => o.id === id);
        return of(found || this.getLocalOrders()[0]);
      })
    );
  }

  updateStatus(id: number, status: string): Observable<Order> {
    const local = this.getLocalOrders();
    const item = local.find(o => o.id === id);
    if (item) {
      item.status = status;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(local));
      }
    }

    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(() => of(item || { id, status } as Order))
    );
  }

  updatePaymentStatus(id: number, paymentStatus: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/payment`, { paymentStatus });
  }

  deleteOrder(id: number): Observable<void> {
    const local = this.getLocalOrders().filter(o => o.id !== id);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(local));
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }
}
