package com.servicebooking.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long bookingId;
    private String customerName;
    private String customerImage;
    private Long providerId;
    private String providerName;
    private Integer rating;
    private String comment;
    private Integer punctualityRating;
    private Integer professionalismRating;
    private Integer qualityRating;
    private Integer valueRating;
    private String providerResponse;
    private LocalDateTime providerResponseAt;
    private LocalDateTime createdAt;
}

