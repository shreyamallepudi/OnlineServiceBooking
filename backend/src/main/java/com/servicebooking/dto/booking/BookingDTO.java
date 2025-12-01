package com.servicebooking.dto.booking;

import com.servicebooking.dto.service.ServiceDTO;
import com.servicebooking.dto.user.UserDTO;
import com.servicebooking.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private String bookingNumber;
    private UserDTO customer;
    private ProviderSummaryDTO provider;
    private ServiceDTO service;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private LocalTime endTime;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String notes;
    private BigDecimal baseAmount;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private String cancellationReason;
    private LocalDateTime confirmedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
}

