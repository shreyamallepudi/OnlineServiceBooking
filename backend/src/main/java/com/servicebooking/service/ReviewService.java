package com.servicebooking.service;

import com.servicebooking.dto.common.PageResponse;
import com.servicebooking.dto.review.CreateReviewRequest;
import com.servicebooking.dto.review.ReviewDTO;
import com.servicebooking.entity.Booking;
import com.servicebooking.entity.Review;
import com.servicebooking.entity.ServiceProvider;
import com.servicebooking.entity.User;
import com.servicebooking.enums.BookingStatus;
import com.servicebooking.exception.BadRequestException;
import com.servicebooking.exception.ResourceNotFoundException;
import com.servicebooking.repository.BookingRepository;
import com.servicebooking.repository.ReviewRepository;
import com.servicebooking.repository.ServiceProviderRepository;
import com.servicebooking.repository.UserRepository;
import com.servicebooking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ServiceProviderRepository providerRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public ReviewDTO createReview(CreateReviewRequest request) {
        User customer = getCurrentUser();
        
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new BadRequestException("You can only review your own bookings");
        }
        
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("You can only review completed bookings");
        }
        
        if (reviewRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this booking");
        }
        
        ServiceProvider provider = booking.getProvider();
        if (provider == null) {
            throw new BadRequestException("No provider assigned to this booking");
        }
        
        Review review = Review.builder()
                .booking(booking)
                .customer(customer)
                .provider(provider)
                .rating(request.getRating())
                .comment(request.getComment())
                .punctualityRating(request.getPunctualityRating())
                .professionalismRating(request.getProfessionalismRating())
                .qualityRating(request.getQualityRating())
                .valueRating(request.getValueRating())
                .isVisible(true)
                .build();
        
        review = reviewRepository.save(review);
        
        updateProviderRating(provider);
        
        return mapToDTO(review);
    }
    
    public PageResponse<ReviewDTO> getProviderReviews(Long providerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviewPage = reviewRepository.findByProviderIdAndIsVisibleTrue(providerId, pageable);
        
        Page<ReviewDTO> dtoPage = reviewPage.map(this::mapToDTO);
        return PageResponse.of(dtoPage);
    }
    
    public ReviewDTO getReviewByBookingId(Long bookingId) {
        Review review = reviewRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        return mapToDTO(review);
    }
    
    @Transactional
    public ReviewDTO respondToReview(Long reviewId, String response) {
        User user = getCurrentUser();
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        
        ServiceProvider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Provider profile not found"));
        
        if (!review.getProvider().getId().equals(provider.getId())) {
            throw new BadRequestException("You can only respond to your own reviews");
        }
        
        review.setProviderResponse(response);
        review.setProviderResponseAt(LocalDateTime.now());
        
        review = reviewRepository.save(review);
        return mapToDTO(review);
    }
    
    private void updateProviderRating(ServiceProvider provider) {
        Double avgRating = reviewRepository.getAverageRatingByProvider(provider.getId());
        Long totalReviews = reviewRepository.countByProviderId(provider.getId());
        
        provider.setAverageRating(avgRating != null ? avgRating : 0.0);
        provider.setTotalReviews(totalReviews != null ? totalReviews.intValue() : 0);
        
        providerRepository.save(provider);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }
    
    private ReviewDTO mapToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .customerName(review.getCustomer().getFullName())
                .customerImage(review.getCustomer().getProfileImage())
                .providerId(review.getProvider().getId())
                .providerName(review.getProvider().getUser().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .punctualityRating(review.getPunctualityRating())
                .professionalismRating(review.getProfessionalismRating())
                .qualityRating(review.getQualityRating())
                .valueRating(review.getValueRating())
                .providerResponse(review.getProviderResponse())
                .providerResponseAt(review.getProviderResponseAt())
                .createdAt(review.getCreatedAt())
                .build();
    }
}

