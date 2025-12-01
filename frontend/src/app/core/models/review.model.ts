export interface Review {
  id: number;
  bookingId: number;
  customerName: string;
  customerImage?: string;
  providerId: number;
  providerName: string;
  rating: number;
  comment?: string;
  punctualityRating?: number;
  professionalismRating?: number;
  qualityRating?: number;
  valueRating?: number;
  providerResponse?: string;
  providerResponseAt?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  bookingId: number;
  rating: number;
  comment?: string;
  punctualityRating?: number;
  professionalismRating?: number;
  qualityRating?: number;
  valueRating?: number;
}


