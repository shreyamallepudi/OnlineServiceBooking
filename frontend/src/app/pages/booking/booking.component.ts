import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ServiceService } from '../../core/services/service.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { Service } from '../../core/models/service.model';
import { Booking, CreateBookingRequest } from '../../core/models/booking.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzStepsModule,
    NzCardModule,
    NzDividerModule,
    NzResultModule,
    NzSpinModule
  ],
  template: `
    <div class="booking-page">
      <div class="container">
        <nz-spin [nzSpinning]="loading">
          @if (!bookingComplete) {
            <div class="booking-header">
              <a [routerLink]="['/service', service?.id]" class="back-link">
                <span nz-icon nzType="arrow-left" nzTheme="outline"></span>
                Back to Service
              </a>
              <h1>Book Your Service</h1>
            </div>
            
            <nz-steps [nzCurrent]="currentStep" class="booking-steps">
              <nz-step nzTitle="Details"></nz-step>
              <nz-step nzTitle="Schedule"></nz-step>
              <nz-step nzTitle="Confirm"></nz-step>
            </nz-steps>
            
            <div class="booking-content">
              <div class="booking-form">
                @switch (currentStep) {
                  @case (0) {
                    <!-- Step 1: Address Details -->
                    <div class="step-content">
                      <h2>Service Location</h2>
                      <p class="step-description">Where should we send our professional?</p>
                      
                      <div class="form-group">
                        <label>Street Address *</label>
                        <input nz-input [(ngModel)]="bookingData.address" placeholder="Enter your street address" />
                      </div>
                      
                      <div class="form-row">
                        <div class="form-group">
                          <label>City</label>
                          <input nz-input [(ngModel)]="bookingData.city" placeholder="City" />
                        </div>
                        <div class="form-group">
                          <label>State</label>
                          <input nz-input [(ngModel)]="bookingData.state" placeholder="State" />
                        </div>
                        <div class="form-group">
                          <label>ZIP Code</label>
                          <input nz-input [(ngModel)]="bookingData.zipCode" placeholder="ZIP" />
                        </div>
                      </div>
                      
                      <div class="form-group">
                        <label>Additional Notes</label>
                        <textarea nz-input [(ngModel)]="bookingData.notes" placeholder="Any special instructions or access details..." [nzAutosize]="{ minRows: 3, maxRows: 5 }"></textarea>
                      </div>
                    </div>
                  }
                  
                  @case (1) {
                    <!-- Step 2: Schedule -->
                    <div class="step-content">
                      <h2>Choose Date & Time</h2>
                      <p class="step-description">Select your preferred appointment slot</p>
                      
                      <div class="form-group">
                        <label>Preferred Date *</label>
                        <nz-date-picker 
                          [(ngModel)]="selectedDate" 
                          [nzDisabledDate]="disabledDate"
                          nzFormat="EEEE, MMMM d, y"
                          style="width: 100%">
                        </nz-date-picker>
                      </div>
                      
                      <div class="form-group">
                        <label>Preferred Time *</label>
                        <div class="time-slots">
                          @for (slot of timeSlots; track slot) {
                            <button 
                              class="time-slot" 
                              [class.selected]="selectedTime === slot"
                              (click)="selectTime(slot)">
                              {{ slot }}
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  }
                  
                  @case (2) {
                    <!-- Step 3: Review & Confirm -->
                    <div class="step-content">
                      <h2>Review Your Booking</h2>
                      <p class="step-description">Please review and confirm your booking details</p>
                      
                      <div class="review-section">
                        <h3>
                          <span nz-icon nzType="environment" nzTheme="outline"></span>
                          Service Location
                        </h3>
                        <p>{{ bookingData.address }}</p>
                        <p>{{ bookingData.city }}, {{ bookingData.state }} {{ bookingData.zipCode }}</p>
                      </div>
                      
                      <div class="review-section">
                        <h3>
                          <span nz-icon nzType="calendar" nzTheme="outline"></span>
                          Appointment Time
                        </h3>
                        <p>{{ selectedDate | date:'EEEE, MMMM d, y' }}</p>
                        <p>{{ selectedTime }}</p>
                      </div>
                      
                      @if (bookingData.notes) {
                        <div class="review-section">
                          <h3>
                            <span nz-icon nzType="file-text" nzTheme="outline"></span>
                            Special Instructions
                          </h3>
                          <p>{{ bookingData.notes }}</p>
                        </div>
                      }
                    </div>
                  }
                }
                
                <div class="step-actions">
                  @if (currentStep > 0) {
                    <button nz-button (click)="previousStep()">
                      <span nz-icon nzType="left" nzTheme="outline"></span>
                      Previous
                    </button>
                  }
                  
                  @if (currentStep < 2) {
                    <button nz-button nzType="primary" (click)="nextStep()" [disabled]="!canProceed()">
                      Next
                      <span nz-icon nzType="right" nzTheme="outline"></span>
                    </button>
                  } @else {
                    <button nz-button nzType="primary" (click)="confirmBooking()" [nzLoading]="submitting">
                      Confirm Booking
                      <span nz-icon nzType="check" nzTheme="outline"></span>
                    </button>
                  }
                </div>
              </div>
              
              <!-- Order Summary Sidebar -->
              <div class="booking-sidebar">
                <div class="summary-card">
                  <h3>Order Summary</h3>
                  
                  @if (service) {
                    <div class="service-info">
                      <div class="service-image" [style.background-image]="'url(' + (service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400') + ')'"></div>
                      <div class="service-details">
                        <span class="category">{{ service.categoryName }}</span>
                        <h4>{{ service.name }}</h4>
                      </div>
                    </div>
                    
                    <nz-divider></nz-divider>
                    
                    <div class="price-breakdown">
                      <div class="price-row">
                        <span>Service Price</span>
                        <span>\${{ service.basePrice.toFixed(2) }}</span>
                      </div>
                      <div class="price-row">
                        <span>Tax (10%)</span>
                        <span>\${{ (service.basePrice * 0.1).toFixed(2) }}</span>
                      </div>
                      <nz-divider></nz-divider>
                      <div class="price-row total">
                        <span>Total</span>
                        <span>\${{ (service.basePrice * 1.1).toFixed(2) }}</span>
                      </div>
                    </div>
                    
                    <div class="guarantee">
                      <span nz-icon nzType="safety-certificate" nzTheme="fill"></span>
                      <span>100% Satisfaction Guarantee</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          } @else {
            <!-- Booking Success -->
            <div class="booking-success">
              <nz-result
                nzStatus="success"
                nzTitle="Booking Confirmed!"
                [nzSubTitle]="'Booking Number: ' + confirmedBooking?.bookingNumber">
                <div nz-result-content>
                  <div class="success-details">
                    <div class="detail-row">
                      <span nz-icon nzType="calendar" nzTheme="outline"></span>
                      <span>{{ confirmedBooking?.bookingDate | date:'fullDate' }} at {{ confirmedBooking?.bookingTime }}</span>
                    </div>
                    <div class="detail-row">
                      <span nz-icon nzType="environment" nzTheme="outline"></span>
                      <span>{{ confirmedBooking?.address }}</span>
                    </div>
                    <div class="detail-row">
                      <span nz-icon nzType="dollar" nzTheme="outline"></span>
                      <span>Total: \${{ confirmedBooking?.totalAmount?.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
                <div nz-result-extra>
                  <button nz-button nzType="primary" routerLink="/my-bookings">View My Bookings</button>
                  <button nz-button routerLink="/">Continue Browsing</button>
                </div>
              </nz-result>
            </div>
          }
        </nz-spin>
      </div>
    </div>
  `,
  styles: [`
    .booking-page {
      padding: 100px 0 80px;
      background: var(--neutral-50);
      min-height: 100vh;
    }
    
    .booking-header {
      margin-bottom: 32px;
      
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--neutral-500);
        text-decoration: none;
        font-size: 14px;
        margin-bottom: 16px;
        
        &:hover {
          color: var(--primary-600);
        }
      }
      
      h1 {
        font-size: 2rem;
      }
    }
    
    .booking-steps {
      margin-bottom: 48px;
    }
    
    .booking-content {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
    }
    
    .booking-form {
      background: white;
      border-radius: var(--radius-xl);
      padding: 40px;
    }
    
    .step-content {
      margin-bottom: 32px;
      
      h2 {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }
      
      .step-description {
        color: var(--neutral-500);
        margin-bottom: 32px;
      }
    }
    
    .form-group {
      margin-bottom: 24px;
      
      label {
        display: block;
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--neutral-700);
      }
      
      input, textarea {
        width: 100%;
      }
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
    }
    
    .time-slots {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      
      .time-slot {
        padding: 14px;
        border: 2px solid var(--neutral-200);
        border-radius: var(--radius-md);
        background: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          border-color: var(--primary-300);
        }
        
        &.selected {
          border-color: var(--primary-500);
          background: var(--primary-50);
          color: var(--primary-700);
        }
      }
    }
    
    .review-section {
      padding: 20px;
      background: var(--neutral-50);
      border-radius: var(--radius-lg);
      margin-bottom: 16px;
      
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: var(--neutral-600);
        margin-bottom: 12px;
        
        span[nz-icon] {
          color: var(--primary-500);
        }
      }
      
      p {
        margin: 4px 0;
        color: var(--neutral-800);
      }
    }
    
    .step-actions {
      display: flex;
      justify-content: space-between;
      padding-top: 24px;
      border-top: 1px solid var(--neutral-100);
      
      button {
        min-width: 140px;
      }
    }
    
    .booking-sidebar {
      position: sticky;
      top: 100px;
      align-self: start;
    }
    
    .summary-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 28px;
      box-shadow: var(--shadow-lg);
      
      h3 {
        font-size: 1.125rem;
        margin-bottom: 24px;
      }
      
      .service-info {
        display: flex;
        gap: 16px;
        
        .service-image {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          background-size: cover;
          background-position: center;
        }
        
        .service-details {
          .category {
            font-size: 12px;
            color: var(--primary-600);
            font-weight: 600;
            text-transform: uppercase;
          }
          
          h4 {
            font-size: 1rem;
            margin-top: 4px;
          }
        }
      }
      
      .price-breakdown {
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          color: var(--neutral-600);
          
          &.total {
            font-weight: 700;
            font-size: 1.25rem;
            color: var(--neutral-900);
          }
        }
      }
      
      .guarantee {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        background: var(--primary-50);
        border-radius: var(--radius-md);
        color: var(--primary-700);
        font-size: 13px;
        font-weight: 500;
        
        span[nz-icon] {
          font-size: 16px;
        }
      }
    }
    
    .booking-success {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: var(--radius-xl);
      padding: 48px;
      
      .success-details {
        background: var(--neutral-50);
        border-radius: var(--radius-lg);
        padding: 24px;
        margin: 24px 0;
        
        .detail-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          
          span[nz-icon] {
            color: var(--primary-500);
            font-size: 18px;
          }
        }
      }
    }
    
    @media (max-width: 1024px) {
      .booking-content {
        grid-template-columns: 1fr;
      }
      
      .booking-sidebar {
        position: static;
        order: -1;
      }
    }
    
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .time-slots {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `],
  providers: [NzMessageService]
})
export class BookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private serviceService = inject(ServiceService);
  private bookingService = inject(BookingService);
  authService = inject(AuthService);
  
  service: Service | null = null;
  currentStep = 0;
  loading = false;
  submitting = false;
  bookingComplete = false;
  confirmedBooking: Booking | null = null;
  
  selectedDate: Date | null = null;
  selectedTime = '';
  
  bookingData: Partial<CreateBookingRequest> = {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  };
  
  timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
  ];
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['serviceId']) {
        this.loadService(+params['serviceId']);
      }
    });
    
    const user = this.authService.currentUser();
    if (user) {
      this.bookingData.address = user.address || '';
      this.bookingData.city = user.city || '';
      this.bookingData.state = user.state || '';
      this.bookingData.zipCode = user.zipCode || '';
    }
  }
  
  loadService(id: number): void {
    this.loading = true;
    this.serviceService.getById(id).subscribe(response => {
      this.loading = false;
      if (response.success) {
        this.service = response.data;
      }
    });
  }
  
  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current < today;
  };
  
  selectTime(time: string): void {
    this.selectedTime = time;
  }
  
  canProceed(): boolean {
    switch (this.currentStep) {
      case 0:
        return !!this.bookingData.address;
      case 1:
        return !!this.selectedDate && !!this.selectedTime;
      default:
        return true;
    }
  }
  
  nextStep(): void {
    if (this.canProceed()) {
      this.currentStep++;
    }
  }
  
  previousStep(): void {
    this.currentStep--;
  }
  
  confirmBooking(): void {
    if (!this.service || !this.selectedDate || !this.selectedTime) return;
    
    const timeParts = this.selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) return;
    
    let hours = parseInt(timeParts[1]);
    const minutes = timeParts[2];
    const period = timeParts[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const bookingTime = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    
    const request: CreateBookingRequest = {
      serviceId: this.service.id,
      bookingDate: this.selectedDate.toISOString().split('T')[0],
      bookingTime: bookingTime,
      address: this.bookingData.address || '',
      city: this.bookingData.city,
      state: this.bookingData.state,
      zipCode: this.bookingData.zipCode,
      notes: this.bookingData.notes
    };
    
    this.submitting = true;
    this.bookingService.create(request).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          this.bookingComplete = true;
          this.confirmedBooking = response.data;
          this.message.success('Booking confirmed successfully!');
        }
      },
      error: (error) => {
        this.submitting = false;
        this.message.error('Failed to create booking. Please try again.');
      }
    });
  }
}


