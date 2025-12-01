import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ServiceService } from '../../core/services/service.service';
import { ProviderService } from '../../core/services/provider.service';
import { ReviewService } from '../../core/services/review.service';
import { Service } from '../../core/models/service.model';
import { ServiceProvider } from '../../core/models/provider.model';
import { Review } from '../../core/models/review.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzRateModule,
    NzTagModule,
    NzAvatarModule,
    NzDividerModule,
    NzSpinModule
  ],
  template: `
    <div class="service-detail-page">
      <nz-spin [nzSpinning]="loading">
        @if (service) {
          <!-- Hero Section -->
          <div class="service-hero">
            <div class="hero-image" [style.background-image]="'url(' + (service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800') + ')'">
              <div class="hero-overlay"></div>
            </div>
            <div class="container">
              <div class="hero-content">
                <a [routerLink]="['/services', service.categoryId]" class="breadcrumb">
                  <span nz-icon nzType="arrow-left" nzTheme="outline"></span>
                  {{ service.categoryName }}
                </a>
                <h1>{{ service.name }}</h1>
                <div class="service-meta">
                  <div class="rating">
                    <nz-rate [ngModel]="service.averageRating || 0" nzAllowHalf [nzDisabled]="true"></nz-rate>
                    <span class="rating-value">{{ (service.averageRating || 0).toFixed(1) }}</span>
                    <span class="booking-count">({{ service.totalBookings || 0 }} bookings)</span>
                  </div>
                  @if (service.isFeatured) {
                    <nz-tag nzColor="gold">⭐ Featured Service</nz-tag>
                  }
                </div>
              </div>
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="content-section">
            <div class="container">
              <div class="content-grid">
                <!-- Left Column -->
                <div class="main-content">
                  <div class="content-card">
                    <h2>About This Service</h2>
                    <p class="description">{{ service.description }}</p>
                    
                    @if (service.features && service.features.length > 0) {
                      <h3>What's Included</h3>
                      <ul class="features-list">
                        @for (feature of service.features; track feature) {
                          <li>
                            <span nz-icon nzType="check-circle" nzTheme="fill"></span>
                            {{ feature }}
                          </li>
                        }
                      </ul>
                    }
                    
                    @if (service.durationMinutes) {
                      <div class="duration-info">
                        <span nz-icon nzType="clock-circle" nzTheme="outline"></span>
                        <span>Estimated Duration: <strong>{{ service.durationMinutes }} minutes</strong></span>
                      </div>
                    }
                  </div>
                  
                  <!-- Available Providers -->
                  <div class="content-card">
                    <h2>Available Professionals</h2>
                    @if (providers.length > 0) {
                      <div class="providers-list">
                        @for (provider of providers; track provider.id) {
                          <div class="provider-item">
                            <nz-avatar 
                              [nzSize]="56"
                              [nzText]="provider.user.firstName.charAt(0)"
                              [nzSrc]="provider.user.profileImage"
                              style="background: var(--gradient-primary);">
                            </nz-avatar>
                            <div class="provider-info">
                              <h4>
                                {{ provider.user.fullName }}
                                @if (provider.isVerified) {
                                  <span nz-icon nzType="safety-certificate" nzTheme="fill" class="verified"></span>
                                }
                              </h4>
                              <p>{{ provider.experienceYears }}+ years experience</p>
                              <div class="provider-rating">
                                <nz-rate [ngModel]="provider.averageRating || 0" nzAllowHalf [nzDisabled]="true"></nz-rate>
                                <span>({{ provider.totalReviews || 0 }})</span>
                              </div>
                            </div>
                            <div class="provider-stats">
                              <div class="stat">
                                <strong>{{ provider.completedJobs || 0 }}</strong>
                                <span>Jobs</span>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="no-providers">Providers will be assigned based on availability</p>
                    }
                  </div>
                  
                  <!-- Reviews -->
                  <div class="content-card">
                    <h2>Customer Reviews</h2>
                    @if (reviews.length > 0) {
                      <div class="reviews-list">
                        @for (review of reviews; track review.id) {
                          <div class="review-item">
                            <div class="review-header">
                              <nz-avatar [nzText]="review.customerName.charAt(0)" [nzSrc]="review.customerImage"></nz-avatar>
                              <div class="review-meta">
                                <strong>{{ review.customerName }}</strong>
                                <nz-rate [ngModel]="review.rating" nzAllowHalf [nzDisabled]="true"></nz-rate>
                              </div>
                              <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
                            </div>
                            <p class="review-comment">{{ review.comment }}</p>
                            @if (review.providerResponse) {
                              <div class="provider-response">
                                <strong>Provider Response:</strong>
                                <p>{{ review.providerResponse }}</p>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="no-reviews">No reviews yet. Be the first to review!</p>
                    }
                  </div>
                </div>
                
                <!-- Right Column - Booking Card -->
                <div class="sidebar">
                  <div class="booking-card">
                    <div class="price-section">
                      <span class="price-label">Starting at</span>
                      <span class="price">\${{ service.basePrice }}</span>
                    </div>
                    
                    <nz-divider></nz-divider>
                    
                    <div class="booking-features">
                      <div class="feature">
                        <span nz-icon nzType="safety-certificate" nzTheme="outline"></span>
                        <span>Verified Professionals</span>
                      </div>
                      <div class="feature">
                        <span nz-icon nzType="calendar" nzTheme="outline"></span>
                        <span>Flexible Scheduling</span>
                      </div>
                      <div class="feature">
                        <span nz-icon nzType="dollar" nzTheme="outline"></span>
                        <span>Transparent Pricing</span>
                      </div>
                      <div class="feature">
                        <span nz-icon nzType="star" nzTheme="outline"></span>
                        <span>Satisfaction Guaranteed</span>
                      </div>
                    </div>
                    
                    <button nz-button nzType="primary" nzSize="large" nzBlock [routerLink]="['/booking', service.id]">
                      Book Now
                      <span nz-icon nzType="arrow-right" nzTheme="outline"></span>
                    </button>
                    
                    <p class="booking-note">
                      <span nz-icon nzType="info-circle" nzTheme="outline"></span>
                      Free cancellation up to 24 hours before
                    </p>
                  </div>
                  
                  <div class="help-card">
                    <h4>Need Help?</h4>
                    <p>Our customer support team is here to assist you</p>
                    <button nz-button nzBlock>
                      <span nz-icon nzType="message" nzTheme="outline"></span>
                      Chat with Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </nz-spin>
    </div>
  `,
  styles: [`
    .service-detail-page {
      padding-top: 72px;
      min-height: 100vh;
    }
    
    .service-hero {
      position: relative;
      height: 400px;
      
      .hero-image {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
      }
      
      .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(10, 22, 40, 0.7) 0%, rgba(10, 22, 40, 0.9) 100%);
      }
      
      .container {
        position: relative;
        height: 100%;
        display: flex;
        align-items: flex-end;
        padding-bottom: 48px;
      }
      
      .hero-content {
        .breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 16px;
          transition: color 0.2s;
          
          &:hover {
            color: white;
          }
        }
        
        h1 {
          font-size: 3rem;
          color: white;
          margin-bottom: 16px;
        }
        
        .service-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          
          .rating {
            display: flex;
            align-items: center;
            gap: 8px;
            
            nz-rate {
              color: #fbbf24;
            }
            
            .rating-value {
              color: white;
              font-weight: 600;
            }
            
            .booking-count {
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }
      }
    }
    
    .content-section {
      padding: 48px 0 80px;
      background: var(--neutral-50);
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
    }
    
    .content-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 32px;
      margin-bottom: 24px;
      
      h2 {
        font-size: 1.5rem;
        margin-bottom: 20px;
      }
      
      h3 {
        font-size: 1.125rem;
        margin: 24px 0 16px;
      }
      
      .description {
        color: var(--neutral-600);
        line-height: 1.8;
        font-size: 15px;
      }
      
      .features-list {
        list-style: none;
        padding: 0;
        
        li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          font-size: 15px;
          color: var(--neutral-700);
          
          span[nz-icon] {
            color: var(--primary-500);
            font-size: 18px;
          }
        }
      }
      
      .duration-info {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px;
        background: var(--primary-50);
        border-radius: var(--radius-md);
        margin-top: 24px;
        color: var(--primary-700);
        
        span[nz-icon] {
          font-size: 20px;
        }
      }
    }
    
    .providers-list {
      .provider-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        border: 1px solid var(--neutral-100);
        border-radius: var(--radius-lg);
        margin-bottom: 12px;
        transition: all 0.2s;
        
        &:hover {
          border-color: var(--primary-200);
          box-shadow: var(--shadow-sm);
        }
        
        .provider-info {
          flex: 1;
          
          h4 {
            font-size: 1rem;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
            
            .verified {
              color: var(--primary-500);
            }
          }
          
          p {
            font-size: 13px;
            color: var(--neutral-500);
            margin-bottom: 8px;
          }
          
          .provider-rating {
            display: flex;
            align-items: center;
            gap: 8px;
            
            nz-rate {
              font-size: 12px;
            }
            
            span {
              font-size: 13px;
              color: var(--neutral-500);
            }
          }
        }
        
        .provider-stats {
          text-align: center;
          
          .stat {
            display: flex;
            flex-direction: column;
            
            strong {
              font-family: 'Outfit', sans-serif;
              font-size: 1.25rem;
              color: var(--neutral-800);
            }
            
            span {
              font-size: 12px;
              color: var(--neutral-500);
            }
          }
        }
      }
    }
    
    .no-providers, .no-reviews {
      color: var(--neutral-500);
      font-style: italic;
    }
    
    .reviews-list {
      .review-item {
        padding: 20px 0;
        border-bottom: 1px solid var(--neutral-100);
        
        &:last-child {
          border-bottom: none;
        }
        
        .review-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          
          .review-meta {
            flex: 1;
            
            strong {
              display: block;
              margin-bottom: 4px;
            }
            
            nz-rate {
              font-size: 12px;
            }
          }
          
          .review-date {
            font-size: 13px;
            color: var(--neutral-400);
          }
        }
        
        .review-comment {
          color: var(--neutral-600);
          line-height: 1.7;
        }
        
        .provider-response {
          margin-top: 12px;
          padding: 12px;
          background: var(--neutral-50);
          border-radius: var(--radius-md);
          font-size: 14px;
          
          strong {
            color: var(--neutral-700);
            display: block;
            margin-bottom: 4px;
          }
          
          p {
            color: var(--neutral-600);
            margin: 0;
          }
        }
      }
    }
    
    .sidebar {
      position: sticky;
      top: 96px;
      align-self: start;
    }
    
    .booking-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 28px;
      box-shadow: var(--shadow-lg);
      
      .price-section {
        text-align: center;
        
        .price-label {
          display: block;
          font-size: 14px;
          color: var(--neutral-500);
          margin-bottom: 4px;
        }
        
        .price {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--neutral-900);
        }
      }
      
      .booking-features {
        margin-bottom: 24px;
        
        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          font-size: 14px;
          color: var(--neutral-600);
          
          span[nz-icon] {
            color: var(--primary-500);
            font-size: 18px;
          }
        }
      }
      
      button[nzType="primary"] {
        height: 52px !important;
        font-size: 16px !important;
      }
      
      .booking-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-top: 16px;
        font-size: 13px;
        color: var(--neutral-500);
      }
    }
    
    .help-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 24px;
      margin-top: 16px;
      text-align: center;
      
      h4 {
        margin-bottom: 8px;
      }
      
      p {
        font-size: 14px;
        color: var(--neutral-500);
        margin-bottom: 16px;
      }
    }
    
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .sidebar {
        position: static;
      }
    }
    
    @media (max-width: 640px) {
      .service-hero h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private serviceService = inject(ServiceService);
  private providerService = inject(ProviderService);
  private reviewService = inject(ReviewService);
  
  service: Service | null = null;
  providers: ServiceProvider[] = [];
  reviews: Review[] = [];
  loading = false;
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadService(+params['id']);
      }
    });
  }
  
  loadService(id: number): void {
    this.loading = true;
    this.serviceService.getById(id).subscribe(response => {
      this.loading = false;
      if (response.success) {
        this.service = response.data;
        this.loadProviders();
      }
    });
  }
  
  loadProviders(): void {
    if (this.service?.categoryId) {
      this.providerService.getByCategory(this.service.categoryId, 0, 5).subscribe(response => {
        if (response.success) {
          this.providers = response.data.content;
        }
      });
    }
  }
}


