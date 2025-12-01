import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Booking, BookingStatus, CreateBookingRequest } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly API_URL = 'http://localhost:8080/api/bookings';
  
  constructor(private http: HttpClient) {}
  
  create(request: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.API_URL, request);
  }
  
  getById(id: number): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.API_URL}/${id}`);
  }
  
  getByNumber(bookingNumber: string): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.API_URL}/number/${bookingNumber}`);
  }
  
  getMyBookings(page = 0, size = 10): Observable<ApiResponse<PageResponse<Booking>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Booking>>>(`${this.API_URL}/my-bookings`, { params });
  }
  
  getActiveBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.API_URL}/active`);
  }
  
  updateStatus(id: number, status: BookingStatus, reason?: string): Observable<ApiResponse<Booking>> {
    let params = new HttpParams().set('status', status);
    if (reason) {
      params = params.set('reason', reason);
    }
    return this.http.patch<ApiResponse<Booking>>(`${this.API_URL}/${id}/status`, null, { params });
  }
  
  cancel(id: number, reason?: string): Observable<ApiResponse<Booking>> {
    let params = new HttpParams();
    if (reason) {
      params = params.set('reason', reason);
    }
    return this.http.patch<ApiResponse<Booking>>(`${this.API_URL}/${id}/cancel`, null, { params });
  }
  
  assignProvider(bookingId: number, providerId: number): Observable<ApiResponse<Booking>> {
    const params = new HttpParams().set('providerId', providerId.toString());
    return this.http.patch<ApiResponse<Booking>>(`${this.API_URL}/${bookingId}/assign-provider`, null, { params });
  }
}


