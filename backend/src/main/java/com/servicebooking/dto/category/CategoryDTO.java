package com.servicebooking.dto.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String image;
    private Boolean isActive;
    private Integer displayOrder;
    private Integer serviceCount;
}

