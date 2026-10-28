import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Food } from '../models/food.model';
import { API_CONFIG } from '../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private readonly apiUrl = API_CONFIG.endpoints.foods;

  constructor(private http: HttpClient) {}

  getAll(category?: string, search?: string, restaurantId?: number, availableOnly = false): Observable<Food[]> {
    let params = new HttpParams();
    if (category && category !== 'All') {
      params = params.set('category', category);
    }
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }
    if (restaurantId) {
      params = params.set('restaurantId', restaurantId.toString());
    }
    if (availableOnly) {
      params = params.set('availableOnly', 'true');
    }

    return this.http.get<Food[]>(this.apiUrl, { params }).pipe(
      map(apiFoods => {
        const localStored = typeof window !== 'undefined' ? localStorage.getItem('tomato_restaurant_foods') : null;
        const localFoods: Food[] = localStored ? JSON.parse(localStored) : [];
        const allMap = new Map<any, Food>();
        [...(apiFoods || []), ...localFoods].forEach(f => {
          allMap.set(f.id || f.name, f);
        });
        let result = Array.from(allMap.values());
        if (availableOnly) {
          result = result.filter(f => f.available);
        }
        return result;
      }),
      catchError(() => {
        const localStored = typeof window !== 'undefined' ? localStorage.getItem('tomato_restaurant_foods') : null;
        const localFoods: Food[] = localStored ? JSON.parse(localStored) : [
          { id: 1, name: 'Classic Beef Burger', category: 'Burger', price: 280, available: true, preparationTime: 15, icon: '🍔', description: 'Juicy beef patty with special sauce' },
          { id: 2, name: 'Pepperoni Feast Pizza', category: 'Pizza', price: 650, available: true, preparationTime: 25, icon: '🍕', description: 'Loaded with beef pepperoni and mozzarella' },
          { id: 3, name: 'Chicken Biryani', category: 'Biryani', price: 320, available: true, preparationTime: 20, icon: '🍚', description: 'Traditional aromatic chicken biryani' }
        ];
        return of(localFoods);
      })
    );
  }

  getById(id: number): Observable<Food> {
    return this.http.get<Food>(`${this.apiUrl}/${id}`);
  }

  create(food: Food): Observable<Food> {
    return this.http.post<Food>(this.apiUrl, food);
  }

  update(id: number, food: Food): Observable<Food> {
    return this.http.put<Food>(`${this.apiUrl}/${id}`, food);
  }

  toggleAvailability(id: number): Observable<Food> {
    return this.http.patch<Food>(`${this.apiUrl}/${id}/toggle-availability`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
