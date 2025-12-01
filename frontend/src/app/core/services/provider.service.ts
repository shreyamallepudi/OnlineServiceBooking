import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { ServiceProvider } from '../models/provider.model';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private readonly API_URL = 'http://localhost:8080/api/providers';
  
  constructor(private http: HttpClient) {}
  
  getTopRated(limit = 8): Observable<ApiResponse<ServiceProvider[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<ServiceProvider[]>>(`${this.API_URL}/top-rated`, { params });
  }
  
  getById(id: number): Observable<ApiResponse<ServiceProvider>> {
    return this.http.get<ApiResponse<ServiceProvider>>(`${this.API_URL}/${id}`);
  }
  
  getByUserId(userId: number): Observable<ApiResponse<ServiceProvider>> {
    return this.http.get<ApiResponse<ServiceProvider>>(`${this.API_URL}/user/${userId}`);
  }
  
  getByCategory(categoryId: number, page = 0, size = 12): Observable<ApiResponse<PageResponse<ServiceProvider>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<ServiceProvider>>>(`${this.API_URL}/category/${categoryId}`, { params });
  }
  
  getMyProfile(): Observable<ApiResponse<ServiceProvider>> {
    return this.http.get<ApiResponse<ServiceProvider>>(`${this.API_URL}/profile`);
  }
  
  updateProfile(profile: Partial<ServiceProvider>): Observable<ApiResponse<ServiceProvider>> {
    return this.http.put<ApiResponse<ServiceProvider>>(`${this.API_URL}/profile`, profile);
  }
  
  toggleAvailability(): Observable<ApiResponse<ServiceProvider>> {
    return this.http.patch<ApiResponse<ServiceProvider>>(`${this.API_URL}/toggle-availability`, null);
  }
  
  getMyBookings(page = 0, size = 10): Observable<ApiResponse<PageResponse<Booking>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Booking>>>(`${this.API_URL}/my-bookings`, { params });
  }
}


