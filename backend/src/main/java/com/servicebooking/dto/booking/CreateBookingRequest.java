package com.servicebooking.dto.booking;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateBookingRequest {
    @NotNull(message = "Service is required")
    private Long serviceId;
    
    private Long providerId;
    
    @NotNull(message = "Booking date is required")
    @Future(message = "Booking date must be in the future")
    private LocalDate bookingDate;
    
    @NotNull(message = "Booking time is required")
    private LocalTime bookingTime;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    private String city;
    
    private String state;
    
    private String zipCode;
    
    private Double latitude;
    
    private Double longitude;
    
    private String notes;
    
    private String promoCode;
}

