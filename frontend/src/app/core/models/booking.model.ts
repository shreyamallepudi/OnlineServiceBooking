import { User } from './user.model';
import { Service } from './service.model';

export interface ProviderSummary {
  id: number;
  userId: number;
  name: string;
  profileImage?: string;
  averageRating?: number;
  totalReviews?: number;
  completedJobs?: number;
  isVerified: boolean;
}

export interface Booking {
  id: number;
  bookingNumber: string;
  customer: User;
  provider?: ProviderSummary;
  service: Service;
  bookingDate: string;
  bookingTime: string;
  endTime?: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  baseAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount: number;
  status: BookingStatus;
  cancellationReason?: string;
  confirmedAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  review?: any;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface CreateBookingRequest {
  serviceId: number;
  providerId?: number;
  bookingDate: string;
  bookingTime: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  promoCode?: string;
}


