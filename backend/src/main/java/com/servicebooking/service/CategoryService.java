package com.servicebooking.service;

import com.servicebooking.dto.category.CategoryDTO;
import com.servicebooking.dto.category.CreateCategoryRequest;
import com.servicebooking.entity.Category;
import com.servicebooking.exception.BadRequestException;
import com.servicebooking.exception.ResourceNotFoundException;
import com.servicebooking.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return mapToDTO(category);
    }
    
    @Transactional
    public CategoryDTO createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category with this name already exists");
        }
        
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .icon(request.getIcon())
                .image(request.getImage())
                .displayOrder(request.getDisplayOrder())
                .isActive(true)
                .build();
        
        category = categoryRepository.save(category);
        return mapToDTO(category);
    }
    
    @Transactional
    public CategoryDTO updateCategory(Long id, CreateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        if (!category.getName().equals(request.getName()) && 
            categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category with this name already exists");
        }
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        category.setImage(request.getImage());
        category.setDisplayOrder(request.getDisplayOrder());
        
        category = categoryRepository.save(category);
        return mapToDTO(category);
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setIsActive(false);
        categoryRepository.save(category);
    }
    
    private CategoryDTO mapToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .icon(category.getIcon())
                .image(category.getImage())
                .isActive(category.getIsActive())
                .displayOrder(category.getDisplayOrder())
                .serviceCount(category.getServices() != null ? category.getServices().size() : 0)
                .build();
    }
}

