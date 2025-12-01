package com.servicebooking.dto.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Integer durationMinutes;
    private String image;
    private List<String> features;
    private Long categoryId;
    private String categoryName;
    private Boolean isActive;
    private Boolean isFeatured;
    private Double averageRating;
    private Integer totalBookings;
}

