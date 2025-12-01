package com.servicebooking.service;

import com.servicebooking.dto.booking.BookingDTO;
import com.servicebooking.dto.booking.CreateBookingRequest;
import com.servicebooking.dto.booking.ProviderSummaryDTO;
import com.servicebooking.dto.common.PageResponse;
import com.servicebooking.dto.service.ServiceDTO;
import com.servicebooking.dto.user.UserDTO;
import com.servicebooking.entity.Booking;
import com.servicebooking.entity.ServiceItem;
import com.servicebooking.entity.ServiceProvider;
import com.servicebooking.entity.User;
import com.servicebooking.enums.BookingStatus;
import com.servicebooking.exception.BadRequestException;
import com.servicebooking.exception.ResourceNotFoundException;
import com.servicebooking.repository.BookingRepository;
import com.servicebooking.repository.ServiceItemRepository;
import com.servicebooking.repository.ServiceProviderRepository;
import com.servicebooking.repository.UserRepository;
import com.servicebooking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final ServiceProviderRepository providerRepository;
    private final UserRepository userRepository;
    
    private static final BigDecimal TAX_RATE = new BigDecimal("0.10");
    
    @Transactional
    public BookingDTO createBooking(CreateBookingRequest request) {
        User customer = getCurrentUser();
        
        ServiceItem serviceItem = serviceItemRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        
        ServiceProvider provider = null;
        if (request.getProviderId() != null) {
            provider = providerRepository.findById(request.getProviderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        }
        
        BigDecimal baseAmount = serviceItem.getBasePrice();
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal taxableAmount = baseAmount.subtract(discountAmount);
        BigDecimal taxAmount = taxableAmount.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = taxableAmount.add(taxAmount);
        
        String bookingNumber = "BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Booking booking = Booking.builder()
                .bookingNumber(bookingNumber)
                .customer(customer)
                .provider(provider)
                .service(serviceItem)
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .notes(request.getNotes())
                .baseAmount(baseAmount)
                .discountAmount(discountAmount)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .build();
        
        booking = bookingRepository.save(booking);
        
        serviceItem.setTotalBookings(
            (serviceItem.getTotalBookings() != null ? serviceItem.getTotalBookings() : 0) + 1
        );
        serviceItemRepository.save(serviceItem);
        
        return mapToDTO(booking);
    }
    
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return mapToDTO(booking);
    }
    
    public BookingDTO getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return mapToDTO(booking);
    }
    
    public PageResponse<BookingDTO> getCustomerBookings(int page, int size) {
        User customer = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage = bookingRepository.findByCustomerId(customer.getId(), pageable);
        
        Page<BookingDTO> dtoPage = bookingPage.map(this::mapToDTO);
        return PageResponse.of(dtoPage);
    }
    
    public PageResponse<BookingDTO> getProviderBookings(int page, int size) {
        User user = getCurrentUser();
        ServiceProvider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Provider profile not found"));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("bookingDate").descending());
        Page<Booking> bookingPage = bookingRepository.findByProviderId(provider.getId(), pageable);
        
        Page<BookingDTO> dtoPage = bookingPage.map(this::mapToDTO);
        return PageResponse.of(dtoPage);
    }
    
    public List<BookingDTO> getActiveBookings() {
        User customer = getCurrentUser();
        List<BookingStatus> activeStatuses = Arrays.asList(
            BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS
        );
        
        return bookingRepository.findActiveBookingsByCustomer(customer.getId(), activeStatuses)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    
    @Transactional
    public BookingDTO updateBookingStatus(Long id, BookingStatus status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        booking.setStatus(status);
        
        switch (status) {
            case PENDING -> {}
            case CONFIRMED -> booking.setConfirmedAt(LocalDateTime.now());
            case IN_PROGRESS -> booking.setStartedAt(LocalDateTime.now());
            case COMPLETED -> {
                booking.setCompletedAt(LocalDateTime.now());
                if (booking.getProvider() != null) {
                    ServiceProvider provider = booking.getProvider();
                    provider.setCompletedJobs(
                        (provider.getCompletedJobs() != null ? provider.getCompletedJobs() : 0) + 1
                    );
                    provider.setTotalEarnings(
                        (provider.getTotalEarnings() != null ? provider.getTotalEarnings() : BigDecimal.ZERO)
                            .add(booking.getTotalAmount())
                    );
                    providerRepository.save(provider);
                }
            }
            case CANCELLED, REJECTED -> {
                booking.setCancelledAt(LocalDateTime.now());
                booking.setCancellationReason(reason);
            }
        }
        
        booking = bookingRepository.save(booking);
        return mapToDTO(booking);
    }
    
    @Transactional
    public BookingDTO assignProvider(Long bookingId, Long providerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        ServiceProvider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        
        booking.setProvider(provider);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setConfirmedAt(LocalDateTime.now());
        
        booking = bookingRepository.save(booking);
        return mapToDTO(booking);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
    }
    
    private BookingDTO mapToDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .bookingNumber(booking.getBookingNumber())
                .customer(mapUserDTO(booking.getCustomer()))
                .provider(booking.getProvider() != null ? mapProviderSummary(booking.getProvider()) : null)
                .service(mapServiceDTO(booking.getService()))
                .bookingDate(booking.getBookingDate())
                .bookingTime(booking.getBookingTime())
                .endTime(booking.getEndTime())
                .address(booking.getAddress())
                .city(booking.getCity())
                .state(booking.getState())
                .zipCode(booking.getZipCode())
                .notes(booking.getNotes())
                .baseAmount(booking.getBaseAmount())
                .discountAmount(booking.getDiscountAmount())
                .taxAmount(booking.getTaxAmount())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .cancellationReason(booking.getCancellationReason())
                .confirmedAt(booking.getConfirmedAt())
                .startedAt(booking.getStartedAt())
                .completedAt(booking.getCompletedAt())
                .createdAt(booking.getCreatedAt())
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
                .build();
    }
    
    private ProviderSummaryDTO mapProviderSummary(ServiceProvider provider) {
        return ProviderSummaryDTO.builder()
                .id(provider.getId())
                .userId(provider.getUser().getId())
                .name(provider.getUser().getFullName())
                .profileImage(provider.getUser().getProfileImage())
                .averageRating(provider.getAverageRating())
                .totalReviews(provider.getTotalReviews())
                .completedJobs(provider.getCompletedJobs())
                .isVerified(provider.getIsVerified())
                .build();
    }
    
    private ServiceDTO mapServiceDTO(ServiceItem service) {
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
                .build();
    }
}

