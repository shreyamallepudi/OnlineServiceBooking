import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly API_URL = 'http://localhost:8080/api/services';
  
  constructor(private http: HttpClient) {}
  
  getAll(page = 0, size = 12): Observable<ApiResponse<PageResponse<Service>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Service>>>(this.API_URL, { params });
  }
  
  getById(id: number): Observable<ApiResponse<Service>> {
    return this.http.get<ApiResponse<Service>>(`${this.API_URL}/${id}`);
  }
  
  getByCategory(categoryId: number): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.API_URL}/category/${categoryId}`);
  }
  
  getFeatured(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.API_URL}/featured`);
  }
  
  getPopular(limit = 8): Observable<ApiResponse<Service[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<Service[]>>(`${this.API_URL}/popular`, { params });
  }
  
  getTopRated(limit = 8): Observable<ApiResponse<Service[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ApiResponse<Service[]>>(`${this.API_URL}/top-rated`, { params });
  }
  
  search(query: string, page = 0, size = 12): Observable<ApiResponse<PageResponse<Service>>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Service>>>(`${this.API_URL}/search`, { params });
  }
  
  create(service: Partial<Service>): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(this.API_URL, service);
  }
  
  update(id: number, service: Partial<Service>): Observable<ApiResponse<Service>> {
    return this.http.put<ApiResponse<Service>>(`${this.API_URL}/${id}`, service);
  }
  
  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}


