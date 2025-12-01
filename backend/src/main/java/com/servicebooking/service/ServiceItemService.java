package com.servicebooking.service;

import com.servicebooking.dto.common.PageResponse;
import com.servicebooking.dto.service.CreateServiceRequest;
import com.servicebooking.dto.service.ServiceDTO;
import com.servicebooking.entity.Category;
import com.servicebooking.entity.ServiceItem;
import com.servicebooking.exception.ResourceNotFoundException;
import com.servicebooking.repository.CategoryRepository;
import com.servicebooking.repository.ServiceItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ServiceItemService {
    
    private final ServiceItemRepository serviceItemRepository;
    private final CategoryRepository categoryRepository;
    
    public PageResponse<ServiceDTO> getAllServices(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<ServiceItem> servicePage = serviceItemRepository.findByIsActiveTrue(pageable);
        
        Page<ServiceDTO> dtoPage = servicePage.map(this::mapToDTO);
        return PageResponse.of(dtoPage);
    }
    
    public ServiceDTO getServiceById(Long id) {
        ServiceItem service = serviceItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return mapToDTO(service);
    }
    
    public List<ServiceDTO> getServicesByCategory(Long categoryId) {
        return serviceItemRepository.findByCategoryId(categoryId)
                .stream()
                .filter(ServiceItem::getIsActive)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ServiceDTO> getFeaturedServices() {
        return serviceItemRepository.findByIsActiveTrueAndIsFeaturedTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ServiceDTO> getPopularServices(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return serviceItemRepository.findPopularServices(pageable)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ServiceDTO> getTopRatedServices(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return serviceItemRepository.findTopRatedServices(pageable)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public PageResponse<ServiceDTO> searchServices(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ServiceItem> servicePage = serviceItemRepository.searchServices(query, pageable);
        
        Page<ServiceDTO> dtoPage = servicePage.map(this::mapToDTO);
        return PageResponse.of(dtoPage);
    }
    
    @Transactional
    public ServiceDTO createService(CreateServiceRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        ServiceItem service = ServiceItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .basePrice(request.getBasePrice())
                .durationMinutes(request.getDurationMinutes())
                .image(request.getImage())
                .features(request.getFeatures() != null ? String.join(",", request.getFeatures()) : null)
                .category(category)
                .isActive(true)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .averageRating(0.0)
                .totalBookings(0)
                .build();
        
        service = serviceItemRepository.save(service);
        return mapToDTO(service);
    }
    
    @Transactional
    public ServiceDTO updateService(Long id, CreateServiceRequest request) {
        ServiceItem service = serviceItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        
        if (!service.getCategory().getId().equals(request.getCategoryId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            service.setCategory(category);
        }
        
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setBasePrice(request.getBasePrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setImage(request.getImage());
        service.setFeatures(request.getFeatures() != null ? String.join(",", request.getFeatures()) : null);
        service.setIsFeatured(request.getIsFeatured());
        
        service = serviceItemRepository.save(service);
        return mapToDTO(service);
    }
    
    @Transactional
    public void deleteService(Long id) {
        ServiceItem service = serviceItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        service.setIsActive(false);
        serviceItemRepository.save(service);
    }
    
    private ServiceDTO mapToDTO(ServiceItem service) {
        List<String> features = service.getFeatures() != null 
                ? Arrays.asList(service.getFeatures().split(","))
                : Collections.emptyList();
        
        return ServiceDTO.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .basePrice(service.getBasePrice())
                .durationMinutes(service.getDurationMinutes())
                .image(service.getImage())
                .features(features)
                .categoryId(service.getCategory().getId())
                .categoryName(service.getCategory().getName())
                .isActive(service.getIsActive())
                .isFeatured(service.getIsFeatured())
                .averageRating(service.getAverageRating())
                .totalBookings(service.getTotalBookings())
                .build();
    }
}

