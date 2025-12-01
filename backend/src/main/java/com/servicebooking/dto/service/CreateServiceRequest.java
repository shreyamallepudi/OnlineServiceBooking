package com.servicebooking.dto.service;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateServiceRequest {
    @NotBlank(message = "Service name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private BigDecimal basePrice;
    
    private Integer durationMinutes;
    
    private String image;
    
    private List<String> features;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    private Boolean isFeatured = false;
}

