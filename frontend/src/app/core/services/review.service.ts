import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Review, CreateReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly API_URL = 'http://localhost:8080/api/reviews';
  
  constructor(private http: HttpClient) {}
  
  create(request: CreateReviewRequest): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(this.API_URL, request);
  }
  
  getByProvider(providerId: number, page = 0, size = 10): Observable<ApiResponse<PageResponse<Review>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Review>>>(`${this.API_URL}/provider/${providerId}`, { params });
  }
  
  getByBooking(bookingId: number): Observable<ApiResponse<Review>> {
    return this.http.get<ApiResponse<Review>>(`${this.API_URL}/booking/${bookingId}`);
  }
  
  respondToReview(reviewId: number, response: string): Observable<ApiResponse<Review>> {
    const params = new HttpParams().set('response', response);
    return this.http.patch<ApiResponse<Review>>(`${this.API_URL}/${reviewId}/respond`, null, { params });
  }
}


