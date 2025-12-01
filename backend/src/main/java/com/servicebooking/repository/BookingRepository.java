package com.servicebooking.repository;

import com.servicebooking.entity.Booking;
import com.servicebooking.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingNumber(String bookingNumber);
    
    Page<Booking> findByCustomerId(Long customerId, Pageable pageable);
    
    Page<Booking> findByProviderId(Long providerId, Pageable pageable);
    
    List<Booking> findByCustomerIdAndStatus(Long customerId, BookingStatus status);
    
    List<Booking> findByProviderIdAndStatus(Long providerId, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.provider.id = :providerId AND b.bookingDate = :date")
    List<Booking> findByProviderIdAndDate(@Param("providerId") Long providerId, @Param("date") LocalDate date);
    
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId AND b.status IN :statuses ORDER BY b.bookingDate DESC")
    List<Booking> findActiveBookingsByCustomer(@Param("customerId") Long customerId, @Param("statuses") List<BookingStatus> statuses);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider.id = :providerId AND b.status = 'COMPLETED'")
    Long countCompletedBookingsByProvider(@Param("providerId") Long providerId);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate = :date AND b.status = 'CONFIRMED'")
    List<Booking> findTodayBookings(@Param("date") LocalDate date);
}

