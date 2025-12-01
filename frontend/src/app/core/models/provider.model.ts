import { User } from './user.model';
import { Category } from './category.model';

export interface ServiceProvider {
  id: number;
  user: User;
  bio?: string;
  experienceYears?: number;
  skills?: string[];
  certifications?: string[];
  serviceArea?: string;
  serviceRadius?: number;
  isAvailable: boolean;
  isVerified: boolean;
  averageRating?: number;
  totalReviews?: number;
  completedJobs?: number;
  totalEarnings?: number;
  categories?: Category[];
}


