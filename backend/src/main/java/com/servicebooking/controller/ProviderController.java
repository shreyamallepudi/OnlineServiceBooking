package com.servicebooking.controller;

import com.servicebooking.dto.booking.BookingDTO;
import com.servicebooking.dto.common.ApiResponse;
import com.servicebooking.dto.common.PageResponse;
import com.servicebooking.dto.provider.ServiceProviderDTO;
import com.servicebooking.service.BookingService;
import com.servicebooking.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
@Tag(name = "Providers", description = "Service provider endpoints")
public class ProviderController {
    
    private final ProviderService providerService;
    private final BookingService bookingService;
    
    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated providers")
    public ResponseEntity<ApiResponse<List<ServiceProviderDTO>>> getTopRatedProviders(
            @RequestParam(defaultValue = "8") int limit) {
        List<ServiceProviderDTO> providers = providerService.getTopRatedProviders(limit);
        return ResponseEntity.ok(ApiResponse.success(providers));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get provider by ID")
    public ResponseEntity<ApiResponse<ServiceProviderDTO>> getProviderById(@PathVariable Long id) {
        ServiceProviderDTO provider = providerService.getProviderById(id);
        return ResponseEntity.ok(ApiResponse.success(provider));
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get provider by user ID")
    public ResponseEntity<ApiResponse<ServiceProviderDTO>> getProviderByUserId(@PathVariable Long userId) {
        ServiceProviderDTO provider = providerService.getProviderByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(provider));
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get providers by category")
    public ResponseEntity<ApiResponse<PageResponse<ServiceProviderDTO>>> getProvidersByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PageResponse<ServiceProviderDTO> providers = providerService.getProvidersByCategory(categoryId, page, size);
        return ResponseEntity.ok(ApiResponse.success(providers));
    }
    
    @GetMapping("/area/{area}")
    @Operation(summary = "Get providers by service area")
    public ResponseEntity<ApiResponse<List<ServiceProviderDTO>>> getProvidersByArea(@PathVariable String area) {
        List<ServiceProviderDTO> providers = providerService.getProvidersByArea(area);
        return ResponseEntity.ok(ApiResponse.success(providers));
    }
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('PROVIDER')")
    @Operation(summary = "Get current provider's profile")
    public ResponseEntity<ApiResponse<ServiceProviderDTO>> getMyProfile() {
        ServiceProviderDTO provider = providerService.getCurrentProviderProfile();
        return ResponseEntity.ok(ApiResponse.success(provider));
    }
    
    @PutMapping("/profile")
    @PreAuthorize("hasRole('PROVIDER')")
    @Operation(summary = "Update provider profile")
    public ResponseEntity<ApiResponse<ServiceProviderDTO>> updateProfile(@RequestBody ServiceProviderDTO dto) {
        ServiceProviderDTO provider = providerService.updateProfile(dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", provider));
    }
    
    @PatchMapping("/toggle-availability")
    @PreAuthorize("hasRole('PROVIDER')")
    @Operation(summary = "Toggle provider availability")
    public ResponseEntity<ApiResponse<ServiceProviderDTO>> toggleAvailability() {
        ServiceProviderDTO provider = providerService.toggleAvailability();
        return ResponseEntity.ok(ApiResponse.success(provider));
    }
    
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('PROVIDER')")
    @Operation(summary = "Get provider's bookings")
    public ResponseEntity<ApiResponse<PageResponse<BookingDTO>>> getProviderBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<BookingDTO> bookings = bookingService.getProviderBookings(page, size);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
}

