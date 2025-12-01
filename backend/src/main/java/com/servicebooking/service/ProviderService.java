package com.servicebooking.service;

import com.servicebooking.dto.category.CategoryDTO;
import com.servicebooking.dto.common.PageResponse;
import com.servicebooking.dto.provider.ServiceProviderDTO;
import com.servicebooking.dto.user.UserDTO;
import com.servicebooking.entity.Category;
import com.servicebooking.entity.ServiceProvider;
import com.servicebooking.entity.User;
import com.servicebooking.exception.BadRequestException;
import com.servicebooking.exception.ResourceNotFoundException;
import com.servicebooking.repository.CategoryRepository;
import com.servicebooking.repository.ServiceProviderRepository;
import com.servicebooking.repository.UserRepository;
import com.servicebooking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ProviderService {
    
    private final ServiceProviderRepository providerRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    
    public List<ServiceProviderDTO> getTopRatedProviders(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return providerRepository.findTopRatedProviders(pageable)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public ServiceProviderDTO getProviderById(Long id) {
        ServiceProvider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        return mapToDTO(provider);
    }
    
    public ServiceProviderDTO getProviderByUserId(Long userId) {
        ServiceProvider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        return mapToDTO(provider);
    }
    
    public PageResponse<ServiceProviderDTO> getProvidersByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ServiceProvider> providerPage = providerRepository.findByCategoryId(categoryId, pageable);
        
        Page<ServiceProviderDTO> dtoPage = providerPage.map(this::mapToDTO);
        return PageResponse.of(dtoPage);
    }
    
    public List<ServiceProviderDTO> getProvidersByArea(String area) {
        return providerRepository.findByServiceArea(area)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public ServiceProviderDTO getCurrentProviderProfile() {
        User user = getCurrentUser();
        ServiceProvider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        return mapToDTO(provider);
    }
    
    @Transactional
    public ServiceProviderDTO updateProfile(ServiceProviderDTO dto) {
        User user = getCurrentUser();
        ServiceProvider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        
        provider.setBio(dto.getBio());
        provider.setExperienceYears(dto.getExperienceYears());
        provider.setSkills(dto.getSkills() != null ? String.join(",", dto.getSkills()) : null);
        provider.setCertifications(dto.getCertifications() != null ? String.join(",", dto.getCertifications()) : null);
        provider.setServiceArea(dto.getServiceArea());
        provider.setServiceRadius(dto.getServiceRadius());
        
        if (dto.getCategories() != null && !dto.getCategories().isEmpty()) {
            Set<Category> categories = new HashSet<>();
            for (CategoryDTO catDto : dto.getCategories()) {
                Category category = categoryRepository.findById(catDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + catDto.getId()));
                categories.add(category);
            }
            provider.setCategories(categories);
        }
        
        provider = providerRepository.save(provider);
        return mapToDTO(provider);
    }
    
    @Transactional
    public ServiceProviderDTO toggleAvailability() {
        User user = getCurrentUser();
        ServiceProvider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        
        provider.setIsAvailable(!provider.getIsAvailable());
        provider = providerRepository.save(provider);
        return mapToDTO(provider);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }
    
    private ServiceProviderDTO mapToDTO(ServiceProvider provider) {
        List<String> skills = provider.getSkills() != null 
                ? Arrays.asList(provider.getSkills().split(","))
                : Collections.emptyList();
        
        List<String> certifications = provider.getCertifications() != null 
                ? Arrays.asList(provider.getCertifications().split(","))
                : Collections.emptyList();
        
        List<CategoryDTO> categories = provider.getCategories() != null 
                ? provider.getCategories().stream()
                    .map(cat -> CategoryDTO.builder()
                            .id(cat.getId())
                            .name(cat.getName())
                            .icon(cat.getIcon())
                            .build())
                    .collect(Collectors.toList())
                : Collections.emptyList();
        
        return ServiceProviderDTO.builder()
                .id(provider.getId())
                .user(mapUserDTO(provider.getUser()))
                .bio(provider.getBio())
                .experienceYears(provider.getExperienceYears())
                .skills(skills)
                .certifications(certifications)
                .serviceArea(provider.getServiceArea())
                .serviceRadius(provider.getServiceRadius())
                .isAvailable(provider.getIsAvailable())
                .isVerified(provider.getIsVerified())
                .averageRating(provider.getAverageRating())
                .totalReviews(provider.getTotalReviews())
                .completedJobs(provider.getCompletedJobs())
                .totalEarnings(provider.getTotalEarnings())
                .categories(categories)
                .build();
    }
    
    private UserDTO mapUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .zipCode(user.getZipCode())
                .build();
    }
}

