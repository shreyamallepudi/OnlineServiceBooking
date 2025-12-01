package com.servicebooking.controller;

import com.servicebooking.dto.common.ApiResponse;
import com.servicebooking.dto.common.PageResponse;
import com.servicebooking.dto.service.CreateServiceRequest;
import com.servicebooking.dto.service.ServiceDTO;
import com.servicebooking.service.ServiceItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Tag(name = "Services", description = "Service management endpoints")
public class ServiceController {
    
    private final ServiceItemService serviceItemService;
    
    @GetMapping
    @Operation(summary = "Get all services with pagination")
    public ResponseEntity<ApiResponse<PageResponse<ServiceDTO>>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PageResponse<ServiceDTO> services = serviceItemService.getAllServices(page, size);
        return ResponseEntity.ok(ApiResponse.success(services));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get service by ID")
    public ResponseEntity<ApiResponse<ServiceDTO>> getServiceById(@PathVariable Long id) {
        ServiceDTO service = serviceItemService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.success(service));
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get services by category")
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getServicesByCategory(@PathVariable Long categoryId) {
        List<ServiceDTO> services = serviceItemService.getServicesByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success(services));
    }
    
    @GetMapping("/featured")
    @Operation(summary = "Get featured services")
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getFeaturedServices() {
        List<ServiceDTO> services = serviceItemService.getFeaturedServices();
        return ResponseEntity.ok(ApiResponse.success(services));
    }
    
    @GetMapping("/popular")
    @Operation(summary = "Get popular services")
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getPopularServices(
            @RequestParam(defaultValue = "8") int limit) {
        List<ServiceDTO> services = serviceItemService.getPopularServices(limit);
        return ResponseEntity.ok(ApiResponse.success(services));
    }
    
    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated services")
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getTopRatedServices(
            @RequestParam(defaultValue = "8") int limit) {
        List<ServiceDTO> services = serviceItemService.getTopRatedServices(limit);
        return ResponseEntity.ok(ApiResponse.success(services));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search services")
    public ResponseEntity<ApiResponse<PageResponse<ServiceDTO>>> searchServices(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PageResponse<ServiceDTO> services = serviceItemService.searchServices(query, page, size);
        return ResponseEntity.ok(ApiResponse.success(services));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new service (Admin only)")
    public ResponseEntity<ApiResponse<ServiceDTO>> createService(@Valid @RequestBody CreateServiceRequest request) {
        ServiceDTO service = serviceItemService.createService(request);
        return ResponseEntity.ok(ApiResponse.success("Service created successfully", service));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a service (Admin only)")
    public ResponseEntity<ApiResponse<ServiceDTO>> updateService(
            @PathVariable Long id, 
            @Valid @RequestBody CreateServiceRequest request) {
        ServiceDTO service = serviceItemService.updateService(id, request);
        return ResponseEntity.ok(ApiResponse.success("Service updated successfully", service));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a service (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        serviceItemService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.success("Service deleted successfully", null));
    }
}

