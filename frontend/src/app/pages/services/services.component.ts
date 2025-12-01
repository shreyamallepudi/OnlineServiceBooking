import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CategoryService } from '../../core/services/category.service';
import { ServiceService } from '../../core/services/service.service';
import { Category } from '../../core/models/category.model';
import { Service } from '../../core/models/service.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzCardModule,
    NzRateModule,
    NzPaginationModule,
    NzSpinModule,
    NzEmptyModule
  ],
  template: `
    <div class="services-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <h1>{{ selectedCategory ? selectedCategory.name : 'All Services' }}</h1>
          <p>{{ selectedCategory?.description || 'Browse our complete range of professional services' }}</p>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="filters-section">
        <div class="container">
          <div class="filters-bar">
            <div class="search-filter">
              <nz-input-group [nzPrefix]="prefixIcon">
                <input nz-input placeholder="Search services..." [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" />
              </nz-input-group>
              <ng-template #prefixIcon>
                <span nz-icon nzType="search"></span>
              </ng-template>
            </div>
            
            <div class="category-filter">
              <nz-select [(ngModel)]="selectedCategoryId" (ngModelChange)="onCategoryChange($event)" nzPlaceHolder="All Categories">
                <nz-option [nzValue]="null" nzLabel="All Categories"></nz-option>
                @for (category of categories; track category.id) {
                  <nz-option [nzValue]="category.id" [nzLabel]="category.name"></nz-option>
                }
              </nz-select>
            </div>
            
            <div class="sort-filter">
              <nz-select [(ngModel)]="sortBy" (ngModelChange)="onSortChange()" nzPlaceHolder="Sort by">
                <nz-option nzValue="popular" nzLabel="Most Popular"></nz-option>
                <nz-option nzValue="rating" nzLabel="Highest Rated"></nz-option>
                <nz-option nzValue="price_low" nzLabel="Price: Low to High"></nz-option>
                <nz-option nzValue="price_high" nzLabel="Price: High to Low"></nz-option>
              </nz-select>
            </div>
          </div>
          
          <div class="categories-chips">
            <button 
              class="chip" 
              [class.active]="!selectedCategoryId"
              (click)="selectCategory(null)">
              All
            </button>
            @for (category of categories; track category.id) {
              <button 
                class="chip" 
                [class.active]="selectedCategoryId === category.id"
                (click)="selectCategory(category.id)">
                <span nz-icon [nzType]="category.icon || 'appstore'" nzTheme="outline"></span>
                {{ category.name }}
              </button>
            }
          </div>
        </div>
      </div>
      
      <!-- Services Grid -->
      <div class="services-section">
        <div class="container">
          <nz-spin [nzSpinning]="loading">
            @if (services.length > 0) {
              <div class="results-info">
                <span>Showing {{ services.length }} of {{ totalElements }} services</span>
              </div>
              
              <div class="services-grid">
                @for (service of services; track service.id) {
                  <div class="service-card hover-lift">
                    <div class="service-image" [style.background-image]="'url(' + (service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400') + ')'">
                      @if (service.isFeatured) {
                        <span class="featured-badge">⭐ Featured</span>
                      }
                      <div class="service-overlay">
                        <button nz-button nzType="primary" [routerLink]="['/service', service.id]">View Details</button>
                      </div>
                    </div>
                    <div class="service-content">
                      <div class="service-category">{{ service.categoryName }}</div>
                      <h3>{{ service.name }}</h3>
                      <p class="service-desc">{{ service.description }}</p>
                      <div class="service-meta">
                        <div class="rating">
                          <nz-rate [ngModel]="service.averageRating || 0" nzAllowHalf [nzDisabled]="true"></nz-rate>
                          <span class="rating-value">{{ (service.averageRating || 0).toFixed(1) }}</span>
                        </div>
                        <div class="price">
                          <span class="price-value">\${{ service.basePrice }}</span>
                        </div>
                      </div>
                      <div class="service-features">
                        @for (feature of service.features?.slice(0, 2); track feature) {
                          <span class="feature">
                            <span nz-icon nzType="check" nzTheme="outline"></span>
                            {{ feature }}
                          </span>
                        }
                      </div>
                      <button nz-button nzType="primary" nzBlock [routerLink]="['/booking', service.id]">
                        Book Now
                      </button>
                    </div>
                  </div>
                }
              </div>
              
              <div class="pagination-wrapper">
                <nz-pagination 
                  [nzPageIndex]="pageIndex" 
                  [nzPageSize]="pageSize" 
                  [nzTotal]="totalElements"
                  [nzShowSizeChanger]="true"
                  [nzPageSizeOptions]="[12, 24, 48]"
                  (nzPageIndexChange)="onPageChange($event)"
                  (nzPageSizeChange)="onPageSizeChange($event)">
                </nz-pagination>
              </div>
            } @else if (!loading) {
              <nz-empty 
                [nzNotFoundContent]="'No services found'" 
                [nzNotFoundFooter]="emptyFooter">
              </nz-empty>
              <ng-template #emptyFooter>
                <button nz-button nzType="primary" (click)="clearFilters()">Clear Filters</button>
              </ng-template>
            }
          </nz-spin>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .services-page {
      padding-top: 72px;
    }
    
    .page-header {
      background: linear-gradient(135deg, #0a1628 0%, #1a2f4a 100%);
      padding: 60px 0;
      color: white;
      
      h1 {
        font-size: 2.5rem;
        margin-bottom: 8px;
        color: white;
      }
      
      p {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    
    .filters-section {
      background: white;
      border-bottom: 1px solid var(--neutral-100);
      padding: 24px 0;
      position: sticky;
      top: 72px;
      z-index: 100;
    }
    
    .filters-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      
      .search-filter {
        flex: 1;
        max-width: 400px;
        
        nz-input-group {
          width: 100%;
        }
      }
      
      .category-filter,
      .sort-filter {
        width: 200px;
      }
    }
    
    .categories-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      
      .chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border: 1px solid var(--neutral-200);
        border-radius: var(--radius-full);
        background: white;
        font-size: 14px;
        font-weight: 500;
        color: var(--neutral-600);
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          border-color: var(--primary-500);
          color: var(--primary-600);
        }
        
        &.active {
          background: var(--primary-500);
          border-color: var(--primary-500);
          color: white;
        }
      }
    }
    
    .services-section {
      padding: 40px 0 80px;
      background: var(--neutral-50);
      min-height: 60vh;
    }
    
    .results-info {
      margin-bottom: 24px;
      color: var(--neutral-500);
      font-size: 14px;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    
    .service-card {
      background: white;
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--neutral-100);
      
      .service-image {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
        
        .featured-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: white;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
        }
        
        .service-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        &:hover .service-overlay {
          opacity: 1;
        }
      }
      
      .service-content {
        padding: 20px;
        
        .service-category {
          font-size: 12px;
          color: var(--primary-600);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        h3 {
          font-size: 1.125rem;
          margin-bottom: 8px;
        }
        
        .service-desc {
          font-size: 14px;
          color: var(--neutral-500);
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .service-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          
          .rating {
            display: flex;
            align-items: center;
            gap: 8px;
            
            nz-rate {
              font-size: 14px;
            }
            
            .rating-value {
              font-weight: 600;
            }
          }
          
          .price-value {
            font-family: 'Outfit', sans-serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary-600);
          }
        }
        
        .service-features {
          margin-bottom: 16px;
          
          .feature {
            display: block;
            font-size: 13px;
            color: var(--neutral-600);
            margin-bottom: 4px;
            
            span[nz-icon] {
              color: var(--primary-500);
              margin-right: 6px;
            }
          }
        }
      }
    }
    
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 48px;
    }
    
    @media (max-width: 1200px) {
      .services-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (max-width: 900px) {
      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .filters-bar {
        flex-wrap: wrap;
        
        .search-filter {
          max-width: none;
          width: 100%;
        }
      }
    }
    
    @media (max-width: 600px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private serviceService = inject(ServiceService);
  
  categories: Category[] = [];
  services: Service[] = [];
  selectedCategory: Category | null = null;
  selectedCategoryId: number | null = null;
  searchQuery = '';
  sortBy = 'popular';
  loading = false;
  
  pageIndex = 1;
  pageSize = 12;
  totalElements = 0;
  
  ngOnInit(): void {
    this.loadCategories();
    
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategoryId = +params['categoryId'];
      }
      this.loadServices();
    });
  }
  
  loadCategories(): void {
    this.categoryService.getAll().subscribe(response => {
      if (response.success) {
        this.categories = response.data;
        if (this.selectedCategoryId) {
          this.selectedCategory = this.categories.find(c => c.id === this.selectedCategoryId) || null;
        }
      }
    });
  }
  
  loadServices(): void {
    this.loading = true;
    
    if (this.selectedCategoryId) {
      this.serviceService.getByCategory(this.selectedCategoryId).subscribe(response => {
        this.loading = false;
        if (response.success) {
          this.services = response.data;
          this.totalElements = response.data.length;
        }
      });
    } else {
      this.serviceService.getAll(this.pageIndex - 1, this.pageSize).subscribe(response => {
        this.loading = false;
        if (response.success) {
          this.services = response.data.content;
          this.totalElements = response.data.totalElements;
        }
      });
    }
  }
  
  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.selectedCategory = categoryId 
      ? this.categories.find(c => c.id === categoryId) || null 
      : null;
    this.pageIndex = 1;
    this.loadServices();
  }
  
  onCategoryChange(categoryId: number | null): void {
    this.selectCategory(categoryId);
  }
  
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.serviceService.search(this.searchQuery, 0, this.pageSize).subscribe(response => {
        this.loading = false;
        if (response.success) {
          this.services = response.data.content;
          this.totalElements = response.data.totalElements;
        }
      });
    } else {
      this.loadServices();
    }
  }
  
  onSortChange(): void {
    this.loadServices();
  }
  
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadServices();
  }
  
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadServices();
  }
  
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.selectedCategory = null;
    this.sortBy = 'popular';
    this.loadServices();
  }
}


