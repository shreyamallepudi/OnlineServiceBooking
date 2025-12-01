package com.servicebooking.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderSummaryDTO {
    private Long id;
    private Long userId;
    private String name;
    private String profileImage;
    private Double averageRating;
    private Integer totalReviews;
    private Integer completedJobs;
    private Boolean isVerified;
}

