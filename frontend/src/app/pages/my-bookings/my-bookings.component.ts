import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BookingService } from '../../core/services/booking.service';
import { Booking, BookingStatus } from '../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzEmptyModule,
    NzAvatarModule,
    NzTabsModule
  ],
  template: `
    <div class="my-bookings-page">
      <div class="container">
        <div class="page-header">
          <h1>My Bookings</h1>
          <button nz-button nzType="primary" routerLink="/services">
            <span nz-icon nzType="plus" nzTheme="outline"></span>
            Book New Service
          </button>
        </div>
        
        <nz-tabset>
          <nz-tab nzTitle="All Bookings">
            <div class="bookings-content">
              @if (bookings.length > 0) {
                <div class="bookings-list">
                  @for (booking of bookings; track booking.id) {
                    <div class="booking-card">
                      <div class="booking-status" [class]="booking.status.toLowerCase()">
                        {{ formatStatus(booking.status) }}
                      </div>
                      
                      <div class="booking-main">
                        <div class="service-image" [style.background-image]="'url(' + (booking.service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200') + ')'"></div>
                        
                        <div class="booking-details">
                          <span class="booking-number">#{{ booking.bookingNumber }}</span>
                          <h3>{{ booking.service.name }}</h3>
                          <p class="category">{{ booking.service.categoryName }}</p>
                          
                          <div class="booking-info">
                            <div class="info-item">
                              <span nz-icon nzType="calendar" nzTheme="outline"></span>
                              <span>{{ booking.bookingDate | date:'mediumDate' }}</span>
                            </div>
                            <div class="info-item">
                              <span nz-icon nzType="clock-circle" nzTheme="outline"></span>
                              <span>{{ formatTime(booking.bookingTime) }}</span>
                            </div>
                            <div class="info-item">
                              <span nz-icon nzType="environment" nzTheme="outline"></span>
                              <span>{{ booking.address }}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="booking-price">
                          <span class="label">Total</span>
                          <span class="amount">\${{ booking.totalAmount.toFixed(2) }}</span>
                        </div>
                      </div>
                      
                      @if (booking.provider) {
                        <div class="provider-info">
                          <nz-avatar [nzSize]="40" [nzText]="booking.provider.name.charAt(0)"></nz-avatar>
                          <div class="provider-details">
                            <span class="provider-label">Service Professional</span>
                            <span class="provider-name">{{ booking.provider.name }}</span>
                          </div>
                        </div>
                      }
                      
                      <div class="booking-actions">
                        @if (booking.status === 'PENDING' || booking.status === 'CONFIRMED') {
                          <button nz-button nzType="default" nzDanger (click)="cancelBooking(booking)">
                            Cancel Booking
                          </button>
                        }
                        @if (booking.status === 'COMPLETED' && !booking.review) {
                          <button nz-button nzType="primary">
                            Leave Review
                          </button>
                        }
                        <button nz-button [routerLink]="['/service', booking.service.id]">
                          Book Again
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty 
                  nzNotFoundImage="simple"
                  [nzNotFoundContent]="'No bookings yet'"
                  [nzNotFoundFooter]="emptyFooter">
                </nz-empty>
                <ng-template #emptyFooter>
                  <button nz-button nzType="primary" routerLink="/services">Browse Services</button>
                </ng-template>
              }
            </div>
          </nz-tab>
          
          <nz-tab nzTitle="Active">
            <div class="bookings-content">
              @if (activeBookings.length > 0) {
                <div class="bookings-list">
                  @for (booking of activeBookings; track booking.id) {
                    <div class="booking-card">
                      <!-- Same card structure -->
                      <div class="booking-status" [class]="booking.status.toLowerCase()">
                        {{ formatStatus(booking.status) }}
                      </div>
                      <div class="booking-main">
                        <div class="service-image" [style.background-image]="'url(' + (booking.service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200') + ')'"></div>
                        <div class="booking-details">
                          <span class="booking-number">#{{ booking.bookingNumber }}</span>
                          <h3>{{ booking.service.name }}</h3>
                          <div class="booking-info">
                            <div class="info-item">
                              <span nz-icon nzType="calendar" nzTheme="outline"></span>
                              <span>{{ booking.bookingDate | date:'mediumDate' }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="booking-price">
                          <span class="amount">\${{ booking.totalAmount.toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="No active bookings"></nz-empty>
              }
            </div>
          </nz-tab>
          
          <nz-tab nzTitle="Completed">
            <div class="bookings-content">
              @if (completedBookings.length > 0) {
                <div class="bookings-list">
                  @for (booking of completedBookings; track booking.id) {
                    <div class="booking-card completed">
                      <div class="booking-status completed">Completed</div>
                      <div class="booking-main">
                        <div class="service-image" [style.background-image]="'url(' + (booking.service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200') + ')'"></div>
                        <div class="booking-details">
                          <span class="booking-number">#{{ booking.bookingNumber }}</span>
                          <h3>{{ booking.service.name }}</h3>
                        </div>
                        <div class="booking-price">
                          <span class="amount">\${{ booking.totalAmount.toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="No completed bookings"></nz-empty>
              }
            </div>
          </nz-tab>
        </nz-tabset>
      </div>
    </div>
  `,
  styles: [`
    .my-bookings-page {
      padding: 100px 0 80px;
      background: var(--neutral-50);
      min-height: 100vh;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      
      h1 {
        font-size: 2rem;
      }
    }
    
    .bookings-content {
      margin-top: 24px;
    }
    
    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .booking-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 24px;
      border: 1px solid var(--neutral-100);
      
      .booking-status {
        display: inline-block;
        padding: 4px 12px;
        border-radius: var(--radius-full);
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 16px;
        
        &.pending {
          background: #fef3c7;
          color: #d97706;
        }
        
        &.confirmed {
          background: #dbeafe;
          color: #2563eb;
        }
        
        &.in_progress {
          background: #e0e7ff;
          color: #4f46e5;
        }
        
        &.completed {
          background: #d1fae5;
          color: #059669;
        }
        
        &.cancelled, &.rejected {
          background: #fee2e2;
          color: #dc2626;
        }
      }
      
      .booking-main {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        
        .service-image {
          width: 120px;
          height: 90px;
          border-radius: var(--radius-md);
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }
        
        .booking-details {
          flex: 1;
          
          .booking-number {
            font-size: 12px;
            color: var(--neutral-400);
          }
          
          h3 {
            font-size: 1.125rem;
            margin: 4px 0 8px;
          }
          
          .category {
            font-size: 13px;
            color: var(--primary-600);
            margin-bottom: 12px;
          }
          
          .booking-info {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            
            .info-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 13px;
              color: var(--neutral-600);
              
              span[nz-icon] {
                color: var(--neutral-400);
              }
            }
          }
        }
        
        .booking-price {
          text-align: right;
          
          .label {
            display: block;
            font-size: 12px;
            color: var(--neutral-500);
          }
          
          .amount {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--neutral-900);
          }
        }
      }
      
      .provider-info {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 0;
        margin-top: 16px;
        border-top: 1px solid var(--neutral-100);
        
        .provider-details {
          display: flex;
          flex-direction: column;
          
          .provider-label {
            font-size: 11px;
            color: var(--neutral-500);
            text-transform: uppercase;
          }
          
          .provider-name {
            font-weight: 600;
          }
        }
      }
      
      .booking-actions {
        display: flex;
        gap: 12px;
        padding-top: 16px;
        margin-top: 16px;
        border-top: 1px solid var(--neutral-100);
      }
    }
    
    @media (max-width: 768px) {
      .booking-main {
        flex-direction: column;
        
        .service-image {
          width: 100%;
          height: 160px;
        }
      }
    }
  `],
  providers: [NzMessageService, NzModalService]
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  
  bookings: Booking[] = [];
  loading = false;
  
  get activeBookings(): Booking[] {
    return this.bookings.filter(b => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status));
  }
  
  get completedBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'COMPLETED');
  }
  
  ngOnInit(): void {
    this.loadBookings();
  }
  
  loadBookings(): void {
    this.loading = true;
    this.bookingService.getMyBookings(0, 50).subscribe(response => {
      this.loading = false;
      if (response.success) {
        this.bookings = response.data.content;
      }
    });
  }
  
  formatStatus(status: BookingStatus): string {
    return status.replace('_', ' ');
  }
  
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  }
  
  cancelBooking(booking: Booking): void {
    this.modal.confirm({
      nzTitle: 'Cancel Booking',
      nzContent: 'Are you sure you want to cancel this booking?',
      nzOkText: 'Yes, Cancel',
      nzOkDanger: true,
      nzOnOk: () => {
        this.bookingService.cancel(booking.id, 'Customer requested cancellation').subscribe({
          next: () => {
            this.message.success('Booking cancelled successfully');
            this.loadBookings();
          },
          error: () => {
            this.message.error('Failed to cancel booking');
          }
        });
      }
    });
  }
}


