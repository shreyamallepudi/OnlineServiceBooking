import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { CategoryService } from '../../../core/services/category.service';
import { ServiceService } from '../../../core/services/service.service';
import { Category } from '../../../core/models/category.model';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzTableModule,
    NzTagModule,
    NzTabsModule,
    NzAvatarModule
  ],
  template: `
    <div class="admin-page">
      <div class="container">
        <!-- Header -->
        <div class="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your platform settings, services, and users</p>
        </div>
        
        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon users">
              <span nz-icon nzType="team" nzTheme="outline"></span>
            </div>
            <div class="stat-content">
              <span class="stat-value">2,547</span>
              <span class="stat-label">Total Users</span>
            </div>
            <div class="stat-change positive">
              <span nz-icon nzType="rise" nzTheme="outline"></span>
              +12%
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon providers">
              <span nz-icon nzType="user" nzTheme="outline"></span>
            </div>
            <div class="stat-content">
              <span class="stat-value">348</span>
              <span class="stat-label">Service Providers</span>
            </div>
            <div class="stat-change positive">
              <span nz-icon nzType="rise" nzTheme="outline"></span>
              +8%
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon bookings">
              <span nz-icon nzType="calendar" nzTheme="outline"></span>
            </div>
            <div class="stat-content">
              <span class="stat-value">1,234</span>
              <span class="stat-label">Total Bookings</span>
            </div>
            <div class="stat-change positive">
              <span nz-icon nzType="rise" nzTheme="outline"></span>
              +24%
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon revenue">
              <span nz-icon nzType="dollar" nzTheme="outline"></span>
            </div>
            <div class="stat-content">
              <span class="stat-value">$45,890</span>
              <span class="stat-label">Total Revenue</span>
            </div>
            <div class="stat-change positive">
              <span nz-icon nzType="rise" nzTheme="outline"></span>
              +18%
            </div>
          </div>
        </div>
        
        <!-- Management Tabs -->
        <nz-tabset>
          <!-- Categories Tab -->
          <nz-tab nzTitle="Categories">
            <div class="tab-content">
              <div class="tab-header">
                <h3>Service Categories</h3>
                <button nz-button nzType="primary">
                  <span nz-icon nzType="plus" nzTheme="outline"></span>
                  Add Category
                </button>
              </div>
              
              <nz-table #categoriesTable [nzData]="categories" [nzPageSize]="10">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Icon</th>
                    <th>Services</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cat of categoriesTable.data; track cat.id) {
                    <tr>
                      <td>{{ cat.id }}</td>
                      <td><strong>{{ cat.name }}</strong></td>
                      <td>{{ cat.description || '-' }}</td>
                      <td><span nz-icon [nzType]="cat.icon || 'appstore'" nzTheme="outline"></span></td>
                      <td>{{ cat.serviceCount || 0 }}</td>
                      <td>
                        <nz-tag [nzColor]="cat.isActive ? 'green' : 'red'">
                          {{ cat.isActive ? 'Active' : 'Inactive' }}
                        </nz-tag>
                      </td>
                      <td>
                        <button nz-button nzSize="small">Edit</button>
                        <button nz-button nzSize="small" nzDanger>Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </nz-table>
            </div>
          </nz-tab>
          
          <!-- Services Tab -->
          <nz-tab nzTitle="Services">
            <div class="tab-content">
              <div class="tab-header">
                <h3>All Services</h3>
                <button nz-button nzType="primary">
                  <span nz-icon nzType="plus" nzTheme="outline"></span>
                  Add Service
                </button>
              </div>
              
              <nz-table #servicesTable [nzData]="services" [nzPageSize]="10">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Rating</th>
                    <th>Bookings</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (service of servicesTable.data; track service.id) {
                    <tr>
                      <td>
                        <div class="service-cell">
                          <div class="service-img" [style.background-image]="'url(' + (service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80') + ')'"></div>
                          <strong>{{ service.name }}</strong>
                        </div>
                      </td>
                      <td>{{ service.categoryName }}</td>
                      <td>\${{ service.basePrice }}</td>
                      <td>{{ service.durationMinutes || '-' }} min</td>
                      <td>{{ (service.averageRating || 0).toFixed(1) }} ⭐</td>
                      <td>{{ service.totalBookings || 0 }}</td>
                      <td>
                        <nz-tag [nzColor]="service.isActive ? 'green' : 'red'">
                          {{ service.isActive ? 'Active' : 'Inactive' }}
                        </nz-tag>
                        @if (service.isFeatured) {
                          <nz-tag nzColor="gold">Featured</nz-tag>
                        }
                      </td>
                      <td>
                        <button nz-button nzSize="small">Edit</button>
                        <button nz-button nzSize="small" nzDanger>Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </nz-table>
            </div>
          </nz-tab>
          
          <!-- Users Tab -->
          <nz-tab nzTitle="Users">
            <div class="tab-content">
              <div class="tab-header">
                <h3>User Management</h3>
              </div>
              
              <div class="user-stats">
                <div class="user-stat">
                  <span class="label">Customers</span>
                  <span class="value">2,199</span>
                </div>
                <div class="user-stat">
                  <span class="label">Providers</span>
                  <span class="value">348</span>
                </div>
                <div class="user-stat">
                  <span class="label">Pending Verification</span>
                  <span class="value">23</span>
                </div>
              </div>
              
              <p class="placeholder-text">User management interface coming soon...</p>
            </div>
          </nz-tab>
          
          <!-- Bookings Tab -->
          <nz-tab nzTitle="Bookings">
            <div class="tab-content">
              <div class="tab-header">
                <h3>All Bookings</h3>
              </div>
              
              <div class="booking-stats">
                <div class="booking-stat pending">
                  <span class="count">45</span>
                  <span class="label">Pending</span>
                </div>
                <div class="booking-stat confirmed">
                  <span class="count">128</span>
                  <span class="label">Confirmed</span>
                </div>
                <div class="booking-stat progress">
                  <span class="count">32</span>
                  <span class="label">In Progress</span>
                </div>
                <div class="booking-stat completed">
                  <span class="count">1,029</span>
                  <span class="label">Completed</span>
                </div>
              </div>
              
              <p class="placeholder-text">Detailed booking management coming soon...</p>
            </div>
          </nz-tab>
        </nz-tabset>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 100px 0 80px;
      background: var(--neutral-50);
      min-height: 100vh;
    }
    
    .admin-header {
      margin-bottom: 32px;
      
      h1 {
        font-size: 2rem;
        margin-bottom: 4px;
      }
      
      p {
        color: var(--neutral-500);
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        
        &.users {
          background: #dbeafe;
          color: #2563eb;
        }
        
        &.providers {
          background: #f3e8ff;
          color: #9333ea;
        }
        
        &.bookings {
          background: #fef3c7;
          color: #d97706;
        }
        
        &.revenue {
          background: #dcfce7;
          color: #16a34a;
        }
      }
      
      .stat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .stat-label {
          font-size: 13px;
          color: var(--neutral-500);
        }
      }
      
      .stat-change {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        font-weight: 600;
        
        &.positive {
          color: #16a34a;
        }
        
        &.negative {
          color: #dc2626;
        }
      }
    }
    
    .tab-content {
      background: white;
      border-radius: var(--radius-xl);
      padding: 24px;
      margin-top: 16px;
    }
    
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      
      h3 {
        font-size: 1.125rem;
        margin: 0;
      }
    }
    
    .service-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .service-img {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-sm);
        background-size: cover;
        background-position: center;
      }
    }
    
    .user-stats,
    .booking-stats {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .user-stat,
    .booking-stat {
      padding: 16px 24px;
      border-radius: var(--radius-lg);
      background: var(--neutral-50);
      
      .label {
        display: block;
        font-size: 13px;
        color: var(--neutral-500);
      }
      
      .value,
      .count {
        font-family: 'Outfit', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
      }
    }
    
    .booking-stat {
      &.pending {
        background: #fef3c7;
        .count { color: #d97706; }
      }
      
      &.confirmed {
        background: #dbeafe;
        .count { color: #2563eb; }
      }
      
      &.progress {
        background: #f3e8ff;
        .count { color: #9333ea; }
      }
      
      &.completed {
        background: #dcfce7;
        .count { color: #16a34a; }
      }
    }
    
    .placeholder-text {
      text-align: center;
      color: var(--neutral-400);
      padding: 48px;
    }
    
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private serviceService = inject(ServiceService);
  
  categories: Category[] = [];
  services: Service[] = [];
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadServices();
  }
  
  loadCategories(): void {
    this.categoryService.getAll().subscribe(response => {
      if (response.success) {
        this.categories = response.data;
      }
    });
  }
  
  loadServices(): void {
    this.serviceService.getAll(0, 50).subscribe(response => {
      if (response.success) {
        this.services = response.data.content;
      }
    });
  }
}


