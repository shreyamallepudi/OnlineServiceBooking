package com.servicebooking.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReviewRequest {
    @NotNull(message = "Booking ID is required")
    private Long bookingId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;
    
    private String comment;
    
    @Min(value = 1) @Max(value = 5)
    private Integer punctualityRating;
    
    @Min(value = 1) @Max(value = 5)
    private Integer professionalismRating;
    
    @Min(value = 1) @Max(value = 5)
    private Integer qualityRating;
    
    @Min(value = 1) @Max(value = 5)
    private Integer valueRating;
}

