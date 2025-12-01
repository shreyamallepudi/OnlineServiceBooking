import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { CategoryService } from '../../core/services/category.service';
import { ServiceService } from '../../core/services/service.service';
import { ProviderService } from '../../core/services/provider.service';
import { Category } from '../../core/models/category.model';
import { Service } from '../../core/models/service.model';
import { ServiceProvider } from '../../core/models/provider.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzCardModule,
    NzRateModule,
    NzTagModule,
    NzAvatarModule,
    NzSkeletonModule
  ],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-pattern"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-badge animate-fade-in">
          <span class="badge-icon">✨</span>
          <span>Trusted by 50,000+ happy customers</span>
        </div>
        
        <h1 class="hero-title animate-fade-in" style="animation-delay: 0.1s">
          Home Services,<br/>
          <span class="gradient-text">Simplified.</span>
        </h1>
        
        <p class="hero-subtitle animate-fade-in" style="animation-delay: 0.2s">
          Book expert professionals for cleaning, repairs, beauty, and more.<br/>
          Quality service at your doorstep, just a few clicks away.
        </p>
        
        <div class="hero-search animate-fade-in" style="animation-delay: 0.3s">
          <div class="search-box">
            <span nz-icon nzType="search" nzTheme="outline" class="search-icon"></span>
            <input 
              type="text" 
              placeholder="What service do you need?"
              [(ngModel)]="searchQuery"
              (keyup.enter)="search()"
            />
            <button nz-button nzType="primary" (click)="search()">
              Search
            </button>
          </div>
          <div class="popular-searches">
            <span>Popular:</span>
            @for (term of popularSearches; track term) {
              <a [routerLink]="['/services']" [queryParams]="{q: term}">{{ term }}</a>
            }
          </div>
        </div>
        
        <div class="hero-stats animate-fade-in" style="animation-delay: 0.4s">
          <div class="stat">
            <span class="stat-value">10K+</span>
            <span class="stat-label">Expert Pros</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">50K+</span>
            <span class="stat-label">Happy Customers</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">4.9</span>
            <span class="stat-label">Average Rating</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Categories Section -->
    <section class="section categories-section">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Services</div>
          <h2>Explore Our Categories</h2>
          <p>Choose from our wide range of professional services</p>
        </div>
        
        <div class="categories-grid">
          @for (category of categories; track category.id; let i = $index) {
            <a [routerLink]="['/services', category.id]" class="category-card hover-lift" [style.animation-delay]="(i * 0.05) + 's'">
              <div class="category-image" [style.background-image]="'url(' + category.image + ')'">
                <div class="category-overlay"></div>
              </div>
              <div class="category-content">
                <span class="category-icon" nz-icon [nzType]="category.icon || 'appstore'" nzTheme="outline"></span>
                <h3>{{ category.name }}</h3>
                <p>{{ category.serviceCount || 0 }} services</p>
              </div>
            </a>
          }
        </div>
      </div>
    </section>
    
    <!-- Featured Services Section -->
    <section class="section featured-section">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Featured</div>
          <h2>Most Popular Services</h2>
          <p>Our most booked services by customers like you</p>
        </div>
        
        <div class="services-grid">
          @for (service of featuredServices; track service.id; let i = $index) {
            <div class="service-card hover-lift" [style.animation-delay]="(i * 0.05) + 's'">
              <div class="service-image" [style.background-image]="'url(' + (service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400') + ')'">
                @if (service.isFeatured) {
                  <span class="featured-badge">⭐ Featured</span>
                }
              </div>
              <div class="service-content">
                <div class="service-category">{{ service.categoryName }}</div>
                <h3>{{ service.name }}</h3>
                <p class="service-desc">{{ service.description }}</p>
                <div class="service-meta">
                  <div class="rating">
                    <nz-rate [ngModel]="service.averageRating || 0" nzAllowHalf [nzDisabled]="true"></nz-rate>
                    <span class="rating-value">{{ (service.averageRating || 0).toFixed(1) }}</span>
                    <span class="booking-count">({{ service.totalBookings || 0 }})</span>
                  </div>
                  <div class="price">
                    <span class="price-label">Starting at</span>
                    <span class="price-value">\${{ service.basePrice }}</span>
                  </div>
                </div>
                <button nz-button nzType="primary" nzBlock [routerLink]="['/service', service.id]">
                  Book Now
                </button>
              </div>
            </div>
          }
        </div>
        
        <div class="section-cta">
          <button nz-button nzSize="large" routerLink="/services">
            View All Services
            <span nz-icon nzType="arrow-right" nzTheme="outline"></span>
          </button>
        </div>
      </div>
    </section>
    
    <!-- How It Works Section -->
    <section class="section how-it-works">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Process</div>
          <h2>How It Works</h2>
          <p>Get your service done in 3 simple steps</p>
        </div>
        
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">01</div>
            <div class="step-icon">
              <span nz-icon nzType="search" nzTheme="outline"></span>
            </div>
            <h3>Find Your Service</h3>
            <p>Browse through our categories or search for the specific service you need</p>
          </div>
          
          <div class="step-connector">
            <span nz-icon nzType="arrow-right" nzTheme="outline"></span>
          </div>
          
          <div class="step-card">
            <div class="step-number">02</div>
            <div class="step-icon">
              <span nz-icon nzType="calendar" nzTheme="outline"></span>
            </div>
            <h3>Book Appointment</h3>
            <p>Choose your preferred date, time, and location for the service</p>
          </div>
          
          <div class="step-connector">
            <span nz-icon nzType="arrow-right" nzTheme="outline"></span>
          </div>
          
          <div class="step-card">
            <div class="step-number">03</div>
            <div class="step-icon">
              <span nz-icon nzType="check-circle" nzTheme="outline"></span>
            </div>
            <h3>Get It Done</h3>
            <p>Our verified professional arrives and completes the job to perfection</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Top Providers Section -->
    <section class="section providers-section">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Professionals</div>
          <h2>Top Rated Service Providers</h2>
          <p>Meet our best-performing verified professionals</p>
        </div>
        
        <div class="providers-grid">
          @for (provider of topProviders; track provider.id; let i = $index) {
            <div class="provider-card hover-lift" [style.animation-delay]="(i * 0.05) + 's'">
              <div class="provider-header">
                <nz-avatar 
                  [nzSize]="72"
                  [nzText]="provider.user.firstName.charAt(0)"
                  [nzSrc]="provider.user.profileImage"
                  style="background: var(--gradient-primary);">
                </nz-avatar>
                @if (provider.isVerified) {
                  <span class="verified-badge">
                    <span nz-icon nzType="safety-certificate" nzTheme="fill"></span>
                  </span>
                }
              </div>
              <h3>{{ provider.user.fullName }}</h3>
              <p class="provider-exp">{{ provider.experienceYears }}+ years experience</p>
              <div class="provider-rating">
                <nz-rate [ngModel]="provider.averageRating || 0" nzAllowHalf [nzDisabled]="true"></nz-rate>
                <span>({{ provider.totalReviews || 0 }} reviews)</span>
              </div>
              <div class="provider-stats">
                <div class="stat">
                  <strong>{{ provider.completedJobs || 0 }}</strong>
                  <span>Jobs Done</span>
                </div>
                <div class="stat">
                  <strong>{{ (provider.averageRating || 0).toFixed(1) }}</strong>
                  <span>Rating</span>
                </div>
              </div>
              <div class="provider-categories">
                @for (cat of provider.categories?.slice(0, 3); track cat.id) {
                  <nz-tag>{{ cat.name }}</nz-tag>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-bg">
        <div class="cta-gradient"></div>
      </div>
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who trust ServiceBook for their home service needs.</p>
          <div class="cta-buttons">
            <button nz-button nzType="primary" nzSize="large" routerLink="/services">
              Book a Service
              <span nz-icon nzType="arrow-right" nzTheme="outline"></span>
            </button>
            <button nz-button nzSize="large" routerLink="/register" class="btn-outline">
              Become a Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 120px 24px 80px;
      overflow: hidden;
    }
    
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    
    .hero-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #0a1628 0%, #1a2f4a 50%, #0d3d4d 100%);
    }
    
    .hero-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(0, 230, 160, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 20%, rgba(0, 179, 128, 0.1) 0%, transparent 40%);
    }
    
    .floating-shapes {
      position: absolute;
      inset: 0;
      overflow: hidden;
      
      .shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 230, 160, 0.1);
        animation: float 6s ease-in-out infinite;
        
        &.shape-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }
        
        &.shape-2 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          left: 5%;
          animation-delay: 2s;
        }
        
        &.shape-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          right: 30%;
          animation-delay: 4s;
        }
      }
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 8px 20px;
      border-radius: var(--radius-full);
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      
      .badge-icon {
        font-size: 16px;
      }
    }
    
    .hero-title {
      font-size: 4.5rem;
      font-weight: 800;
      color: white;
      line-height: 1.1;
      margin-bottom: 24px;
      letter-spacing: -2px;
      
      .gradient-text {
        background: linear-gradient(135deg, #00e6a0 0%, #00ffb3 50%, #4dffc9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.7;
      margin-bottom: 40px;
    }
    
    .hero-search {
      max-width: 600px;
      margin: 0 auto 48px;
      
      .search-box {
        display: flex;
        align-items: center;
        background: white;
        border-radius: var(--radius-xl);
        padding: 8px 8px 8px 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        
        .search-icon {
          color: var(--neutral-400);
          font-size: 20px;
          margin-right: 12px;
        }
        
        input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          padding: 12px 0;
          
          &::placeholder {
            color: var(--neutral-400);
          }
        }
        
        button {
          padding: 14px 32px !important;
          font-size: 16px !important;
        }
      }
      
      .popular-searches {
        margin-top: 16px;
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        
        span {
          margin-right: 8px;
        }
        
        a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          margin: 0 4px;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          transition: all 0.2s;
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
          }
        }
      }
    }
    
    .hero-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      
      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }
        
        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 4px;
        }
      }
      
      .stat-divider {
        width: 1px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
      }
    }
    
    /* Section Styles */
    .section {
      padding: 100px 0;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 60px;
      
      .section-label {
        display: inline-block;
        padding: 6px 16px;
        background: var(--primary-50);
        color: var(--primary-600);
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-radius: var(--radius-full);
        margin-bottom: 16px;
      }
      
      h2 {
        font-size: 2.75rem;
        margin-bottom: 12px;
      }
      
      p {
        font-size: 1.125rem;
        color: var(--neutral-500);
      }
    }
    
    /* Categories Grid */
    .categories-section {
      background: white;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    
    .category-card {
      position: relative;
      border-radius: var(--radius-xl);
      overflow: hidden;
      text-decoration: none;
      aspect-ratio: 1;
      
      .category-image {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        transition: transform 0.5s ease;
      }
      
      .category-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%);
      }
      
      .category-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        color: white;
        
        .category-icon {
          font-size: 24px;
          margin-bottom: 8px;
          display: block;
        }
        
        h3 {
          font-size: 1.25rem;
          margin-bottom: 4px;
          color: white;
        }
        
        p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
      
      &:hover .category-image {
        transform: scale(1.1);
      }
    }
    
    /* Services Grid */
    .featured-section {
      background: var(--neutral-50);
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
        height: 180px;
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
          color: var(--neutral-800);
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
          line-height: 1.3;
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
              color: var(--neutral-700);
            }
            
            .booking-count {
              color: var(--neutral-400);
              font-size: 13px;
            }
          }
          
          .price {
            text-align: right;
            
            .price-label {
              display: block;
              font-size: 11px;
              color: var(--neutral-400);
            }
            
            .price-value {
              font-family: 'Outfit', sans-serif;
              font-size: 1.25rem;
              font-weight: 700;
              color: var(--primary-600);
            }
          }
        }
      }
    }
    
    .section-cta {
      text-align: center;
      margin-top: 48px;
      
      button {
        background: white !important;
        color: var(--neutral-700) !important;
        border: 2px solid var(--neutral-200) !important;
        padding: 16px 32px !important;
        
        &:hover {
          border-color: var(--primary-500) !important;
          color: var(--primary-600) !important;
        }
        
        span[nz-icon] {
          margin-left: 8px;
        }
      }
    }
    
    /* How It Works */
    .how-it-works {
      background: white;
    }
    
    .steps-grid {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }
    
    .step-card {
      flex: 1;
      max-width: 280px;
      text-align: center;
      padding: 40px 24px;
      border-radius: var(--radius-xl);
      background: var(--neutral-50);
      border: 1px solid var(--neutral-100);
      position: relative;
      
      .step-number {
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gradient-primary);
        color: white;
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: var(--radius-full);
      }
      
      .step-icon {
        width: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 50%;
        margin: 0 auto 20px;
        font-size: 28px;
        color: var(--primary-600);
        box-shadow: var(--shadow-md);
      }
      
      h3 {
        font-size: 1.125rem;
        margin-bottom: 8px;
      }
      
      p {
        font-size: 14px;
        color: var(--neutral-500);
        line-height: 1.6;
      }
    }
    
    .step-connector {
      font-size: 24px;
      color: var(--neutral-300);
    }
    
    /* Providers Grid */
    .providers-section {
      background: var(--neutral-50);
    }
    
    .providers-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    
    .provider-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 32px 24px;
      text-align: center;
      border: 1px solid var(--neutral-100);
      
      .provider-header {
        position: relative;
        display: inline-block;
        margin-bottom: 16px;
        
        .verified-badge {
          position: absolute;
          bottom: 0;
          right: -4px;
          background: white;
          border-radius: 50%;
          padding: 4px;
          color: var(--primary-500);
          font-size: 18px;
          box-shadow: var(--shadow-sm);
        }
      }
      
      h3 {
        font-size: 1.125rem;
        margin-bottom: 4px;
      }
      
      .provider-exp {
        font-size: 13px;
        color: var(--neutral-500);
        margin-bottom: 12px;
      }
      
      .provider-rating {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 20px;
        
        nz-rate {
          font-size: 14px;
        }
        
        span {
          font-size: 13px;
          color: var(--neutral-500);
        }
      }
      
      .provider-stats {
        display: flex;
        justify-content: center;
        gap: 32px;
        padding: 16px 0;
        border-top: 1px solid var(--neutral-100);
        border-bottom: 1px solid var(--neutral-100);
        margin-bottom: 16px;
        
        .stat {
          display: flex;
          flex-direction: column;
          
          strong {
            font-family: 'Outfit', sans-serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--neutral-800);
          }
          
          span {
            font-size: 12px;
            color: var(--neutral-500);
          }
        }
      }
      
      .provider-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: center;
        
        nz-tag {
          background: var(--primary-50);
          color: var(--primary-700);
          border: none;
          font-size: 12px;
        }
      }
    }
    
    /* CTA Section */
    .cta-section {
      position: relative;
      padding: 100px 0;
      overflow: hidden;
      
      .cta-bg {
        position: absolute;
        inset: 0;
      }
      
      .cta-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #0a1628 0%, #1a2f4a 50%, #0d3d4d 100%);
      }
      
      .container {
        position: relative;
        z-index: 1;
      }
      
      .cta-content {
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
        
        h2 {
          font-size: 2.5rem;
          color: white;
          margin-bottom: 16px;
        }
        
        p {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 32px;
        }
        
        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          
          .btn-outline {
            background: transparent !important;
            color: white !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            
            &:hover {
              border-color: white !important;
            }
          }
        }
      }
    }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .hero-title {
        font-size: 3rem;
      }
      
      .categories-grid,
      .services-grid,
      .providers-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .steps-grid {
        flex-wrap: wrap;
      }
      
      .step-connector {
        display: none;
      }
    }
    
    @media (max-width: 640px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-stats {
        flex-wrap: wrap;
        gap: 24px;
        
        .stat-divider {
          display: none;
        }
      }
      
      .categories-grid,
      .services-grid,
      .providers-grid {
        grid-template-columns: 1fr;
      }
      
      .cta-buttons {
        flex-direction: column;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(5deg);
      }
    }
    
    .animate-fade-in {
      opacity: 0;
      animation: fadeInUp 0.8s ease-out forwards;
    }
  `]
})
export class HomeComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private serviceService = inject(ServiceService);
  private providerService = inject(ProviderService);
  
  categories: Category[] = [];
  featuredServices: Service[] = [];
  topProviders: ServiceProvider[] = [];
  searchQuery = '';
  popularSearches = ['Cleaning', 'Plumbing', 'Electrical', 'AC Repair'];
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedServices();
    this.loadTopProviders();
  }
  
  loadCategories(): void {
    this.categoryService.getAll().subscribe(response => {
      if (response.success) {
        this.categories = response.data;
      }
    });
  }
  
  loadFeaturedServices(): void {
    this.serviceService.getFeatured().subscribe(response => {
      if (response.success) {
        this.featuredServices = response.data.slice(0, 8);
      }
    });
  }
  
  loadTopProviders(): void {
    this.providerService.getTopRated(4).subscribe(response => {
      if (response.success) {
        this.topProviders = response.data;
      }
    });
  }
  
  search(): void {
    if (this.searchQuery.trim()) {
    }
  }
}


