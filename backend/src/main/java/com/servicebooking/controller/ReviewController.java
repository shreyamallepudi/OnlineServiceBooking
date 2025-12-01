package com.servicebooking.controller;

import com.servicebooking.dto.common.ApiResponse;
import com.servicebooking.dto.common.PageResponse;
import com.servicebooking.dto.review.CreateReviewRequest;
import com.servicebooking.dto.review.ReviewDTO;
import com.servicebooking.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Review management endpoints")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @PostMapping
    @Operation(summary = "Create a review for a completed booking")
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(@Valid @RequestBody CreateReviewRequest request) {
        ReviewDTO review = reviewService.createReview(request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", review));
    }
    
    @GetMapping("/provider/{providerId}")
    @Operation(summary = "Get reviews for a provider")
    public ResponseEntity<ApiResponse<PageResponse<ReviewDTO>>> getProviderReviews(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<ReviewDTO> reviews = reviewService.getProviderReviews(providerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }
    
    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get review by booking ID")
    public ResponseEntity<ApiResponse<ReviewDTO>> getReviewByBookingId(@PathVariable Long bookingId) {
        ReviewDTO review = reviewService.getReviewByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.success(review));
    }
    
    @PatchMapping("/{reviewId}/respond")
    @Operation(summary = "Provider responds to a review")
    public ResponseEntity<ApiResponse<ReviewDTO>> respondToReview(
            @PathVariable Long reviewId,
            @RequestParam String response) {
        ReviewDTO review = reviewService.respondToReview(reviewId, response);
        return ResponseEntity.ok(ApiResponse.success("Response added successfully", review));
    }
}

