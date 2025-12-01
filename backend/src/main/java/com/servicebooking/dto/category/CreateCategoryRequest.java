package com.servicebooking.dto.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String description;
    private String icon;
    private String image;
    private Integer displayOrder;
}

