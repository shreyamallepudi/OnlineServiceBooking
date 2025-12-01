import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { ProviderService } from '../../../core/services/provider.service';
import { BookingService } from '../../../core/services/booking.service';
import { ServiceProvider } from '../../../core/models/provider.model';
import { Booking, BookingStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzStatisticModule,
    NzTableModule,
    NzTagModule,
    NzAvatarModule,
    NzSwitchModule,
    NzRateModule
  ],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-content">
            <h1>Provider Dashboard</h1>
            <p>Manage your bookings and track your performance</p>
          </div>
          <div class="availability-toggle">
            <span>Availability:</span>
            <nz-switch 
              [ngModel]="provider?.isAvailable" 
              (ngModelChange)="toggleAvailability()"
              nzCheckedChildren="Available"
              nzUnCheckedChildren="Busy">
            </nz-switch>
          </div>
        </div>
        
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon earnings">
              <span nz-icon nzType="dollar" nzTheme="outline"></span>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Earnings</span>
              <span class="stat-value">\${{ provider?.totalEarnings?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon jobs">
              <span nz-icon nzType="check-circle" nzTheme="outline"></span>
            </div>
            <div class="stat-content">
              <span class="stat-label">Completed Jobs</span>
              <span class="stat-value">{{ provider?.completedJobs || 0 }}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon rating">
              <span nz-icon nzType="star" nzTheme="fill"></span>
            </div>
            <div class="stat-content">
              <span class="stat-label">Average Rating</span>
              <span class="stat-value">{{ (provider?.averageRating || 0).toFixed(1) }}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon reviews">
              <span nz-icon nzType="message" nzTheme="outline"></span>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Reviews</span>
              <span class="stat-value">{{ provider?.totalReviews || 0 }}</span>
            </div>
          </div>
        </div>
        
        <!-- Bookings Table -->
        <div class="section-card">
          <div class="section-header">
            <h2>Recent Bookings</h2>
          </div>
          
          <nz-table #bookingsTable [nzData]="bookings" [nzPageSize]="10" [nzShowPagination]="true">
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (booking of bookingsTable.data; track booking.id) {
                <tr>
                  <td><strong>{{ booking.bookingNumber }}</strong></td>
                  <td>
                    <div class="customer-cell">
                      <nz-avatar [nzText]="booking.customer.firstName.charAt(0)" [nzSize]="32"></nz-avatar>
                      <span>{{ booking.customer.fullName }}</span>
                    </div>
                  </td>
                  <td>{{ booking.service.name }}</td>
                  <td>{{ booking.bookingDate | date:'shortDate' }} {{ formatTime(booking.bookingTime) }}</td>
                  <td><strong>\${{ booking.totalAmount.toFixed(2) }}</strong></td>
                  <td>
                    <nz-tag [nzColor]="getStatusColor(booking.status)">
                      {{ formatStatus(booking.status) }}
                    </nz-tag>
                  </td>
                  <td>
                    @if (booking.status === 'PENDING') {
                      <button nz-button nzSize="small" nzType="primary" (click)="acceptBooking(booking)">Accept</button>
                      <button nz-button nzSize="small" nzDanger (click)="rejectBooking(booking)">Reject</button>
                    }
                    @if (booking.status === 'CONFIRMED') {
                      <button nz-button nzSize="small" nzType="primary" (click)="startJob(booking)">Start Job</button>
                    }
                    @if (booking.status === 'IN_PROGRESS') {
                      <button nz-button nzSize="small" nzType="primary" (click)="completeJob(booking)">Complete</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </nz-table>
        </div>
        
        <!-- Profile Summary -->
        @if (provider) {
          <div class="section-card">
            <div class="section-header">
              <h2>Your Profile</h2>
              <button nz-button>Edit Profile</button>
            </div>
            
            <div class="profile-content">
              <div class="profile-header">
                <nz-avatar [nzSize]="80" [nzText]="provider.user.firstName.charAt(0)" style="background: var(--gradient-primary);"></nz-avatar>
                <div class="profile-info">
                  <h3>{{ provider.user.fullName }}</h3>
                  <p>{{ provider.bio || 'No bio added yet' }}</p>
                  <div class="profile-badges">
                    @if (provider.isVerified) {
                      <nz-tag nzColor="green">
                        <span nz-icon nzType="safety-certificate" nzTheme="fill"></span>
                        Verified
                      </nz-tag>
                    }
                    <nz-tag nzColor="blue">{{ provider.experienceYears }}+ Years Experience</nz-tag>
                  </div>
                </div>
              </div>
              
              <div class="profile-details">
                <div class="detail-item">
                  <span class="label">Service Area</span>
                  <span class="value">{{ provider.serviceArea || 'Not specified' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Skills</span>
                  <span class="value">
                    @for (skill of provider.skills; track skill) {
                      <nz-tag>{{ skill }}</nz-tag>
                    }
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">Categories</span>
                  <span class="value">
                    @for (cat of provider.categories; track cat.id) {
                      <nz-tag nzColor="cyan">{{ cat.name }}</nz-tag>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 100px 0 80px;
      background: var(--neutral-50);
      min-height: 100vh;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      
      .header-content {
        h1 {
          font-size: 2rem;
          margin-bottom: 4px;
        }
        
        p {
          color: var(--neutral-500);
        }
      }
      
      .availability-toggle {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        background: white;
        border-radius: var(--radius-lg);
        
        span {
          font-weight: 500;
        }
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
      gap: 20px;
      
      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        
        &.earnings {
          background: #dcfce7;
          color: #16a34a;
        }
        
        &.jobs {
          background: #dbeafe;
          color: #2563eb;
        }
        
        &.rating {
          background: #fef3c7;
          color: #d97706;
        }
        
        &.reviews {
          background: #f3e8ff;
          color: #9333ea;
        }
      }
      
      .stat-content {
        display: flex;
        flex-direction: column;
        
        .stat-label {
          font-size: 13px;
          color: var(--neutral-500);
        }
        
        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
        }
      }
    }
    
    .section-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 24px;
      margin-bottom: 24px;
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        h2 {
          font-size: 1.25rem;
          margin: 0;
        }
      }
    }
    
    .customer-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .profile-content {
      .profile-header {
        display: flex;
        align-items: center;
        gap: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid var(--neutral-100);
        
        .profile-info {
          h3 {
            font-size: 1.25rem;
            margin-bottom: 8px;
          }
          
          p {
            color: var(--neutral-600);
            margin-bottom: 12px;
          }
          
          .profile-badges {
            display: flex;
            gap: 8px;
          }
        }
      }
      
      .profile-details {
        padding-top: 24px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        
        .detail-item {
          .label {
            display: block;
            font-size: 12px;
            color: var(--neutral-500);
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          
          .value {
            color: var(--neutral-800);
            font-weight: 500;
          }
        }
      }
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
      
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
    }
  `],
  providers: [NzMessageService]
})
export class ProviderDashboardComponent implements OnInit {
  private providerService = inject(ProviderService);
  private bookingService = inject(BookingService);
  private message = inject(NzMessageService);
  
  provider: ServiceProvider | null = null;
  bookings: Booking[] = [];
  
  ngOnInit(): void {
    this.loadProfile();
    this.loadBookings();
  }
  
  loadProfile(): void {
    this.providerService.getMyProfile().subscribe(response => {
      if (response.success) {
        this.provider = response.data;
      }
    });
  }
  
  loadBookings(): void {
    this.providerService.getMyBookings(0, 20).subscribe(response => {
      if (response.success) {
        this.bookings = response.data.content;
      }
    });
  }
  
  toggleAvailability(): void {
    this.providerService.toggleAvailability().subscribe(response => {
      if (response.success) {
        this.message.success(response.data.isAvailable ? 'You are now available' : 'You are now unavailable');
      }
    });
  }
  
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
  }
  
  formatStatus(status: BookingStatus): string {
    return status.replace('_', ' ');
  }
  
  getStatusColor(status: BookingStatus): string {
    const colors: Record<BookingStatus, string> = {
      PENDING: 'orange',
      CONFIRMED: 'blue',
      IN_PROGRESS: 'purple',
      COMPLETED: 'green',
      CANCELLED: 'red',
      REJECTED: 'red'
    };
    return colors[status];
  }
  
  acceptBooking(booking: Booking): void {
    this.bookingService.updateStatus(booking.id, 'CONFIRMED').subscribe(() => {
      this.message.success('Booking accepted');
      this.loadBookings();
    });
  }
  
  rejectBooking(booking: Booking): void {
    this.bookingService.updateStatus(booking.id, 'REJECTED', 'Provider unavailable').subscribe(() => {
      this.message.info('Booking rejected');
      this.loadBookings();
    });
  }
  
  startJob(booking: Booking): void {
    this.bookingService.updateStatus(booking.id, 'IN_PROGRESS').subscribe(() => {
      this.message.success('Job started');
      this.loadBookings();
    });
  }
  
  completeJob(booking: Booking): void {
    this.bookingService.updateStatus(booking.id, 'COMPLETED').subscribe(() => {
      this.message.success('Job completed!');
      this.loadBookings();
      this.loadProfile();
    });
  }
}


