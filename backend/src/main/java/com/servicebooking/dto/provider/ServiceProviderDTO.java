package com.servicebooking.dto.provider;

import com.servicebooking.dto.category.CategoryDTO;
import com.servicebooking.dto.user.UserDTO;
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
public class ServiceProviderDTO {
    private Long id;
    private UserDTO user;
    private String bio;
    private Integer experienceYears;
    private List<String> skills;
    private List<String> certifications;
    private String serviceArea;
    private Integer serviceRadius;
    private Boolean isAvailable;
    private Boolean isVerified;
    private Double averageRating;
    private Integer totalReviews;
    private Integer completedJobs;
    private BigDecimal totalEarnings;
    private List<CategoryDTO> categories;
}

