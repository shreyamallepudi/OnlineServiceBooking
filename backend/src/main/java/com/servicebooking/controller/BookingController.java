package com.servicebooking.controller;

import com.servicebooking.dto.booking.BookingDTO;
import com.servicebooking.dto.booking.CreateBookingRequest;
import com.servicebooking.dto.common.ApiResponse;
import com.servicebooking.dto.common.PageResponse;
import com.servicebooking.enums.BookingStatus;
import com.servicebooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management endpoints")
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<ApiResponse<BookingDTO>> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        BookingDTO booking = bookingService.createBooking(request);
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<ApiResponse<BookingDTO>> getBookingById(@PathVariable Long id) {
        BookingDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }
    
    @GetMapping("/number/{bookingNumber}")
    @Operation(summary = "Get booking by booking number")
    public ResponseEntity<ApiResponse<BookingDTO>> getBookingByNumber(@PathVariable String bookingNumber) {
        BookingDTO booking = bookingService.getBookingByNumber(bookingNumber);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }
    
    @GetMapping("/my-bookings")
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<ApiResponse<PageResponse<BookingDTO>>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<BookingDTO> bookings = bookingService.getCustomerBookings(page, size);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get current user's active bookings")
    public ResponseEntity<ApiResponse<List<BookingDTO>>> getActiveBookings() {
        List<BookingDTO> bookings = bookingService.getActiveBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update booking status")
    public ResponseEntity<ApiResponse<BookingDTO>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String reason) {
        BookingDTO booking = bookingService.updateBookingStatus(id, status, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated", booking));
    }
    
    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingDTO>> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        BookingDTO booking = bookingService.updateBookingStatus(id, BookingStatus.CANCELLED, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }
    
    @PatchMapping("/{id}/assign-provider")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVIDER')")
    @Operation(summary = "Assign provider to booking")
    public ResponseEntity<ApiResponse<BookingDTO>> assignProvider(
            @PathVariable Long id,
            @RequestParam Long providerId) {
        BookingDTO booking = bookingService.assignProvider(id, providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider assigned successfully", booking));
    }
}

