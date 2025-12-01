export interface Service {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  durationMinutes?: number;
  image?: string;
  features?: string[];
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  isFeatured: boolean;
  averageRating?: number;
  totalBookings?: number;
}


